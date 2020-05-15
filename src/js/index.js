import '@babel/polyfill';
import {
  login,
  logout,
  register,
  forgotPassword,
  confirmAccount,
} from './login';
import { openTab } from './tabs';
import { updateSettings } from './updateSettings';
import { enableAccount, disableAccount } from './activeAccount';
import { showAlert } from './alerts';

// Get elements from document
const loginForm = document.querySelector('.login-form');
const logoutBtn = document.querySelector('.nav-list__link-logout');
const logoutBtnHam = document.querySelector(
  '.navigation-hamburger__link-logout'
);
const profileTabs = document.getElementsByClassName('user-page__tabs-links');
const userDataForm = document.querySelector('.user-page__settings-data-form');
const setPasswordForm = document.querySelector('.password-form');
const userPasswordForm = document.querySelector('.user-page__settings-pw-form');
const registerForm = document.querySelector('#register-form');
const forgotPwForm = document.querySelector('.forgot-password-form');
const confirmForm = document.querySelector('#confirmAccount');
const resetPwForm = document.querySelector('.reset-password-form');
const disableForm = document.getElementsByClassName('disable-form');
const enableForm = document.getElementsByClassName('enable-form');
const disableId = document.getElementsByClassName('id-input-disable');
const enableId = document.getElementsByClassName('id-input-enable');

// Confirms account using account token when the account confirmation page loads
if (confirmForm) {
  window.onload = function () {
    const confirmToken = document.getElementById('confirm-token').value;
    confirmAccount(confirmToken);
  };
}

// Runs API call to login user when login form is submitted
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// Runs API call to logout user when logout button is clicked
if (logoutBtn) logoutBtn.addEventListener('click', logout);

// Runs API call to logout user when logout button is clicked
if (logoutBtnHam) logoutBtnHam.addEventListener('click', logout);

// Runs API call to register new user when registration form is submitted
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fname = document.getElementById('fname-register').value;
    const lname = document.getElementById('lname-register').value;
    const email = document.getElementById('email-register').value;
    const school = document.getElementById('school-register').value;
    const phone = document.getElementById('phone-register').value;
    const role = document.getElementById('role-register').value.toLowerCase();
    register(fname, lname, email, school, phone, role);
  });
}

// Runs API call to update user information when settings form is submitted
if (userDataForm) {
  document.getElementById('photo').value = '';
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('fname', document.getElementById('fname').value);
    form.append('lname', document.getElementById('lname').value);
    form.append('email', document.getElementById('email').value);
    form.append('school', document.getElementById('school').value);
    form.append('phone', document.getElementById('phone').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

// Runs API call to send password reset email when forgot password form is submitted
if (forgotPwForm) {
  forgotPwForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const resetEmail = document.getElementById('resetEmail').value;
    forgotPassword(resetEmail);
  });
}

// Runs API call to set new password when password reset form is submitted
if (resetPwForm)
  resetPwForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const resetToken = document.getElementById('reset-token').value;
    const password = document.getElementById('newPasswordReset').value;
    const passwordConfirm = document.getElementById('confirmPasswordReset')
      .value;
    await updateSettings({ password, passwordConfirm, resetToken }, 'reset');
  });

// Runs API call to update password when password update form is submitted
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--update').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('currPassword').value;
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('currPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  });

// Runs API call to set password when password set form is submitted
if (setPasswordForm)
  setPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('newPassword').value;
    const passwordConfirm = document.getElementById('confirmPassword').value;
    await updateSettings({ password, passwordConfirm }, 'set');
  });

// Runs API call to disable account when disable form is submitted
if (disableForm) {
  for (let i = 0; i < disableForm.length; i++) {
    disableForm[i].addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = disableId[i].value;
      await disableAccount(id);
    });
  }
}

// Runs API call to enable account when enable form is submitted
if (enableForm) {
  for (let i = 0; i < enableForm.length; i++) {
    enableForm[i].addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = enableId[i].value;
      await enableAccount(id);
    });
  }
}

// Tab implementation on user profile
if (profileTabs.length > 0) {
  for (let i = 0; i < profileTabs.length; i++) {
    profileTabs[i].addEventListener('click', openTab);
  }
  // Default tab is clicked
  document.getElementsByClassName('default')[0].click();
}

// Set alert
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
