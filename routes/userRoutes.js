const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotMyPassword', authController.forgotMyPassword);
router.patch('/resetMyPassword/:token', authController.resetMyPassword);

router.use(authController.preventUnauthorizedAccess);

router.patch('/updateMyPassword', authController.updateMyPassword);

router.get(
  '/getMyAccountData',
  userController.getMyAccountData,
  userController.getUser
);

router.patch('/updateMyAccountData', userController.updateMyAccountData);
router.delete('/deleteMyAccount', userController.deleteMyAccount);

router.use(authController.restrictAccessTo('admin'));

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
