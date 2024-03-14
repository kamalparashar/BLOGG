import React from 'react'
import  {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const logoutHandler = () => {
        authService.logout()
        .then(() => {
          dispatch(logout())
        })
        .then(() => {
          navigate("/")
        })
        
    }
  return (
    <button
    onClick={logoutHandler} 
    className='text-xl font-semibold inline-block pl-6 py-2 duration-200 hover:bg-blue-100 rounded-full sm:text-base sm:pl-2 sm:rounded-none sm:hover:bg-transparent sm:hover:underline'>
      Logout
    </button>
  ) 
}

export default LogoutBtn