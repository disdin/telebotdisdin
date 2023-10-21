import { useAuthContext } from 'src/auth/hooks';
import { deleteData, getData, postData, postDataGuest, putData } from 'src/utils/axios/index';
import { urlMap } from 'src/utils/urls';

export const getUsers = async () => {
  const url = `${urlMap.getUsers}`;
  return getData(url);
};

export const putUserDetails = async(payload,tele_id)=>{
  const url = `${urlMap.putUser}`.replace("{tele-id}",tele_id);
  return putData(url,payload);
}

export const deleteUser = async(tele_id)=>{
  const url = `${urlMap.putUser}`.replace("{tele-id}",tele_id);
  return deleteData(url);
}

export const getApiDetails = async () => {
  const url = `${urlMap.getApiDetails}`;
  return getData(url);
};

