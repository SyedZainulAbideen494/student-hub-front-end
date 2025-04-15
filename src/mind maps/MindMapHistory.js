import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { FiArrowLeft, FiSearch, FiFilter } from "react-icons/fi"; // Icons
import "./MindMapHistory.css"; 

const MindMapHistory = () => {
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMindMaps = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(API_ROUTES.getMindMaps, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMindMaps(response.data);
      } catch (error) {
        console.error("Error fetching mind maps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMindMaps();
  }, []);

  // Filter mind maps by search term
  const filteredMindMaps = mindMaps
    .filter((mindmap) =>
      mindmap.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (sortOrder === "newest" ? b.created_at - a.created_at : a.created_at - b.created_at));

  return (
    <div className="mindmap-history__main__maps__view">
      {/* Back Button */}
      <button className="back-button__main__maps__view" onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} /> 
      </button>

      {/* Title */}
      <h1 className="mindmap-title__main__maps__view">My Mind Maps</h1>

      {/* Search & Sort */}
      <div className="search-container__main__maps__view">
        <div className="search-box__main__maps__view">
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Search mind maps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-box__main__maps__view">
          <FiFilter size={16} />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Mind Map List */}
      {loading ? (
        <p className="loading__main__maps__view">Loading...</p>
      ) : filteredMindMaps.length === 0 ? (
        <p className="empty__main__maps__view">No mind maps found.</p>
      ) : (
        <ul className="mindmap-list__main__maps__view">
          {filteredMindMaps.map((mindmap) => (
            <li
              key={mindmap.id}
              className="mindmap-item__main__maps__view"
              onClick={() => navigate(`/mindmap/${mindmap.id}`)}
            >
              <h2 className="mindmap-name__main__maps__view">{mindmap.name}</h2>
              <p className="mindmap-date__main__maps__view">
                <strong>Created on:</strong> {new Date(mindmap.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MindMapHistory;
