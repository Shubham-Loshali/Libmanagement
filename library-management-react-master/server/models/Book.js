const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'Please add an ISBN'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Fiction', 
      'Non-Fiction', 
      'Science Fiction', 
      'Fantasy', 
      'Mystery', 
      'Thriller', 
      'Romance', 
      'Biography', 
      'History', 
      'Self-Help', 
      'Business', 
      'Children', 
      'Young Adult', 
      'Science', 
      'Technology', 
      'Arts', 
      'Religion', 
      'Philosophy',
      'Other'
    ]
  },
  publisher: {
    type: String,
    required: [true, 'Please add a publisher']
  },
  publicationYear: {
    type: Number,
    required: [true, 'Please add a publication year']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Please add available quantity'],
    min: [0, 'Available quantity cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Please add a shelf location']
  },
  coverImage: {
    type: String,
    default: 'default-book-cover.jpg'
  },
  language: {
    type: String,
    default: 'English'
  },
  pages: {
    type: Number
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating when reviews are modified
BookSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  } else {
    this.rating = 0;
  }
  next();
});

module.exports = mongoose.model('Book', BookSchema);