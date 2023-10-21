import axios from 'axios';

export const requestWithToken = async (method, url, data = {}, token = '') => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('error = ', error);
    if(error && error.response)
    {
      return error.response.data;
    }
    else
    {
      return error
    }
    
  }
};

export const requestWithoutToken = async (method, url, data = {}) => {
  try {
    const response = await axios({
      method,
      url,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    if(error && error.response)
    {
      return error.response.data;
    }
    else
    {
      return error
    }
  }
};

export const getData = async (url, token = getToken()) =>
  requestWithToken('get', url, null, token);

export const postData = async (url, data = {}, token = getToken()) =>
  requestWithToken('post', url, data, token);

export const postDataGuest = async (url, data = {}) =>
  requestWithoutToken('post', url, data);

export const getDataGuest = async url => requestWithoutToken('get', url);

export const putDataGuest = async url => requestWithoutToken('put', url);

export const putData = async (url, data = {}, token = getToken()) =>
  requestWithToken('put', url, data, token);

export const deleteData = async (url, token = getToken()) =>
  requestWithToken('delete', url, {}, token);

export const postFormData = async (url, formData, token = getToken()) => {
  try {
    const response = await axios({
      method: 'post',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data', // Use multipart/form-data for form data
        'hireintel-token': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if(error && error.response)
    {
      return error.response.data;
    }
    else
    {
      return error
    }
  }
};

export const getToken = () => {
  const STORAGE_KEY = 'accessToken';
  return sessionStorage.getItem(STORAGE_KEY);
};
