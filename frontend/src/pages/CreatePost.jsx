import { useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Cookies from "js-cookie";


export default function CreatePost(){
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("Life");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ["Life", "Basketball", "Programming", "Movies", "Books", "Comics", "Art", "Trips"];

    const uploadImg = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            toast.error("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL;

        try {
            const resp = await axios.post(cloudinaryUrl, formData, {
                withCredentials: false,
            });
            const imageUrl = resp.data.secure_url;
            setImage(imageUrl);
            toast.success('Image uploaded successfully!');
        } catch (error) {
            toast.error("Error uploading picture. Please try again later.");
            setIsLoading(false);
        }
    };



    const createPost = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!title || !subtitle || !content || !image || !category) {
            toast.warn("Please fill out all the input fields!");
            setIsLoading(false);
            return;
        }

        try {
            let headers = {};
            const jwt = Cookies.get('jwt');
            if (jwt) {
                headers = {
                    'Authorization': `Bearer ${jwt}`
                };
            }

            const response = await axios.post("https://revamped-blog-spring-boot-react-mysql.onrender.com/api/admin/blog", 
            { title, subtitle, content, image, category },
            { headers }
            );
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
                toast.error("Authorization expired. Please, log in again");
            } else {
                toast.error("An error occurred while creating the post.");
            }
            setIsLoading(false);
        }
    }

    return (
        <div className="container m-auto justify-center pr-4 pl-4">
            <h1 className="text-4xl my-8 underline text-black font-bold text-center">Create a New Post</h1>
            <form onSubmit={createPost} className="bg-custom-green shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Title</label>
                    <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor="subtitle" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Subtitle</label>
                    <input type="text" id="subtitle" name="subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Post</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="mt-1 border border-black rounded-md"
                        formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image']}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Upload Image</label>
                    {!image && <input onChange={uploadImg} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="file" id="image" name="image"/>}
                    {image && <img src={image} alt="Uploaded" style={{width: '100px', height: '100px', display: 'block', margin: '0 auto', borderRadius: '50%'}}  />}
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="block text-gray-700 font-extrabold underline text-lg tracking-wider mb-2">Category</label>
                    <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded-md w-full">
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                {!isLoading && (
                    <button type="submit" className="inline-block mt-4 shadow-md bg-green-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-green-900 hover:cursor-pointer">
                        {isLoading ? 'Creating...' : 'Create Post'}
                    </button>
                )}
            </form>
        </div>
    );
}