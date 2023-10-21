import { Navigate, useRoutes } from 'react-router-dom';

// config
// import { PATH_AFTER_LOGIN } from 'src/config-global';
//
import { mainRoutes, HomePage } from './main';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE WITH SKIP HOME PAGE
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },

    // ----------------------------------------------------------------------


    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,


    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
