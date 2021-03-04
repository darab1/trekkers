const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotMyPassword', authController.forgotMyPassword);
//this route is for the reset password functionality for the API
router.patch('/resetMyPassword/:token', authController.resetMyPassword);

//this route is for the reset password functionality for the client side, first we get the reset password page from the reset url that contains the token
//then the client fills out the form with the passwords and when he/she submits it we use axios and call the resetMyPassword function in authController.js
router
  .route('/resetMyPassword/:token')
  .get(viewController.getCreateNewPasswordPage);

router.use(authController.preventUnauthorizedAccess);

router.patch('/updateMyPassword', authController.updateMyPassword);

router.get(
  '/getMyAccountData',
  userController.getMyAccountData,
  userController.getUser
);

router.patch(
  '/updateMyAccountData',
  userController.uploadUserPhoto,
  userController.processUserPhoto,
  userController.updateMyAccountData
);
router.delete('/deleteMyAccount', userController.deleteMyAccount);

router.use(authController.restrictAccessTo('admin'));

// GET ALL USERS, CREATE A USER
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
