import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { removePost } from "../store/postsSlice";

export default function Post() {
    const [post, setPost] = useState(null)
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const authStatus = useSelector(state => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post)
                }
                else{
                    navigate("/")
                }
            })
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.FeaturedImage).then((status) => {
                    if(status){
                        dispatch(removePost(post))
                        navigate("/")
                    }
                })
            }
        })
    }
    if(authStatus){
        return post ? (
            <div className="py-8">
                <Container>
                    <div className="w-full flex justify-center items-center mb-4 relative p-2 pb-3">
                        <img
                            src={appwriteService.getFilePreview(post.FeaturedImage)}
                            alt={post.title}
                            className="rounded-xl"
                            height={600}
                        />
                        {isAuthor && (
                            <div className="absolute right-6 top-6 sm:top-2 sm:right-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button bgColor="bg-green-600" className="mr-3 hover:bg-green-400 active:bg-green-900">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-600" className="hover:bg-red-400 active:bg-red-900" onClick={deletePost}>
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="w-full mb-6 text-center">
                        <h1 className="text-4xl font-bold sm:text-xl md:text-3xl">{post.title}</h1>
                    </div>
                    <div className="browser-css m-10 md:m-6 sm:m-4">
                        {parse(post.content)}
                    </div>
                </Container>
            </div>

        ) : null;
    }
    else{
        return (
        <div className="w-full h-[70vh] py-8 mt-4 text-center flex justify-center items-center">
            <Container>
            <div className="flex flex-wrap">
                <div className="p-2 w-full">
                <h1 className="text-4xl font-bold hover:text-gray-500">
                    Login to read posts
                </h1>
                </div>
            </div>
            </Container>
        </div>
        )
  // }
    }
}