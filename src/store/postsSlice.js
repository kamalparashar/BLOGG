import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [{
        $id: '',
        title: '',
        slug: '',
        content: '',
        status: '',
        FeaturedImage: '',
        userId: '',
    }]
}

export const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        addPost: (state, action) => {
            const post = {
                $id:action.payload.$id,
                title:action.payload.title,
                slug:action.payload.slug,
                content:action.payload.content,
                FeaturedImage:action.payload.FeaturedImage,
                userId:action.payload.userId,
            }
            state.posts.push(post)
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter((post) => post.$id !== action.payload.$id)
        },
        editPost: (state, action) => {
            state.posts.forEach((post) => {
                if(post.$id === action.payload.$id){
                    post.title = action.payload.title
                    post.slug = action.payload.slug
                    post.content = action.payload.content
                    post.FeaturedImage = action.payload.FeaturedImage
                }
            })
        },
    }
})

export const {addPost, removePost, editPost} = postSlice.actions;

export default postSlice.reducer;