/* eslint-disable node/no-unsupported-features/es-syntax */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login } from './login';
import { displayMap } from './mapbox';
import { logout } from './logout';
import { updateUserData } from './updateUserData';

// Select DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login__form');
const logoutBtn = document.querySelector('.btn-logout');
const userInfoForm = document.querySelector('.form__user-info');
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
    console.log(formData);

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
