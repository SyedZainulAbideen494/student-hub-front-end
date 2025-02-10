import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FiPlus, FiSearch, FiHeart, FiSave } from "react-icons/fi";
import AddResourceModal from "./AddResourceModal";
import "../styles/ResourceFinder.css";
import FooterNav from "../../app_modules/footernav";
import { BsFillTicketDetailedFill } from "react-icons/bs";

const categories = [
    "All",
    "Previous Year Papers",
    "Sample Papers & Mock Tests",
    "Syllabus & Exam Patterns",
    "NCERT Books & Solutions",
    "Handwritten Notes (Toppers' Notes)",
    "Formula Sheets & Shortcuts",
    "Mind Maps",
    "Saved Resources" // Added this category
];

const ResourceFinder = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [savedResources, setSavedResources] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchResources();
        fetchSavedResources();
    }, []);

    useEffect(() => {
        filterResources();
    }, [selectedCategory, searchQuery, resources, savedResources]);

    const fetchResources = async () => {
        try {
            const response = await axios.get(API_ROUTES.getResourceFinder);
            setResources(response.data);
        } catch (error) {
            console.error("Error fetching resources", error);
        }
    };

    const fetchSavedResources = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            
            const response = await axios.get(API_ROUTES.getSavedResources, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const savedSet = new Set(response.data.map(res => res.resource_id));
            setSavedResources(savedSet);
        } catch (error) {
            console.error("Error fetching saved resources", error);
        }
    };

    const toggleSaveResource = async (resourceId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to save resources.");
                return;
            }

            const response = await axios.post(API_ROUTES.toggleSaveResource, { resourceId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { saved } = response.data;

            setSavedResources((prev) => {
                const newSet = new Set(prev);
                if (saved) {
                    newSet.add(resourceId);
                } else {
                    newSet.delete(resourceId);
                }
                return newSet;
            });

        } catch (error) {
            console.error("Error toggling save state", error);
            alert("Failed to save/unsave resource.");
        }
    };

    const handleResourceClick = async (resourceId, link) => {
        try {
            await axios.post(API_ROUTES.resourceClick, { resourceId });
        } catch (error) {
            console.error("Error tracking click", error);
        }
        window.open(link, "_blank");
    };
    

    const filterResources = () => {
        let filtered = resources;

        if (selectedCategory === "Saved Resources") {
            filtered = resources.filter((res) => savedResources.has(res.id));
        } else if (selectedCategory !== "All") {
            filtered = resources.filter((res) => res.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter((res) =>
                res.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredResources(filtered);
    };

    return (
        <div className="container__resources__finder__page">
            {/* Header */}
            <div className="header__resources__finder__page">
                <h1 className="title__resources__finder__page">Edusify Resource Finder</h1>
            </div>

            {/* Category Filters */}
            <div className="categories__bar">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category__button ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="search__bar__resources__finder__page">
                <FiSearch className="search__icon__resources__finder__page" />
                <input
                    type="text"
                    placeholder="Search for resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search__input__resources__finder__page"
                />
            </div>

            {/* Resources List */}
            <div className="resources__list__resources__finder__page">
                {filteredResources.length > 0 ? (
                    filteredResources.map((res) => (
                        <div key={res.id} className="resource__card__resources__finder__page">
                        {/* Save Button positioned at the top-right */}
                        <button
                            className={`save__button ${savedResources.has(res.id) ? "saved" : ""}`}
                            onClick={() => toggleSaveResource(res.id)}
                        >
                            <FiHeart size={18} />
                        </button>
                    
                        <h2 className="resource__title" style={{padding: '10px', marginRight: '5px'}}>{res.title}</h2>
                        <p className="resource__description">{res.description}</p>
                        <a
    href={res.link}
    onClick={(e) => {
        handleResourceClick(res.id, res.link);
    }}
    target="_blank"
    rel="noopener noreferrer"
    className="resource__link"
>
    Visit Resource
</a>

                    </div>
                    
                    ))
                ) : (
                    <p className="no__resources__resources__finder__page">No resources found.</p>
                )}
            </div>

            {/* Floating Add Button */}
            <button className="add__button__resources__finder__page" onClick={() => setIsModalOpen(true)}>
                <FiPlus size={24} />
            </button>

            <FooterNav />

            {/* Add Resource Modal */}
            {isModalOpen && <AddResourceModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ResourceFinder;
