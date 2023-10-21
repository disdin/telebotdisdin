import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios-dash';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';
const USER_KEY = 'userKey';
const ORGANISATIONS_KEY = 'organisationsKey';

export function AuthProvider({ children }) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);
      console.log('accessToken = ', accessToken);
      if (accessToken && isValidToken(accessToken)) {
        console.log('token is validated');
        const userStr = sessionStorage.getItem(USER_KEY);
        const user = JSON.parse(userStr);
        console.log('user is ', user);
        const orgStr = sessionStorage.getItem(ORGANISATIONS_KEY);
        console.log('org str is ', orgStr);
        const organizations = JSON.parse(orgStr);
        console.log(organizations);
        setSession(accessToken);
        dispatch({
          type: 'INITIAL',
          payload: {
            user,
            organizations,
          },
        });
      } else {
        console.log('token validation failed');
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
            organizations: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
          organizations: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    try {
      console.log('in login function');
      console.log(email, password);
      const data = {
        email,
        password,
      };

      const response = await axios.post(endpoints.auth.login, data);
      console.log(response)
      if (response.data.success) {
        const { token } = response.data.body;
        console.log('access token is ', token);

        setSession(token);
        const user = { user: "disdin", status: "VERIFIED" }
        const organizations = [
          { organization_id: "ytsvhfjkn", user_role: "ADMIN" }
        ]
        sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        sessionStorage.setItem(ORGANISATIONS_KEY, JSON.stringify(organizations));

        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            organizations,
          },
        });
        
      }
      return response;
    } catch (error) {
      console.log(error);
    }
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    try {
      const data = {
        email,
        password,
        firstName,
        lastName,
      };

      const response = await axios.post(endpoints.auth.register, data);

      const { accessToken, user } = response.data;

      sessionStorage.setItem(STORAGE_KEY, accessToken);

      dispatch({
        type: 'REGISTER',
        payload: {
          user,
        },
      });
    } catch (error) {
      console.log(error)
    }
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    sessionStorage.setItem(USER_KEY, null);
    sessionStorage.getItem(ORGANISATIONS_KEY, null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      organizations: state.organizations,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status, state.organizations],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
