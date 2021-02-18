/* eslint-disable */
import axios from 'axios';
import swal from 'sweetalert';

export const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (response.data.status === 'success') {
      swal({
        title: 'Welcome back adventurer!',
        text: 'You successfully logged in.',
        icon: 'success'
      });
      window.setTimeout(() => {
        location.assign('/');
      }, 2000);
    }
  } catch (e) {
    swal('Oops', 'Incorrect email or password, please try again!', 'error', {
      timer: 4000
    });
    console.log(e.response.data.message);
  }
};
