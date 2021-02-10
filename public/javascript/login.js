/* eslint-disable */

const login = async (email, password) => {
  console.log(email, password);
  try {
    const response = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(response);
  } catch (e) {
    console.log(e.response.data);
  }
};

document.querySelector('.login__form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});
