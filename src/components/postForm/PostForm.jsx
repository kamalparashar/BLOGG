import React, { useCallback, useEffect } from "react";
import { Button, Input, Select, RTE } from "../index";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import appwriteService from "../../appwrite/config";
import { useDispatch, useSelector } from "react-redux";
import { addPost, editPost } from "../../store/postsSlice";
import Compressor from 'compressorjs';

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

  const compressImage = async (file) => {
    try {
      const compressedBlob = await new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8, // Adjust the desired image quality (0.0 - 1.0)
          maxWidth: 800, // Adjust the maximum width of the compressed image
          maxHeight: 800, // Adjust the maximum height of the compressed image
          mimeType: "image/jpeg", // Specify the output image format
          success(result) {
            resolve(result);
          },
          error(error) {
            reject(error);
          },
        });
      });
      return new File([compressedBlob], file.name.split(".")[0], { lastModified: new Date().getTime(), type: compressedBlob.type })
    }
    catch(error){
      console.log("error in compressing image: ", error);
    }
  }

  const submit = async (data) => {
    console.log("data: ",data)
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
      const compressedImage = await compressImage(data.image[0]);
      const file = await appwriteService.uploadFile(compressedImage);
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
          await appwriteService.deleteFile(post.FeaturedImage);
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
      <div className="w-2/3 px-2 sm:w-full">
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
      <div className="w-1/3 px-2 sm:w-full">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
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
          className={post ? "w-full hover:bg-green-900" : "w-full hover:bg-blue-500 active:bg-blue-900"}
          children={post ? "Update" : "Submit"}
        />
      </div>
    </form>
  );
}
export default PostForm;
