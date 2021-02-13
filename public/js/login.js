/* eslint-disable */
import axios from 'axios';

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
      alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (e) {
    alert(e.response.data.message);
  }
};
