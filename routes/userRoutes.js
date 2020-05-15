const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/setPassword',
  authController.protect,
  authController.setPassword
);

router.get(
  '/account',
  authController.protect,
  userController.getAccount,
  userController.getUser
);

router.patch(
  '/updateAccount',
  authController.protect,
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateAccount
);

router.post(
  '/register',
  authController.protect,
  authController.restrictTo('admin'),
  authController.register
);

router.post('/register/:token', authController.confirmAccount);

router
  .route('/')
  .get(authController.restrictTo('admin'), userController.getAllUsers);

router.patch(
  '/disable/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.disableAccount
);
router.patch(
  '/enable/:id',
  authController.protect,
  authController.restrictTo('admin'),
  userController.enableAccount
);

router
  .route('/:id')
  .get(authController.restrictTo('admin'), userController.getUser)
  .patch(authController.restrictTo('admin'), userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
