const Book = require('../models/Book');
const Circulation = require('../models/Circulation');
const path = require('path');
const fs = require('fs');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Book.find(JSON.parse(queryStr));
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query = query.or([
        { title: searchRegex },
        { author: searchRegex },
        { isbn: searchRegex },
        { category: searchRegex }
      ]);
    }
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const books = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      total,
      data: books
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin/Librarian)
exports.createBook = async (req, res, next) => {
  try {
    // Set available quantity equal to quantity initially
    if (req.body.quantity) {
      req.body.availableQuantity = req.body.quantity;
    }
    
    const book = await Book.create(req.body);
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Admin/Librarian)
exports.updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }
    
    // Ensure availableQuantity is updated correctly if quantity changes
    if (req.body.quantity !== undefined) {
      const diff = req.body.quantity - book.quantity;
      req.body.availableQuantity = book.availableQuantity + diff;
      
      // Ensure availableQuantity is not negative
      if (req.body.availableQuantity < 0) {
        req.body.availableQuantity = 0;
      }
    }
    
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin/Librarian)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }
    
    // Check if book is currently borrowed
    const activeBorrowings = await Circulation.find({
      book: req.params.id,
      status: { $in: ['borrowed', 'overdue', 'renewed'] }
    });
    
    if (activeBorrowings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book that is currently borrowed'
      });
    }
    
    await book.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload book cover image
// @route   PUT /api/books/:id/photo
// @access  Private (Admin/Librarian)
exports.bookPhotoUpload = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }
    
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }
    
    const file = req.files.file;
    
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }
    
    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return res.status(400).json({
        success: false,
        message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`
      });
    }
    
    // Create custom filename
    file.name = `book_cover_${book._id}${path.parse(file.name).ext}`;
    
    // Delete old image if exists and not default
    if (book.coverImage && book.coverImage !== 'default-book-cover.jpg') {
      const oldImagePath = path.join(__dirname, '../uploads', book.coverImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Problem with file upload'
        });
      }
      
      await Book.findByIdAndUpdate(req.params.id, { coverImage: file.name });
      
      res.status(200).json({
        success: true,
        data: file.name
      });
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review to book
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    req.body.name = req.user.name;
    
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${req.params.id}`
      });
    }
    
    // Check if user already reviewed this book
    const alreadyReviewed = book.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }
    
    book.reviews.push(req.body);
    
    await book.save();
    
    res.status(201).json({
      success: true,
      data: book
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
exports.getFeaturedBooks = async (req, res, next) => {
  try {
    const books = await Book.find({ featured: true }).limit(6);
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get new arrivals
// @route   GET /api/books/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(6);
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (err) {
    next(err);
  }
};