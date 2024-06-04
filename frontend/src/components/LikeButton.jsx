import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaThumbsUp } from 'react-icons/fa';

const LikeButton = ({ postId, userId }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async () => {
        try {
            await axios.post(`http://localhost:8080/api/user/likes/${userId}/${postId}`, {}, {
                headers: {'Authorization': `Bearer ${Cookies.get('jwt')}`}
            });
            setIsLiked(true);
            toast.success('Post liked!');
        } catch (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 404:
                        toast.error('User or Post not found');
                        break;
                    case 400:
                        toast.error('You already liked this post!');
                        break;
                    default:
                        toast.error('Sorry, you already liked this post!');
                }
            } else {
                toast.error('Sorry, you need to register and log in if you want to like posts');
            }
        }
    };

    return (
        <button onClick={handleLike} disabled={isLiked} className={`bg-green-500 text-white px-4 py-2 rounded-md flex items-center ml-2 ${isLiked ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span className="mr-2">Like</span>
            <FaThumbsUp className="h-4 w-4" />
        </button>
    );
};

export default LikeButton;
