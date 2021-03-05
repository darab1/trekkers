/* eslint-disable */
import axios from 'axios';
import swal from 'sweetalert';

export const createNewPassword = async (password, passwordConfirm, token) => {
  try {
    const response = await axios({
      method: 'PATCH',
      // url: `http://127.0.0.1:8080/api/v1/users/resetMyPassword/${token}`,
      url: `/api/v1/users/resetMyPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (response.data.status === 'success') {
      swal({
        title: 'Good Job!',
        text: 'You successfully changed your password',
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
        'Please use the same password for both password and confirm password fields.',
        'error'
      );
    } else if (
      e.response.data.message ===
      'The new password must be different from the previous one.'
    ) {
      swal(
        'Invalid Password!',
        'The new password must be different from the one you are trying to reset, please try entering a different password.',
        'error'
      );
    } else if (
      e.response.data.message === 'There is no user associated with that token'
    ) {
      swal(
        'Password Reset Token Expired!',
        'Please make another request to reset your password.',
        'error'
      );
    }
  }
};
