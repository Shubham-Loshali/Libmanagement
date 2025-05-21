const mongoose = require('mongoose');

const CirculationSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue', 'lost', 'renewed'],
    default: 'borrowed'
  },
  fine: {
    type: Number,
    default: 0
  },
  renewalCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  issuedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  returnedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update status to overdue if past due date
CirculationSchema.pre('save', function(next) {
  if (this.status === 'borrowed' && this.dueDate < new Date() && !this.returnDate) {
    this.status = 'overdue';
  }
  next();
});

// Calculate fine if overdue
CirculationSchema.methods.calculateFine = function() {
  if (this.status === 'overdue' || (this.returnDate && this.returnDate > this.dueDate)) {
    const dueDate = new Date(this.dueDate);
    const returnDate = this.returnDate ? new Date(this.returnDate) : new Date();
    
    // Calculate days overdue
    const daysOverdue = Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    
    // Fine rate: $0.50 per day
    this.fine = daysOverdue * 0.5;
    return this.fine;
  }
  return 0;
};

module.exports = mongoose.model('Circulation', CirculationSchema);