const Circulation = require('../models/Circulation');
const Book = require('../models/Book');
const User = require('../models/User');

// @desc    Get all circulation records
// @route   GET /api/circulation
// @access  Private (Admin/Librarian)
exports.getCirculations = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Circulation.find(JSON.parse(queryStr))
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
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
      query = query.sort('-issueDate');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Circulation.countDocuments(JSON.parse(queryStr));
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const circulations = await query;
    
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
      count: circulations.length,
      pagination,
      total,
      data: circulations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single circulation record
// @route   GET /api/circulation/:id
// @access  Private (Admin/Librarian/Owner)
exports.getCirculation = async (req, res, next) => {
  try {
    const circulation = await Circulation.findById(req.params.id)
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    if (!circulation) {
      return res.status(404).json({
        success: false,
        message: `Circulation record not found with id of ${req.params.id}`
      });
    }
    
    // Make sure user is circulation owner or admin/librarian
    if (
      circulation.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this circulation record'
      });
    }
    
    res.status(200).json({
      success: true,
      data: circulation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Issue book to user
// @route   POST /api/circulation/issue
// @access  Private (Admin/Librarian)
exports.issueBook = async (req, res, next) => {
  try {
    const { bookId, userId, dueDate } = req.body;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: `Book not found with id of ${bookId}`
      });
    }
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${userId}`
      });
    }
    
    // Check if book is available
    if (book.availableQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing'
      });
    }
    
    // Check if user already has this book
    const existingBorrowing = await Circulation.findOne({
      book: bookId,
      user: userId,
      status: { $in: ['borrowed', 'overdue', 'renewed'] }
    });
    
    if (existingBorrowing) {
      return res.status(400).json({
        success: false,
        message: 'User already has this book borrowed'
      });
    }
    
    // Create circulation record
    const circulation = await Circulation.create({
      book: bookId,
      user: userId,
      dueDate,
      issuedBy: req.user.id
    });
    
    // Update book available quantity
    book.availableQuantity -= 1;
    await book.save();
    
    // Populate book and user details
    const populatedCirculation = await Circulation.findById(circulation._id)
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    res.status(201).json({
      success: true,
      data: populatedCirculation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Return book
// @route   PUT /api/circulation/:id/return
// @access  Private (Admin/Librarian)
exports.returnBook = async (req, res, next) => {
  try {
    let circulation = await Circulation.findById(req.params.id);
    
    if (!circulation) {
      return res.status(404).json({
        success: false,
        message: `Circulation record not found with id of ${req.params.id}`
      });
    }
    
    // Check if book is already returned
    if (circulation.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book is already returned'
      });
    }
    
    // Update circulation record
    circulation.status = 'returned';
    circulation.returnDate = new Date();
    circulation.returnedTo = req.user.id;
    
    // Calculate fine if overdue
    if (circulation.dueDate < circulation.returnDate) {
      circulation.calculateFine();
    }
    
    await circulation.save();
    
    // Update book available quantity
    const book = await Book.findById(circulation.book);
    book.availableQuantity += 1;
    await book.save();
    
    // Populate book and user details
    const populatedCirculation = await Circulation.findById(circulation._id)
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    res.status(200).json({
      success: true,
      data: populatedCirculation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Renew book
// @route   PUT /api/circulation/:id/renew
// @access  Private (Admin/Librarian/Owner)
exports.renewBook = async (req, res, next) => {
  try {
    let circulation = await Circulation.findById(req.params.id);
    
    if (!circulation) {
      return res.status(404).json({
        success: false,
        message: `Circulation record not found with id of ${req.params.id}`
      });
    }
    
    // Check if book is already returned
    if (circulation.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot renew a returned book'
      });
    }
    
    // Check if renewal limit reached (max 2 renewals)
    if (circulation.renewalCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum renewal limit reached'
      });
    }
    
    // Make sure user is circulation owner or admin/librarian
    if (
      circulation.user.toString() !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to renew this book'
      });
    }
    
    // Update circulation record
    const currentDueDate = new Date(circulation.dueDate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(newDueDate.getDate() + 14); // Extend by 14 days
    
    circulation.dueDate = newDueDate;
    circulation.status = 'renewed';
    circulation.renewalCount += 1;
    
    await circulation.save();
    
    // Populate book and user details
    const populatedCirculation = await Circulation.findById(circulation._id)
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    res.status(200).json({
      success: true,
      data: populatedCirculation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's borrowed books
// @route   GET /api/circulation/user/:userId
// @access  Private (Admin/Librarian/Owner)
exports.getUserCirculations = async (req, res, next) => {
  try {
    // Make sure user is requesting their own records or is admin/librarian
    if (
      req.params.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view these records'
      });
    }
    
    const circulations = await Circulation.find({
      user: req.params.userId,
      status: { $in: ['borrowed', 'overdue', 'renewed'] }
    })
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      });
    
    res.status(200).json({
      success: true,
      count: circulations.length,
      data: circulations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's borrowing history
// @route   GET /api/circulation/history/:userId
// @access  Private (Admin/Librarian/Owner)
exports.getUserHistory = async (req, res, next) => {
  try {
    // Make sure user is requesting their own records or is admin/librarian
    if (
      req.params.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      req.user.role !== 'librarian'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view these records'
      });
    }
    
    const circulations = await Circulation.find({
      user: req.params.userId
    })
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .sort({ issueDate: -1 });
    
    res.status(200).json({
      success: true,
      count: circulations.length,
      data: circulations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get overdue books
// @route   GET /api/circulation/overdue
// @access  Private (Admin/Librarian)
exports.getOverdueBooks = async (req, res, next) => {
  try {
    const today = new Date();
    
    const overdueCirculations = await Circulation.find({
      dueDate: { $lt: today },
      status: { $in: ['borrowed', 'renewed'] }
    })
      .populate({
        path: 'book',
        select: 'title author isbn coverImage'
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      });
    
    // Update status to overdue
    for (const circulation of overdueCirculations) {
      if (circulation.status !== 'overdue') {
        circulation.status = 'overdue';
        await circulation.save();
      }
    }
    
    res.status(200).json({
      success: true,
      count: overdueCirculations.length,
      data: overdueCirculations
    });
  } catch (err) {
    next(err);
  }
};