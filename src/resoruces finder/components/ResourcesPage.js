import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FiPlus, FiSearch } from "react-icons/fi";
import AddResourceModal from "./AddResourceModal";
import "../styles/ResourceFinder.css";

// Function to shuffle the array
const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
};

const ResourceFinder = () => {
    const [resources, setResources] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const response = await axios.get(API_ROUTES.getResourceFinder);
            setResources(shuffleArray(response.data)); // Shuffle before setting state
        } catch (error) {
            console.error("Error fetching resources", error);
        }
    };

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === "") {
            fetchResources();
        } else {
            try {
                const response = await axios.get(`${API_ROUTES.searchResources}?query=${e.target.value}`);
                setResources(shuffleArray(response.data)); // Shuffle after search
            } catch (error) {
                console.error("Error searching resources", error);
            }
        }
    };

    return (
        <div className="container__resources__finder__page">
            {/* Header */}
            <div className="header__resources__finder__page">
                <h1 className="title__resources__finder__page">Edusify Resource Finder</h1>
            </div>

            {/* Search Bar */}
            <div className="search__bar__resources__finder__page">
                <FiSearch className="search__icon__resources__finder__page" />
                <input
                    type="text"
                    placeholder="Search for resources..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search__input__resources__finder__page"
                />
            </div>

            {/* Resources List */}
            <div className="resources__list__resources__finder__page">
                {resources.length > 0 ? (
                    resources.map((res) => (
                        <div key={res.id} className="resource__card__resources__finder__page">
                            <h2 className="resource__title">{res.title}</h2>
                            <p className="resource__description">{res.description}</p>
                            <a
                                href={res.link}
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
            <button
                className="add__button__resources__finder__page"
                onClick={() => setIsModalOpen(true)}
            >
                <FiPlus size={24} />
            </button>

            {/* Add Resource Modal */}
            {isModalOpen && <AddResourceModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ResourceFinder;
