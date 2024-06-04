import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import RelatedPosts from '../components/RecommendedPosts';
import LikeButton from '../components/LikeButton';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';


export default function SinglePost() {
    const [blog, setBlog] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    
    const { user, setUser } = useContext(AuthContext);

    const getBlogPost = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://revamped-blog-spring-boot-react-mysql.onrender.com/api/blog/${id}`);
            setBlog(response.data);
            const likesResponse = await axios.get(`https://revamped-blog-spring-boot-react-mysql.onrender.com/api/likes/count/${id}`);
            setLikeCount(likesResponse.data);
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                navigate('/not-found');
            } else {
                toast.error('Failed to fetch blog post.');
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        getBlogPost();
    }, [id]);

    const deleteBlogPost = async () => {
        const result = await Swal.fire({
            title: 'Delete blog post',
            text: 'Do you really want to delete this post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
            iconColor: 'blue',
            background: 'gray'
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`https://revamped-blog-spring-boot-react-mysql.onrender.com/api/admin/blog/${id}`, {
                    headers: { 'Authorization': `Bearer ${Cookies.get('jwt')}` }
                });
                toast.success(response.data);
                navigate("/blog");
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    navigate('/not-found');
                } else {
                    toast.error('Failed to delete blog post.');
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <div className="container m-auto px-4 py-8">
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="max-w-8xl mx-auto bg-custom-green gap-10 rounded-xl p-4">
                    {blog && blog.title ? (
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div className="lg:order-2">
                                {blog.image && (
                                    <img src={blog.image} className="w-full mb-4 rounded-xl" alt="Blog Post" />
                                )}
                            </div>
                            <div className="lg:order-1">
                                <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>
                                <h2 className="text-xl font-semibold mb-2 text-center">{blog.subtitle}</h2>
                                <div className="text-gray-900 mb-4 text-justify leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}></div>
                            </div>
                            <div className="lg:order-3 flex justify-end">
                                <LikeButton postId={id} userId={user} />
                                {user === "Arturo" && (
                                    <>
                                        <Link to={`/blog/editpost/${id}`} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center ml-2">
                                            <span className="mr-2">Edit</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M2 5a1 1 0 011-1h4a1 1 0 110 2H3a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h14a.5.5 0 00.5-.5V8.5a.5.5 0 00-.5-.5h-2a1 1 0 110-2h2A1.5 1.5 0 0120 8.5V17a3 3 0 01-3 3H3a3 3 0 01-3-3V5zm8-1a1 1 0 011 1v8a1 1 0 11-2 0V5a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </Link>
                                        <button onClick={deleteBlogPost} className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center ml-2">
                                            <span className="mr-2">Delete</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 3a1 1 0 011-1 1 1 0 011 1v12a1 1 0 01-2 0V3zm5-1a1 1 0 00-1 1v12a1 1 0 102 0V3a1 1 0 00-1-1zm4.464 13.95A3.5 3.5 0 1115.5 18H17a1 1 0 011 1 1 1 0 01-1 1H8a1 1 0 01-1-1 1 1 0 011-1h1.5a3.5 3.5 0 11-1.036-2.502l-2.232-6.174A1 1 0 016.307 9H17.5a1 1 0 110 2h-8.387l2.232 6.174zM5 20a1 1 0 100-2 1 1 0 000 2zm10-8H5a1 1 0 010-2h10a1 1 0 010 2z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Blog post not found.</p>
                    )}
                </div>
            )}
            <div className="bg-custom-green mt-10 rounded-xl">
                <RelatedPosts id={id} category={blog.category} />
            </div>
        </div>
    );
}