// Create a new file, e.g., src/RootLayout.jsx

import { Outlet } from 'react-router-dom';
import { useAuthCheck } from '../../hooks/useCheckAuth.jsx';

const RootLayout = () => {
  // Now this call is perfectly valid! It's inside the router's context.
  useAuthCheck();

  // The <Outlet/> will render the matched child route (e.g., HeadCom, Signup, etc.)
  return <Outlet />;
}

export default RootLayout;