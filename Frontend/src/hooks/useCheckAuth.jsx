import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/authSlice.js';
// import { useSelector } from 'react-redux';
export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Destructure the user object from your Redux state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // It's a best practice to define an async function inside useEffect
    // rather than making the useEffect callback itself async.
    const verifyUserSession = async () => {
      // Only run verification if we have a user in Redux state
      if (user) {
        try {
          // Send the 'user' object as the request body (the 2nd argument)
          const response = await axios.post(
            'http://localhost:3000/user/verifyState',
            user, // <--- This is the user object sent as the request body
            { withCredentials: true } // <-- Config object is the 3rd argument
          );
          console.log("We were called and the result is", response.data.success);
          if (!response.data.success) {

            dispatch(setUser(null));
            navigate('/signin');
          }
          else {
            dispatch(setUser(response.data.user));
          }



        } catch (error) {
          // If the server rejects the user state (e.g., session expired), log out.
          dispatch(setUser(null));
          navigate('/signin');
          console.error('Auth verification failed:', error.response?.data?.message || error.message);

        }
      }

      // This logic is good for syncing state if the cookie disappears

    };

    verifyUserSession();

    // The dependency array should contain 'user' and 'dispatch'
  }, []);
};