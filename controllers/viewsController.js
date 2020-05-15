const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

// Render home page
exports.getHome = (req, res) => {
  res.status(200).render('home', {
    title: 'PittBio Outreach: Ectotherm ER',
    navActive: 'home',
  });
};

// Render login page
exports.getLogin = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
    navActive: 'login',
  });
};

// Render students material page
exports.getStudents = (req, res) => {
  res.status(200).render('students', {
    title: 'Student Materials',
    navActive: 'students',
  });
};

// Render teachers material page
exports.getTeachers = (req, res) => {
  res.status(200).render('teachers', {
    title: 'Teacher Materials',
    navActive: 'teachers',
  });
};

// Render contact page
exports.getContact = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
    navActive: 'contact',
  });
};

// Render data submission/visualization page
exports.getData = (req, res) => {
  res.status(200).render('dataUpload', {
    title: 'Upload and Visualize Data',
    navActive: 'data',
  });
};

// Render data page based on id
exports.getUserData = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  res.status(200).render('userData', {
    title: `${user.fname} ${user.lname}'s Files`,
    files: user.data,
  });
});

// Render account page if user is validated, else render set password page
exports.getAccount = catchAsync(async (req, res, next) => {
  if (req.user.validated) {
    res.status(200).render('user', {
      title: 'Your Account',
      navActive: 'account',
    });
  } else {
    res.status(200).render('setPassword', {
      title: 'Set Your Password',
      navActive: 'account',
    });
  }
});

// Render registration page
exports.getRegister = (req, res) => {
  res.status(200).render('register', {
    title: 'Register New Account',
  });
};

// Render account confirmation page
exports.getConfirm = (req, res) => {
  res.status(200).render('confirmAccount', {
    title: 'Confirm Your Account',
    token: req.params.token,
  });
};

// Render password reset page
exports.getReset = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Your Password',
    token: req.params.token,
  });
};

// Render forgot password page
exports.getForgot = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Your Password',
  });
};

// Render teacher management page
exports.getManage = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const teachers = await User.find({ role: 'teacher', active: { $eq: true } });

  // 2) Render template using tour data from 1
  res.status(200).render('manage', {
    title: 'Manage Teachers',
    teachers,
  });
});

// Render inactive teachers page
exports.getInactive = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const teachers = await User.find({ role: 'teacher', active: { $eq: false } });

  // 2) Render template using tour data from 1
  res.status(200).render('inactive', {
    title: 'Inactive Accounts',
    teachers,
  });
});

// Render account page when user updates settings
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
      school: req.body.school,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
