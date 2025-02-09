import React, { useState } from "react";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FiX } from "react-icons/fi";
import "../styles/AddResourceModal.css";

const AddResourceModal = ({ closeModal }) => {
    const [newResource, setNewResource] = useState({
        title: "",
        description: "",
        link: "",
        category: "", // New category state
    });
    const [message, setMessage] = useState("");

    // List of categories
    const categories = [
        "Previous Year Papers",
        "Sample Papers & Mock Tests",
        "Syllabus & Exam Patterns",
        "NCERT Books & Solutions",
        "Handwritten Notes (Toppers' Notes)",
        "Formula Sheets & Shortcuts",
        "Mind Maps & Flashcards",
        "Interactive Simulations (Virtual Labs)",
        "Study Planners & Time Management Tools",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newResource.title || !newResource.description || !newResource.link || !newResource.category) {
            setMessage("All fields are required!");
            return;
        }

        const token = localStorage.getItem("token"); // Get token from local storage

        try {
            await axios.post(API_ROUTES.addResources, newResource, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send token in Authorization header
                },
            });

            // Show alert for successful submission
            alert("Your resource has been sent for review. It will be live once approved by our team.");

            setMessage("Resource submitted for review!");
            setNewResource({ title: "", description: "", link: "", category: "" });
        } catch (error) {
            console.error("Error submitting resource", error);
            setMessage("Error submitting resource.");
        }
    };

    return (
        <div className="modal__overlay__resources__finder__page">
            <div className="modal__content__resources__finder__page">
                <FiX className="close__icon__resources__finder__page" onClick={closeModal} />
                <h2>Add a Resource</h2>
                {message && <p className="message__resources__finder__page">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Resource Title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Resource Description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Resource Link"
                        value={newResource.link}
                        onChange={(e) => setNewResource({ ...newResource, link: e.target.value })}
                    />

                    {/* Category Dropdown */}
                    <select
    className="select__add_resources__type"
    value={newResource.category}
    onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
>
    <option className="option__add_resources__type" value="">Select Category</option>
    {categories.map((category, index) => (
        <option key={index} className="option__add_resources__type" value={category}>
            {category}
        </option>
    ))}
</select>


                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddResourceModal;
