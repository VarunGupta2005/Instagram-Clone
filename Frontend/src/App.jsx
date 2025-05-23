import {Signup} from './components/ui/Signup.jsx'
import {Signin} from './components/ui/Signin.jsx'
import './App.css'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import {HeadCom} from './components/ui/HeadCom.jsx'
import {Home} from './components/ui/Home.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<HeadCom/>,
    children:[
      {
        path:"/home",
        element:<Home/>,
      }
    ]
  },
  {
  path:"/signup",
  element:<Signup/>
},
{
  path: "/signin",
  element:<Signin/>
}])

const App = () => {
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App;