import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RelatedPosts = ({ id, category }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/blog`);
                const filteredByCategory = response.data.filter(post => post.category === category && post.id !== id);
                const limitedPosts = filteredByCategory.slice(0, 5);
                setRelatedPosts(limitedPosts);
            } catch (error) {
                console.error('Failed to fetch related posts:', error);
            }
        };

        fetchRelatedPosts();
    }, [id, category]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-4">Some other posts that might interest you:</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {relatedPosts.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                        <Link to={`/blog/${post.id}`} className="block">
                            <img src={post.image} alt={post.title} className="mb-2 w-full h-auto rounded-md" />
                            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        </Link>
                        <p className="text-gray-700">{post.subtitle}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedPosts;
