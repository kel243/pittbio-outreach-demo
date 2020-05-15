import axios from 'axios';
import { showAlert } from './alerts';

// Runs API call to disable an user
export const disableAccount = async (id) => {
  try {
    const url = `/api/v1/users/disable/${id}`;

    const res = await axios({
      method: 'PATCH',
      url: url,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Account disabled!`);
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// Runs API call to enable an user
export const enableAccount = async (id) => {
  try {
    const url = `/api/v1/users/enable/${id}`;

    const res = await axios({
      method: 'PATCH',
      url: url,
    });

    if (res.data.status === 'success') {
      showAlert('success', `Account enabled!`);
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
