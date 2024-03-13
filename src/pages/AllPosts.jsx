import React from 'react'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux';

function AllPosts() {
    const posts = useSelector(state => state.posts.posts)
  
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.slice(1).map((post) => (
                        <div key={post.$id} className='p-2 w-1/4 sm:w-full sm:flex sm:flex-col sm:flex-wrap'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
                </Container>
        </div>
    )
}

export default AllPosts