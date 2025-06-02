
import axios from 'axios';
import { getAuth } from 'firebase/auth';

// ✅ Updated: Point to Railway backend
const axiosWithToken = axios.create({
baseURL: 'https://construction-backend-production-f49c.up.railway.app',
  withCredentials: true,
});

// 🔐 Attach Firebase JWT token to every request automatically
axiosWithToken.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken(true); // 🔁 force refresh
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🛡️ Token attached:', token.slice(0, 15), '...');
      }
    } catch (error) {
      console.warn('⚠️ Firebase token missing or failed:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosWithToken;
