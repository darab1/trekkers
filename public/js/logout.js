/* eslint-disable */
import axios from 'axios';
import swal from 'sweetalert';

export const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8080/api/v1/users/logout'
    });

    if (response.data.status === 'success') {
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    console.log(error.response);
    swal('Oops!', 'There was an error, please try to log out again!', 'error', {
      timer: 4000
    });
  }
};
