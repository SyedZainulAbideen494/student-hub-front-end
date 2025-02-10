import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTES } from "../../app_modules/apiRoutes";
import { FiPlus, FiSearch, FiHeart } from "react-icons/fi";
import AddResourceModal from "./AddResourceModal";
import "../styles/ResourceFinder.css";
import FooterNav from "../../app_modules/footernav";
import { FaRobot, FaSearch } from "react-icons/fa";
import UpgradeModal from "../../premium/UpgradeModal";

const categories = [
    "All",
    "Previous Year Papers",
    "Sample Papers & Mock Tests",
    "Syllabus & Exam Patterns",
    "NCERT Books & Solutions",
    "Handwritten Notes (Toppers' Notes)",
    "Formula Sheets & Shortcuts",
    "Mind Maps",
    "Saved Resources"
];

const ResourceFinder = () => {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [savedResources, setSavedResources] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAISearch, setIsAISearch] = useState(false);
    const [aiResults, setAiResults] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Add state

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

    const handleAISearch = async () => {
        if (!searchQuery) return;
        setLoadingAI(true);
        try {
            const response = await axios.post(API_ROUTES.aiResourceFinder, { query: searchQuery });
            setAiResults(response.data.recommendations);
            setFilteredResources(response.data.resources);
        } catch (error) {
            console.error("AI search error", error);
            alert("Failed to fetch AI recommendations.");
        }
        setLoadingAI(false);
    };

    const SparkleIcon = () => (
        <svg height="24" width="24" fill="#9b4d96" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className="sparkle">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
        </svg>
      );

      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          axios.post(API_ROUTES.checkSubscription, {}, { headers: { 'Authorization': token } })
            .then(response => setIsPremium(response.data.premium))
            .catch(() => setIsPremium(false));
        } else {
          setIsPremium(false);
        }
      }, []);


      const handleOpenUpgrade = () => {
        setIsUpgradeModalOpen(true)
      }
      
      

    return (
        <div className="container__resources__finder__page">
            {/* Header */}
            <div className="header__resources__finder__page">
                <h1 className="title__resources__finder__page">Edusify Resource Finder</h1>
            </div>
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

{/* Manual Search Bar */}
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

{/* AI Search Bar (Enhanced UI) */}
<div className="ai__search__bar">
<SparkleIcon className="ai-explain-flashcard-icon" />
    <input
        type="text"
        placeholder="  I m studying for cbse class 10 boards"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="ai__search__input"
    />
                {isPremium ? (
    <button className="resoruces__find__page__ai-search-btn"  onClick={handleAISearch} disabled={loadingAI}>
    {loadingAI ? "Searching..." : <><FaSearch className="ai-search-icon" /></>}
    </button>
    ) : (
    <button className="resoruces__find__page__ai-search-btn"  onClick={handleOpenUpgrade}>
    {loadingAI ? "Searching..." : <><FaSearch className="ai-search-icon" /></>}
    </button>
    )}

</div>


            {/* Resources List */}
            <div className="resources__list__resources__finder__page">
            {aiResults && (
    <div className="ai__recommendations__container">
        <h3 className="ai__recommendations__title">AI Recommendations</h3>
        <p className="ai__recommendations__text">{aiResults}</p>
    </div>
)}


                {filteredResources.length > 0 ? (
                    filteredResources.map((res) => (
                        <div key={res.id} className="resource__card__resources__finder__page">
                            <button
                                className={`save__button ${savedResources.has(res.id) ? "saved" : ""}`}
                                onClick={() => toggleSaveResource(res.id)}
                            >
                                <FiHeart size={18} />
                            </button>

                            <h2 className="resource__title" style={{ padding: "10px", marginRight: "5px" }}>{res.title}</h2>
                            <p className="resource__description">{res.description}</p>
                            <a
                                href={res.link}
                                onClick={(e) => handleResourceClick(res.id, res.link)}
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
            <UpgradeModal 
        message="You are not a premium member. Upgrade to Premium to access this feature." 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
            {/* Add Resource Modal */}
            {isModalOpen && <AddResourceModal closeModal={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default ResourceFinder;
