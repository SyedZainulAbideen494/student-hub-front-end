import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./PostsRooms.css"; // Import CSS file for styling
import { API_ROUTES } from "../../app_modules/apiRoutes";

const PostsRooms = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [type, setType] = useState("text");
    const [image, setImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch posts for the room
    const fetchPosts = async () => {
        const response = await axios.get(`${API_ROUTES.fetchRoomPosts}/${roomId}`);
        setPosts(response.data);
    };

    // Fetch user profile to get user_id for comparison
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(API_ROUTES.fetchUserProfile, { token });
                setProfile(data);
            } catch (err) {
                setError('Error fetching profile data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [roomId]);

    // Handle post submission
    const handlePostSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("type", type);
        formData.append("content", content);
        if (image) formData.append("image", image);

        await axios.post(`${API_ROUTES.postRoomPosts}/${roomId}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchPosts();
        setContent("");
        setImage(null);
        setShowForm(false); // Close the form after submission
    };

    // Handle post deletion
    const handleDeletePost = async (postId) => {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_ROUTES.deleteRoomPost}/${postId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchPosts();
    };

    // Close the post form modal
    const handleClose = () => {
        setShowForm(false);
    };

    return (
        <div className="posts__room__page">
            {/* Header */}
            <header className="header__post__room__page">
                <button
                    className="back-btn__post__room__page"
                    onClick={() => navigate(-1)}
                >
                    ← 
                </button>
                <h1>Room Posts</h1>
            </header>

            {/* Posts */}
            <div className="posts-list__post__room__page">
                {/* If there are no posts, display a message */}
                {posts.length === 0 ? (
                    <p className="no-posts-message__post__room__page">No posts yet! Be the first to add one.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.post_id} className="post__post__room__page">
                            <div className="post-header__post__room__page">
                                <h3>@{post.user_name}</h3>
                                <span>{new Date(post.created_at).toLocaleDateString("en-US", {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</span>
                            </div>
                            <div className="post-content__post__room__page">
                                {post.type === "text" && <p>{post.content}</p>}
                                {post.type === "image" && (
                                    <img
                                        src={`${API_ROUTES.displayImg}/${post.content}`}
                                        alt="Post content"
                                        className="post-image__post__room__page"
                                    />
                                )}
                            </div>
                    
                            {/* Log user IDs */}

                    
                            {/* Display delete button if the logged-in user is the author of the post */}
                            {profile && (
    <>
        {String(post.user_id) === String(profile.id) && (
            <button
  className="delete-btn__post__room__page"
  onClick={() => handleDeletePost(post.post_id)}
>
  <i className="fas fa-trash"></i> {/* Font Awesome trash icon */}
</button>

        )}
    </>
)}


                        </div>
                    ))
                    
                )}
            </div>

            {/* Floating Add Button */}
            <button
                className="add-btn__post__room__page"
                onClick={() => setShowForm(!showForm)}
            >
                +
            </button>

            {/* Post Form (modal-style) */}
            {showForm && (
                <div className="modal__post__room__page">
                    <form onSubmit={handlePostSubmit} className="post-form__post__room__page">
                        {/* Close button */}
                        <button
                            type="button"
                            className="close-btn__post__room__page"
                            onClick={handleClose}
                        >
                            &times;
                        </button>

                        {/* Textarea for content */}
                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />

                        {/* Select for content type */}
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                        </select>

                        {/* File input for images */}
                        {type === "image" && (
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                style={{ width: '93%' }}
                            />
                        )}

                        {/* Submit button */}
                        <button type="submit" className="post-btn">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostsRooms;
