import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import axios from "axios"

export default function Register(){

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

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

    const registerUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (username === "" || email === "" || password === "" || image === "") {
            toast.warn("Please, fill out all the input fields!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://revamped-blog-spring-boot-react-mysql.onrender.com/api/auth/register", {
                username: username,
                email: email,
                password: password,
                image: image,
            });
            toast.success(response.data);
            setIsLoading(false);
            navigate("/login");
        } catch (error) {
            toast.error(error.response.data);
            setIsLoading(false);
        }
    };

    return(
        <div className="flex justify-center items-center mt-36 m-4">
            <form onSubmit={registerUser} className="w-full max-w-lg px-6 py-8 bg-custom-green shadow-md rounded-md">
                <p className="text-center text-2xl font-bold mb-8 font-dela-gothic-one">Register</p>
                <div className="mb-6">
                    <label htmlFor="username" className="block mb-2 text-md font-bold text-gray-800">Username:</label>
                    <input className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="text" value={username} onChange={(e)=> setUsername(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-md font-bold text-gray-800">Email:</label>
                    <input className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-md font-bold text-gray-800">Password:</label>
                    <input className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label htmlFor="image" className="block mb-2 text-md font-bold text-gray-800">Profile Image:</label>
                    {!image && <input onChange={uploadImg} className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500" type="file" id="image" name="image"/>}
                    {image && <img src={image} alt="Uploaded" style={{width: '100px', height: '100px', display: 'block', margin: '0 auto', borderRadius: '50%'}}  />}
                </div>
                <button type="submit" disabled={isLoading} className="w-full mt-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">{isLoading ? "Registering..." : "Register"}</button>
                <div className="text-center mt-8">
                    <Link to="/login" className="text-sm cursor-pointer text-blue-500 underline hover:text-blue-700 focus:outline-none focus:text-blue-700">You already have an account? Login here!</Link>
                </div>
            </form>
        </div>
    );
}
