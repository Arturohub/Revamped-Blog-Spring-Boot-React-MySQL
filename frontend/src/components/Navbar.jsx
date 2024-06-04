import Logo from '../assets/images/logo.jpg';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function Navbar() {
    const navigate = useNavigate();

    const { user, setUser } = useContext(AuthContext);

    
    const logout = async () => {
        try {
            await axios.post("https://revamped-blog-spring-boot-react-mysql.onrender.com/api/auth/logout", null, { withCredentials: true });
            Cookies.remove('jwt');
            toast.success("User logged off successfully. Thanks for visiting!");
            setUser("");
            navigate("/")
        } catch (error) {
            toast.error("Sorry, error logging out");
        }
    }

    return (
        <div className="flex items-center justify-between bg-green-800 text-white p-4 lg:p-6">
            <div className="flex items-center">
                <img src={Logo} alt="LogoNavbar" className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 cursor-pointer rounded-xl" />
                <Link to="/" className="ml-4 font-bold text-md lg:text-2xl md:text-xl">Home</Link>
                <Link to="/blog" className="ml-4 font-bold text-md lg:text-2xl md:text-xl">Blog</Link>
                {user === "Arturo" && (
                    <Link to="/blog/create" className="ml-4 font-bold text-md lg:text-2xl md:text-xl">Create Post</Link>
                )}
            </div>
            {user && (
                <Link to="/" onClick={logout} className="ml-4 font-bold text-md lg:text-2xl md:text-xl">Logout</Link>
            )}
            {!user && (
                <Link to="/login" className="ml-4 font-bold text-md lg:text-2xl md:text-xl">Login</Link>
            )}
        </div>
    );
}
