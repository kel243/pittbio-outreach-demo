const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Storage for image file
const multerStorage = multer.memoryStorage();

// Only take in files with mimetype that starts with image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Upload a single file
exports.uploadUserPhoto = upload.single('photo');

// Resize image file to uniformize all images
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`src/assets/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

// Set id in request to the user's id
exports.getAccount = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update information on the User model
exports.updateAccount = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates.', 400));
  }
  // 2) Update user document
  const filteredBody = filterObj(
    req.body,
    'fname',
    'lname',
    'email',
    'school',
    'phone'
  );

  // Delete old image file when user changes profile picture
  if (req.file) {
    const path = `src/assets/users/${req.user.photo}`;
    if (req.user.photo !== 'default.jpg') {
      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    filteredBody.photo = req.file.filename;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Disable account by setting its active field to false
exports.disableAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Enable account by setting its active field to true
exports.enableAccount = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, { active: true });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
