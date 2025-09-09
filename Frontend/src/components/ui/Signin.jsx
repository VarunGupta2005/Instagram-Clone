import React, { useState } from 'react'
import { Input } from './input.jsx'
import { Button } from './button.jsx'
import axios from 'axios'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/authSlice.js'

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
    password: ""
  })
  const [load, setLoading] = useState(false)
  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmmit = async (e) => {
    e.preventDefault()
    // console.log(input)
    try {
      setLoading(true)
      const res = await axios.post("https://chat-app-m37n.onrender.com/user/signin", input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        console.log(res.data.user)
        toast.success(res.data.message)
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form onSubmit={handleSubmmit} className="dark:bg-[#1e1e1e] shadow-2xl rounded-xl flex flex-col gap-5 p-8">
        <div>
          <h1 className='text-center font-bold text-xl'>ShareSpace</h1>
          <p className='text-center text-sm'>Signin to dive into the world of ShareSpace</p>
        </div>
        <div >
          <span className='font-medium'>Email</span>
          <Input type="email" className="focus-visible:ring-transparent my-2" name="email" onChange={handleChange} value={input.email}></Input>
        </div>
        <div >
          <span className='font-medium'>Password</span>
          <Input type="password" className="focus-visible:ring-transparent my-2" name="password" onChange={handleChange} value={input.password}></Input>
        </div>
        {
          load ? <Button type="Submit" disabled><Loader2 className='animate-spin' />Please Wait</Button> : <Button type="Submit">Signin</Button>
        }
        <span className="text-center">Create a new account - <Link className='text-blue-600' to="/signup"> SignUp</Link></span>
      </form>
    </div>
  )
}

export { Signin }
