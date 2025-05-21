const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  time: {
    type: String,
    required: [true, 'Please add a time']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please add duration']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  category: {
    type: String,
    enum: ['Book Launch', 'Author Meet', 'Reading Club', 'Workshop', 'Children Event', 'Other'],
    default: 'Other'
  },
  image: {
    type: String,
    default: 'default-event.jpg'
  },
  capacity: {
    type: Number
  },
  registeredUsers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  organizer: {
    type: String,
    required: [true, 'Please add an organizer']
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on date
EventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (eventDate < now) {
    this.status = 'completed';
  } else if (eventDate.toDateString() === now.toDateString()) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
  
  next();
});

module.exports = mongoose.model('Event', EventSchema);