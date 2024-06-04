import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";


export default function EditPost() {

  let { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: "",
    subtitle: "",
    content: "",
    image: "",
    category: "",
  });

  const { title, subtitle, content, image, category} = blog;

  useEffect(() => {
    getBlog();
  }, []);
  

  const getBlog = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/blog/${id}`);
      setBlog({
        title: response.data.title,
        subtitle: response.data.subtitle,
        content: response.data.content,
        image: response.data.image,
        category: response.data.category,
      });
      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  const updateBlogPost = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/blog/${id}`, blog, {headers:
        {'Authorization': `Bearer ${Cookies.get('jwt')}`}
      });
      toast.success(response.data);
      setIsLoading(false);
      navigate("/blog");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
            toast.error("Authorization has expired or you need to log in. Please log in again.");
        } else {
            toast.error(error.response.data);
        }
      } else if (error.request) {
          toast.error("Sorry, wrong credentials. You don't have access to those features");
      } else {
          toast.error("An error occurred while creating the post.");
      }
      setIsLoading(false);

    }
  };

  return (
    <div className="container m-auto justify-center pr-4 pl-4">
      <h1 className="text-4xl my-8 underline text-black font-bold text-center">Edit Post</h1>
      <form onSubmit={updateBlogPost} className="bg-custom-green shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Title</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setBlog({ ...blog, title: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full"/>
        </div>
        <div className="mb-4">
          <label htmlFor="subtitle" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Subtitle</label>
          <input type="text" id="subtitle" name="subtitle" value={subtitle} onChange={(e) => setBlog({ ...blog, subtitle: e.target.value })} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Post</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={(val) => setBlog({ ...blog, content: val })}
            className="mt-1 border border-black rounded-md"
            formats={[
              "header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image",
            ]}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Image URL</label>
          <input type="text" id="image" name="image" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={image} onChange={(e) => setBlog({ ...blog, image: e.target.value })}/>
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Category</label>
          <input type="text" id="category" name="category" className="mt-1 p-2 border border-gray-300 rounded-md w-full" value={category} onChange={(e) => setBlog({ ...blog, category: e.target.value })}/>
        </div>
        {!isLoading && (
          <button type="submit" className="inline-block mt-4 shadow-md bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer">
            {isLoading ? "Updating..." : "Update Post"}
          </button>
        )}
      </form>
    </div>
  );
}