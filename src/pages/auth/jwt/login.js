import { Helmet } from 'react-helmet-async';
// sections
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Login Page</title>
        {/* <meta name="description" content="Dashboard for HireIntel clients to manage screening of different job openings."/> */}

      </Helmet>

      <JwtLoginView />
    </>
  );
}
