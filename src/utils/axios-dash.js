import axios from 'axios';
// config
import { HIRE_HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HIRE_HOST_API });

console.log('BASE uril is ', HIRE_HOST_API);

axiosInstance.interceptors.response.use(
  res => res,
  error =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong',
    ),
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async args => {
  try {
    console.log('url is ', url);
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
      console.log(error);
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    login: '/login',
  },
  roles: {
    list: 'api/v1/organization/roles',
  },
};
