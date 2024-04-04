import React, { useState, useEffect } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import {Header, Footer} from './components';
import { Outlet } from 'react-router-dom';
import { addPost } from './store/postsSlice';
import appwriteService from './appwrite/config';

function App() {
  
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const authStatus = useSelector(state=>state.auth.status);
  useEffect(()=>{
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData}));
      }
      else{
        dispatch(logout());
      }
    })
    .catch((error) => {
      console.log("NO user currently logged In");
      console.log("error in UseEffect:",error);
    })
    .finally(() => setLoading(false))
  },[])

  
  useEffect(() => {
    appwriteService.getPosts([]).then((posts) => {
            if(posts) {
              (posts.documents).forEach(post => {
                if (post){
                  dispatch(addPost(post));
                }
              })
            }
        })
  },[])
  

  return !loading ? (
  <div className='min-h-fit flex flex-wrap content-between bg-gray-400'>
    <div className='w-full block'>
      <Header />
      <main className='min-h-screen font-semibold md:text-lg lg:text-xl'>
        <Outlet />
      </main>
      <Footer />
    </div>
  </div>
  ) : null

}

export default App
