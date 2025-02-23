import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTES } from "../app_modules/apiRoutes";
import "./MindMapHistory.css"; // Updated CSS

const MindMapHistory = () => {
  const [mindMaps, setMindMaps] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="mindmap-history__main__maps__view">
      <h1 className="mindmap-title__main__maps__view">My Mind Maps</h1>

      {loading ? (
        <p className="loading__main__maps__view">Loading...</p>
      ) : mindMaps.length === 0 ? (
        <p className="empty__main__maps__view">No mind maps created yet.</p>
      ) : (
        <ul className="mindmap-list__main__maps__view">
          {mindMaps.map((mindmap) => (
            <li 
              key={mindmap.id} 
              className="mindmap-item__main__maps__view" 
              onClick={() => navigate(`/mindmap/${mindmap.id}`)}
            >
              <h2 className="mindmap-name__main__maps__view">{mindmap.name}</h2>
              <p className="mindmap-subject__main__maps__view"><strong>Subject:</strong> {mindmap.subject}</p>
              <p className="mindmap-date__main__maps__view"><strong>Created on:</strong> {new Date(mindmap.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MindMapHistory;
