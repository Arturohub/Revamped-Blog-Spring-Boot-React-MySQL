import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import moment from 'moment';

export default function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(9); 
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [noResults, setNoResults] = useState(false);
    const[Likes, setLikes] = useState("")


    const getBlogs = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://revamped-blog-spring-boot-react-mysql.onrender.com/api/blog");
            const sortedBlogs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const blogsWithLikes = await Promise.all(sortedBlogs.map(async blog => {
                const likesResponse = await axios.get(`https://revamped-blog-spring-boot-react-mysql.onrender.com/api/likes/count/${blog.id}`);
                return { ...blog, likes: likesResponse.data };
            }));
            setBlogs(blogsWithLikes);
            setIsLoading(false);
        } catch (error) {
            toast.error('Error fetching blog entries:', error);
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        getBlogs();
    }, []);

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const filteredBlogs = blogs.filter(blog =>
            blog.title.toLowerCase().includes(query.toLowerCase()) ||
            blog.subtitle.toLowerCase().includes(query.toLowerCase())
        );
        setNoResults(filteredBlogs.length === 0 && query !== '');
    };


    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = searchQuery ? blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(indexOfFirstPost, indexOfLastPost) : blogs.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold my-8 px-4 text-center">Latest Blog Posts</h1>
            <div className="mb-4 px-4">
                <input type="text" placeholder="Search blog posts..." value={searchQuery} onChange={handleSearch} className="border border-green-800 rounded-md px-4 py-2 w-full" />
            </div>
            {isLoading ? (
                <p className="px-4 w-full">Loading...Please, wait a bit, the database is free, so it shuts down when there is inactivity and takes 50 seconds to come back to life. Sorry for the inconveniences...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {noResults ? (
                        <p className="full-width">Sorry, no results found for "{searchQuery}". Please, try again with other keywords</p>
                    ) : (
                        currentPosts.map(blog => (
                            <div key={blog.id} className="bg-custom-green p-4 rounded-xl">
                                <div className="flex justify-between">
                                    <div className="w-3/4">
                                        <Link to={`/blog/${blog.id}`}><h2 className="text-xl font-semibold">{blog.title}</h2></Link>
                                        <p className="text-gray-600 text-lg">{blog.subtitle}</p>
                                        <p className="text-gray-600 text-md">Created {moment(blog.createdAt).fromNow()}</p>
                                        <p className="text-green-700 text-md font-semibold">Likes: {blog.likes}</p>
                                        <Link to={`/blog/${blog.id}`} className="text-blue-500 hover:underline">Read more</Link>
                                    </div>
                                    <div className="w-1/4">
                                        <Link to={`/blog/${blog.id}`}><img src={blog.image} alt="Blog Image" className="w-full h-auto rounded-xl" /></Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(blogs.length / postsPerPage) }, (_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)} className="mx-1 px-3 py-1 bg-green-700 text-white rounded-md font-bold text-md">{index + 1}</button>
                ))}
            </div>
        </div>
    );
}
