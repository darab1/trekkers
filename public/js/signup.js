/* eslint-disable */
import axios from 'axios';
import swal from 'sweetalert';

export const signup = async (fullName, email, password, passwordConfirm) => {
  try {
    const response = await axios({
      method: 'POST',
      // url: 'http://127.0.0.1:8080/api/v1/users/signup',
      url: '/api/v1/users/signup',
      data: {
        fullName,
        email,
        password,
        passwordConfirm
      }
    });
    if (response.data.status === 'success') {
      swal({
        title: 'Welcome to the Trekkers family!',
        text: 'Your registration was successful',
        icon: 'success'
      });

      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (e) {
    console.log(e.response);
    if (e.response.data.message.endsWith('Passwords do not match')) {
      swal(
        'Passwords do not match!',
        'Please use the same password for both password and confirm password.',
        'error'
      );
    } else if (
      e.response.data.message.startsWith(
        'E11000 duplicate key error collection'
      )
    ) {
      swal(
        'This email is already taken!',
        'A user with this email already exists! Please use another valid email.',
        'error'
      );
    }
  }
};
