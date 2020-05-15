import axios from 'axios';
import { showAlert } from './alerts';

// API call to login user
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    // Reassign to account page after 1 second if successful
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// API call to logout user
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    // Reassign to home page if successful
    if (res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

// API call to register user
export const register = async (fname, lname, email, school, phone, role) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/register',
      data: {
        fname,
        lname,
        email,
        school,
        phone,
        role,
      },
    });

    // Reassign to account page after 1 second if successful
    if (res.data.status === 'success') {
      showAlert('success', 'Registered successfully!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// API call to send reset password email
export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });

    // Reassign to login page after 1 second if successful
    if (res.data.status === 'success') {
      showAlert('success', 'Reset Email sent!');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// API call to confirm account
export const confirmAccount = async (token) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/register/${token}`,
      data: {
        token,
      },
    });

    // Reassign to account page after 1 second if successful
    if (res.data.status === 'success') {
      showAlert('success', 'Account Validated!');
      window.setTimeout(() => {
        location.assign('/account');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
