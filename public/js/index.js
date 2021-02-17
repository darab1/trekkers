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

// Select DOM values

// Check if DOM element exists, if it does execute function.

// check if mapBox element exists
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
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    console.log(fullName, email);
    updateUserData(fullName, email);
  });
}