// export const BACKEND_URL = 'http://localhost:5000';
export const BACKEND_URL = process.env.REACT_APP_HOST_API;

export const urlMap = {
  login: `${BACKEND_URL}/login`,
  getUsers: `${BACKEND_URL}/users`,
  putUser: `${BACKEND_URL}/users/{tele-id}`,
  getApiDetails: `${BACKEND_URL}/apiDetails`,
};
