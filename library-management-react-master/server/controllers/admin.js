const Book = require('../models/Book');
const User = require('../models/User');
const Circulation = require('../models/Circulation');
const Event = require('../models/Event');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin/Librarian)
exports.getStats = async (req, res, next) => {
  try {
    // Get total books
    const totalBooks = await Book.countDocuments();
    
    // Get available books
    const availableBooks = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$availableQuantity' } } }
    ]);
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get borrowed books
    const borrowedBooks = await Circulation.countDocuments({
      status: { $in: ['borrowed', 'renewed'] }
    });
    
    // Get overdue books
    const overdueBooks = await Circulation.countDocuments({ status: 'overdue' });
    
    // Get recent activities
    const recentActivities = await Circulation.find()
      .populate({
        path: 'book',
        select: 'title'
      })
      .populate({
        path: 'user',
        select: 'name'
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Format activities for frontend
    const formattedActivities = recentActivities.map(activity => {
      return {
        id: activity._id,
        type: activity.status,
        user: activity.user ? activity.user.name : 'Unknown User',
        book: activity.book ? activity.book.title : 'Unknown Book',
        timestamp: activity.createdAt
      };
    });
    
    // Get popular books (most borrowed)
    const popularBooks = await Circulation.aggregate([
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Populate book details for popular books
    const populatedPopularBooks = [];
    for (const item of popularBooks) {
      const book = await Book.findById(item._id).select('title author');
      if (book) {
        populatedPopularBooks.push({
          title: book.title,
          author: book.author,
          borrowCount: item.count
        });
      }
    }
    
    // Get category distribution
    const categories = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const categoryDistribution = categories.map(item => ({
      name: item._id,
      value: item.count
    }));
    
    // Get monthly stats for the last 6 months
    const monthlyStats = [];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const borrows = await Circulation.countDocuments({
        issueDate: { $gte: startDate, $lte: endDate }
      });
      
      const returns = await Circulation.countDocuments({
        returnDate: { $gte: startDate, $lte: endDate }
      });
      
      monthlyStats.push({
        name: monthName,
        borrows,
        returns
      });
    }
    
    // Get user growth over the last 6 months
    const userGrowth = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const users = await User.countDocuments({
        createdAt: { $lte: endDate }
      });
      
      userGrowth.push({
        name: monthName,
        users
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        availableBooks: availableBooks.length > 0 ? availableBooks[0].total : 0,
        totalUsers,
        borrowedBooks,
        overdueBooks,
        recentActivities: formattedActivities,
        popularBooks: populatedPopularBooks,
        categoryDistribution,
        monthlyStats,
        userGrowth
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate reports
// @route   GET /api/admin/reports/:type
// @access  Private (Admin/Librarian)
exports.generateReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { startDate, endDate } = req.query;
    
    let report = {
      type,
      generatedAt: new Date(),
      data: []
    };
    
    // Parse dates if provided
    const parsedStartDate = startDate ? new Date(startDate) : new Date(0);
    const parsedEndDate = endDate ? new Date(endDate) : new Date();
    
    switch (type) {
      case 'circulation':
        report.data = await Circulation.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
        })
          .populate({
            path: 'book',
            select: 'title author isbn'
          })
          .populate({
            path: 'user',
            select: 'name email'
          })
          .sort({ createdAt: -1 });
        break;
        
      case 'overdue':
        report.data = await Circulation.find({
          status: 'overdue',
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
        })
          .populate({
            path: 'book',
            select: 'title author isbn'
          })
          .populate({
            path: 'user',
            select: 'name email phone'
          })
          .sort({ dueDate: 1 });
        break;
        
      case 'inventory':
        report.data = await Book.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
        })
          .select('title author isbn category quantity availableQuantity location')
          .sort({ title: 1 });
        break;
        
      case 'users':
        report.data = await User.find({
          createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
        })
          .select('name email role status membershipDate')
          .sort({ name: 1 });
        break;
        
      case 'popular-books':
        const popularBooks = await Circulation.aggregate([
          {
            $match: {
              createdAt: { $gte: parsedStartDate, $lte: parsedEndDate }
            }
          },
          { $group: { _id: '$book', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 20 }
        ]);
        
        for (const item of popularBooks) {
          const book = await Book.findById(item._id).select('title author isbn category');
          if (book) {
            report.data.push({
              book,
              borrowCount: item.count
            });
          }
        }
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }
    
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private (Admin)
exports.getLogs = async (req, res, next) => {
  try {
    // In a real application, this would fetch actual system logs
    // For this demo, we'll return a simulated response
    
    const logs = [
      { id: 1, level: 'info', message: 'System started', timestamp: new Date(Date.now() - 86400000 * 5) },
      { id: 2, level: 'info', message: 'User login: admin@example.com', timestamp: new Date(Date.now() - 86400000 * 4) },
      { id: 3, level: 'warning', message: 'Failed login attempt: unknown@example.com', timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: 4, level: 'error', message: 'Database connection error', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: 5, level: 'info', message: 'Database connection restored', timestamp: new Date(Date.now() - 86400000 * 2 + 3600000) },
      { id: 6, level: 'info', message: 'Book added: The Great Gatsby', timestamp: new Date(Date.now() - 86400000) },
      { id: 7, level: 'info', message: 'Book borrowed: 1984', timestamp: new Date(Date.now() - 43200000) },
      { id: 8, level: 'info', message: 'New user registered: john.doe@example.com', timestamp: new Date(Date.now() - 21600000) },
      { id: 9, level: 'warning', message: 'Overdue book notification sent', timestamp: new Date(Date.now() - 7200000) },
      { id: 10, level: 'info', message: 'System backup completed', timestamp: new Date() }
    ];
    
    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update system settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSettings = async (req, res, next) => {
  try {
    // In a real application, this would update actual system settings
    // For this demo, we'll return a simulated response
    
    const settings = {
      ...req.body,
      updatedAt: new Date()
    };
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Backup database
// @route   POST /api/admin/backup
// @access  Private (Admin)
exports.backupDatabase = async (req, res, next) => {
  try {
    // In a real application, this would perform an actual database backup
    // For this demo, we'll return a simulated response
    
    const backup = {
      success: true,
      backupId: Date.now().toString(),
      timestamp: new Date(),
      size: '42.5 MB',
      location: '/backups/library-db-backup-' + new Date().toISOString().split('T')[0] + '.gz'
    };
    
    res.status(200).json({
      success: true,
      data: backup
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Restore database from backup
// @route   POST /api/admin/restore
// @access  Private (Admin)
exports.restoreDatabase = async (req, res, next) => {
  try {
    // In a real application, this would perform an actual database restore
    // For this demo, we'll return a simulated response
    
    const { backupId } = req.body;
    
    if (!backupId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a backup ID'
      });
    }
    
    const restore = {
      success: true,
      backupId,
      restoredAt: new Date(),
      message: 'Database restored successfully'
    };
    
    res.status(200).json({
      success: true,
      data: restore
    });
  } catch (err) {
    next(err);
  }
};