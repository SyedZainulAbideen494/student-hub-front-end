import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';

export const subscribeUser = async (subscription) => {
  try {
    await axios.post(API_ROUTES.saveNotificationSubscriptiopn, subscription);
  } catch (error) {
    console.error('Error saving subscription:', error);
  }
};