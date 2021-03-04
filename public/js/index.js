/* eslint-disable node/no-unsupported-features/es-syntax */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login } from './login';
import { logout } from './logout';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { updateUserData } from './updateUserData';
import { bookTour } from './stripePayments';
import { resetPassword } from './resetPassword';

// Select DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login__form');
const signupForm = document.querySelector('.signup__form');
const userInfoForm = document.querySelector('.form__user-info');
const resetPasswordForm = document.querySelector('.reset-password__form');
const logoutBtn = document.querySelector('.btn-logout');
const bookTourBtn = document.getElementById('checkout-button');
const checkbox = document.getElementById('checkbox-password');
const changePasswordForm = document.querySelector('.form__change-password');

if (mapBox) {
  const tourLocations = JSON.parse(mapBox.dataset.tourLocations);
  displayMap(tourLocations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    logout();
  });
}

if (userInfoForm) {
  userInfoForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('fullName', document.getElementById('fullName').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('photo', document.getElementById('photo').files[0]);

    updateUserData(formData, 'data');
  });
}

if (changePasswordForm) {
  changePasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password-new').value;
    const confirmNewPassword = document.getElementById('password-confirm')
      .value;

    // wait until the password updates...
    await updateUserData(
      { currentPassword, newPassword, confirmNewPassword },
      'password'
    );

    // ...and then clear the input fields.
    document.getElementById('password-current').innerHTML = '';
    document.getElementById('password-new').innerHTML = '';
    document.getElementById('password-confirm').innerHTML = '';
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', e => {
    e.preventDefault();
    bookTourBtn.innerHTML = 'Checkout...';
    const { tourId } = bookTourBtn.dataset;
    bookTour(tourId);
    // e.target.innerHTML = 'Book Now';
  });
}

if (checkbox) {
  checkbox.addEventListener('click', () => {
    const password = document.querySelector('.input__password--signup');
    const passwordConfirm = document.querySelector(
      '.input__password-confirm--signup'
    );
    if (password.type === 'password' || passwordConfirm.type === 'password') {
      password.type = 'text';
      passwordConfirm.type = 'text';
    } else {
      password.type = 'password';
      passwordConfirm.type = 'password';
    }
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(fullName, email, password, passwordConfirm);
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const resetBtn = document.querySelector('.reset-password__btn');

    resetBtn.innerHTML = 'Sending email...';
    await resetPassword(email);
    resetBtn.innerHTML = 'Send instructions';
  });
}
