import axios from 'axios';
import { showAlert } from './alerts';

// API call to update settings based on the type of update
// password to update password
// set to set password for new accounts
// reset to set new password for users who forgot their password
// else update user information (name, school, phone number, etc.)
export const updateSettings = async (data, type) => {
  try {
    let url = '';

    if (type === 'password') {
      url = '/api/v1/users/updatePassword';
    } else if (type === 'set') {
      url = '/api/v1/users/setPassword';
    } else if (type === 'reset') {
      url = `/api/v1/users/resetPassword/${data.resetToken}`;
    } else {
      url = '/api/v1/users/updateAccount';
    }

    const res = await axios({
      method: 'PATCH',
      url: url,
      data,
    });

    // Reassign to account page if successful
    if (res.data.status === 'success') {
      showAlert('success', `Information updated successfully!`);
      location.assign('/account');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
