import React from 'react'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux';

function MyPosts() {
    const posts = useSelector(state => state.posts.posts)
    const userData = useSelector(state => state.auth.userData)
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.slice(1).map((post) => 
                        (post.userId === userData.$id)?(
                            <div key={post.$id} className='p-2 w-1/4 sm:w-full sm:flex sm:flex-col sm:flex-wrap'>
                                <PostCard {...post} />
                            </div>
                        ):null
                    )}
                </div>
                </Container>
        </div>
    )
}

export default MyPosts