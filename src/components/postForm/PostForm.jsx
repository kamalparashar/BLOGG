import React, { useCallback, useEffect } from "react";
import { Button, Input, Select, RTE } from "../index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config";
import { useDispatch, useSelector } from "react-redux";
import { addPost, editPost } from "../../store/postsSlice";

function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, getValues, control } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  
  const submit = async (data) => {
    if (post) {
      const file = data.image[0]
        ? await appwriteService.uploadFile(data.image[0])
        : null;

      if (file) {
        appwriteService.deleteFile(post.FeaturedImage);
      }

      const dbPost = await appwriteService.updatePost(post.$id, {
        ...data,
        FeaturedImage: file ? file.$id : undefined,
      });
      if (dbPost) {
        dispatch(editPost(dbPost))
        navigate(`/post/${dbPost.$id}`)
      }
    }
    else {
      const file = await appwriteService.uploadFile(data.image[0]);

      if (file) {
        data.FeaturedImage = file.$id;
        const dbPost = await appwriteService.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) {
          dispatch(addPost(dbPost))
          navigate(`/post/${dbPost.$id}`)
        }
        else{
          console.log("NO dbPost id created:: issue in createPost");
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      const slug = value.toLowerCase().replace(/ /g, "-");
      return slug;
    }
    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            setValue("slug", 
            slugTransform(e.currentTarget.value), 
            {shouldValidate: true});
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>  
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.FeaturedImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full hover:bg-blue-500"
          children={post ? "Update" : "Submit"}
        />
      </div>
    </form>
  );
}
export default PostForm;
