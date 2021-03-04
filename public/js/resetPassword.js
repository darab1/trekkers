/* eslint-disable*/
import axios from 'axios';
import swal from 'sweetalert';

export const resetPassword = async email => {
  try {
    console.log(`data:${email}`);

    const response = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/forgotMyPassword',
      data: { email }
    });

    console.log(response);

    if (response.data.status === 'success') {
      swal({
        title: 'We sent you an email!',
        text: 'Please check your email to create a new password',
        icon: 'success'
      });

      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (e) {
    // console.log(e.response.data.message);
    // console.log(e.response);
    console.log(e);
    if (e.response.data.status === 'fail') {
      swal({
        title: 'Invalid Email',
        text:
          'There is no user with the email you provided, please use a valid email!',
        icon: 'error'
      });
    }
  }
};
