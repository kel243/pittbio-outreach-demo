const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const nodemailer = require('nodemailer');
const AppError = require('./../utils/appError');
const multer = require('multer');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

const router = express.Router();

// Storage for data file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets/data');
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.');
    cb(
      null,
      `${file.fieldname}-${Date.now()}.${
        fileExtension[fileExtension.length - 1]
      }`
    );
  },
});

const upload = multer({ storage: storage });

router.use(authController.isLoggedIn);

router.get('/', viewsController.getHome);

router.get('/contact', viewsController.getContact);
router.post('/contact', (req, res) => {
  const smtpTrans = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Specify what the email will look like
  const mailOpts = {
    from: 'Contact Form',
    to: 'test@test.com',
    subject: 'Message from Contact Page',
    text: `Name: ${req.body.fname} ${req.body.lname} \nEmail: ${req.body.email} \nPhone Number: ${req.body.phone} \nSchool: ${req.body.school}\n\n${req.body.question}`,
  };

  // Attempt to send the email
  smtpTrans.sendMail(mailOpts, (error, response) => {
    if (error) {
      return next(new AppError('Email failed to send!', 401));
    } else {
      res.status(200).render('contact', {
        title: 'Contact Us',
        navActive: 'contact',
      });
    }
  });
});

router.get('/login', authController.alreadyLoggedIn, viewsController.getLogin);

router.get('/students', viewsController.getStudents);

router.get('/teachers', authController.protect, viewsController.getTeachers);

router.get('/data', authController.protect, viewsController.getData);
router.get('/data/:id', authController.protect, viewsController.getUserData);
router.post(
  '/data',
  authController.protect,
  upload.single('data'),
  catchAsync(async (req, res, next) => {
    // Push name of file to the user's data array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { data: req.file.filename },
    });
    res.status(200).render('dataUpload', {
      title: 'Upload and Visualize Data',
      navActive: 'data',
    });
  })
);

router.get('/account', authController.protect, viewsController.getAccount);

router.get('/forgotPassword', viewsController.getForgot);

router.get('/resetPassword/:token', viewsController.getReset);

router.get('/register/:token', viewsController.getConfirm);

router.get(
  '/register',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getRegister
);

router.get(
  '/manage',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getManage
);

router.get(
  '/inactive',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getInactive
);

module.exports = router;
