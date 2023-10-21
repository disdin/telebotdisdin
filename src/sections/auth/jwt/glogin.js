import React, { useReducer } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useSearchParams, useRouter } from 'src/routes/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { setSession } from 'src/auth/context/jwt/utils';
import { enqueueSnackbar, useSnackbar } from 'notistack';





const clientId = process.env.REACT_APP_clientId;
const STORAGE_KEY = 'accessToken';
const USER_KEY = 'userKey';
const ORGANISATIONS_KEY = 'organisationsKey';

const initialState = {
    user: null,
    loading: true,
    organizations: null,
};

const reducer = (state, action) => {
    if (action.type === 'INITIAL') {
        return {
            loading: false,
            user: action.payload.user,
            organizations: action.payload.organizations,
        };
    }
    if (action.type === 'LOGIN') {
        return {
            ...state,
            user: action.payload.user,
            organizations: action.payload.organizations,
        };
    }
    if (action.type === 'REGISTER') {
        return {
            ...state,
            user: action.payload.user,
            organizations: action.payload.organizations,
        };
    }
    if (action.type === 'LOGOUT') {
        return {
            ...state,
            user: null,
            organizations: null,
        };
    }
    return state;
};

const Glogin = () => {
    const {enqueueSnackbar} = useSnackbar();
    const [state, dispatch] = useReducer(reducer, initialState);

    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo');
    const router = useRouter();
    const onSuccess = (res) => {
        var decoded = jwt_decode(res.credential);
        console.log(decoded)
        enqueueSnackbar({
            message:`Hi ${decoded.given_name}, you don't have authority to access, please sign-in using given credentials...`,
            autoHideDuration:10000
        })
        // setSession(res.credential);
        // console.log(decoded);
        // const user = { user: "disdin",status:"VERIFIED" }
        // const organizations = [
        //     {organization_id:"ytsvhfjkn",user_role:"ADMIN"}
        // ]
        // sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        // sessionStorage.setItem(ORGANISATIONS_KEY, JSON.stringify(organizations));
        // dispatch({
        //     type: 'LOGIN',
        //     payload: {
        //         user,
        //         organizations,
        //     },
        // });
        // window.location.reload()
        // router.push(returnTo || PATH_AFTER_LOGIN);
    }
    const onFailure = (res) => {
        console.log(res);
    }

    return (
        <div style={{ margin: "auto" }}>
            <GoogleOAuthProvider clientId={`${clientId}`}>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            </GoogleOAuthProvider>
        </div>
    )
}

export default Glogin;