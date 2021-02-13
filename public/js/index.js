/* eslint-disable node/no-unsupported-features/es-syntax */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { login } from './login';
import { displayMap } from './mapbox';

// Select DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login__form');

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
