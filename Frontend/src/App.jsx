// src/App.jsx

import { Signup } from './components/ui/Signup.jsx';
import { Signin } from './components/ui/Signin.jsx';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// REMOVED: No longer need HeadCom or ProtectedRoute here
// import { HeadCom } from './components/ui/HeadCom.jsx';
// import ProtectedRoute from './components/ui/ProtectedRoute.jsx';
import MainLayout from './components/ui/HeadCom.jsx'; // 1. IMPORT the new layout
import { Home } from './components/ui/Home.jsx';
import { Profile } from './components/ui/Profile.jsx';
import RootLayout from './components/ui/root.jsx';
import { EditProfile } from './components/ui/EditProfile.jsx';
import Search from './components/ui/search.jsx';
import Message from './components/ui/Message.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // --- PROTECTED ROUTES GROUP ---
      {
        // 2. This is the Layout Route. It has no path.
        // It applies the MainLayout (Sidebar + Protection) to all its children.
        element: <MainLayout />,
        children: [
          {
            // 3. Use index: true to make this the default page for the parent's path ('/')
            index: true,
            element: <Home />,
          },
          {
            // Note: the path is now relative to the parent
            path: 'profile/:username',
            element: <Profile />,
          },
          {
            path: 'edit-profile',
            element: <EditProfile />
          },
          {
            path: 'search',
            element: <Search />
          },
          {
            path: 'messages',
            element: <Message />
          }
          // You can add more protected routes here without wrapping them!
          // {
          //   path: 'settings',
          //   element: <Settings />
          // }
        ],
      },
      // --- PUBLIC ROUTES GROUP ---
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/signin',
        element: <Signin />,
      },
    ],
  },
]);

const App = () => {
  // const { user } = useSelector(store => store.auth)
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if (user) {
  //     const socketio = io('http://localhost:3000', {
  //       query: {
  //         userId: user?._id,

  //       },
  //       transports: ['websocket'],
  //     })
  //     dispatch(setSocket(socketio));
  //     socketio.on('OnlineUsers', (OnlineUser) => {
  //       dispatch(setOnlineUsers(OnlineUser));
  //     })
  //     return () => {
  //       socketio.disconnect();
  //       dispatch(setSocket(null));
  //     }
  //   }


  // }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;