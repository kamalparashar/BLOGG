import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components";
import { useSelector } from "react-redux";

function Home() {
  const authStatus = useSelector((state) => state.auth.status)
  const posts = useSelector(state => state.posts.posts)

  if(authStatus){
    return (
      <div className='w-full py-8'>
          <Container>
                {(posts.length === 1) ? 
                  <h1 className="text-2xl font-bold flex justify-center items-center hover:text-gray-500">
                    No Posts to show
                  </h1> : 
                  <div className='flex flex-wrap'>
                  {posts.slice(1).map((post) => (
                      <div key={post.$id} className='p-2 w-1/4 sm:w-full sm:flex sm:flex-col sm:flex-wrap'>
                          <PostCard {...post} />
                      </div>
                  ))}
              </div>
                }
              </Container>
      </div>
    )
  }
  else{
    return (
      <div className="w-full py-8 mt-4 text-center">
        <Container>
          <div className="flex flex-wrap">
            <div className="p-2 w-full">
              <h1 className="text-2xl font-bold hover:text-gray-500">
                Login to read posts
              </h1>
            </div>
          </div>
        </Container>
      </div>
    )
  } 
}

export default Home;
