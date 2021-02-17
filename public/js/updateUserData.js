/* eslint-disable */

import axios from 'axios';
import swal from 'sweetalert';

export const updateUserData = async (fullName, email) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8080/api/v1/users/updateMyAccountData',
      data: {
        fullName: fullName,
        email: email
      }
    });

    if (response.data.status === 'success') {
      swal({
        title: 'Your data have been successfully updated!',
        icon: 'success',
        timer: 2500
      });

      window.setTimeout(() => {
        location.assign('/user-account');
      }, 2500);
    }
  } catch (error) {
    swal('Wrong email', 'Please enter a valid email', 'error');
    console.log(error);
  }
};
