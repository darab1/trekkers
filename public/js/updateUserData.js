/* eslint-disable */

import axios from 'axios';
import swal from 'sweetalert';

export const updateUserData = async (userData, typeOfData) => {
  try {
    const url =
      typeOfData === 'data'
        ? 'http://127.0.0.1:8080/api/v1/users/updateMyAccountData'
        : 'http://127.0.0.1:8080/api/v1/users/updateMyPassword';
    const response = await axios({
      method: 'PATCH',
      url,
      data: userData
    });

    if (response.data.status === 'success') {
      swal({
        title: `Your ${typeOfData} have been successfully updated!`,
        icon: 'success',
        timer: 2500
      });

      window.setTimeout(() => {
        location.assign('/user-account');
      }, 2500);
    }
  } catch (error) {
    if (typeOfData === 'data') {
      swal('Wrong email', 'Please enter a valid email', 'error');
    } else {
      swal('Wrong password', 'Please enter the correct password', 'error');
    }
  }
};
