import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import "./MindMapGenerator.css";
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";
import UpgradeModal from "../premium/UpgradeModal";

const MindMapGenerator = () => {
  const [subject, setSubject] = useState("");
  const [headings, setHeadings] = useState("");
  const [instructions, setInstructions] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mindMapCount, setMindMapCount] = useState(0);
const [isPremium, setIsPremium] = useState(false);
const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Add state

  const navigate = useNavigate();

  const generateMindMap = async () => {
    if (!subject || !headings) {
      alert("Please enter a subject and topics.");
      return;
    }
  
    // Strictly prevent generation if user is not premium and has exceeded the limit
    if (!isPremium && mindMapCount >= 2) {
      setIsUpgradeModalOpen(true);
      return; // Prevent further execution
    }

    setLoading(true);
    const token = localStorage.getItem("token");
  
    try {
      const response = await axios.post(
        API_ROUTES.generateMindMaps,
        { subject, headings, instructions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { mindmapId, nodes, edges } = response.data;
  
      setNodes(
        nodes.map((node) => ({
          id: node.id.toString(),
          position: { x: node.x, y: node.y },
          data: { label: node.label },
        }))
      );
  
      setEdges(
        edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: true,
          style: { stroke: "#6A5ACD", strokeWidth: 2 },
        }))
      );
  
      // Increment local count
      setMindMapCount(prevCount => prevCount + 1);
  
      navigate(`/mindmap/${mindmapId}`);
    } catch (error) {
      console.error("Error generating mind map:", error);
      alert("Failed to generate mind map.");
    }
  
    setLoading(false);
  };
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      // Check if user is premium
      axios.post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then(response => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));
  
      // Fetch weekly mind map count
      axios.get(API_ROUTES.coutMindMaps, { headers: { Authorization: `Bearer ${token}` } })
        .then(response => setMindMapCount(response.data.count))
        .catch(() => setMindMapCount(0));
    } else {
      setIsPremium(false);
      setMindMapCount(0);
    }
  }, []);
  

  return (
    <div className="container__mind__map__make__page">
      <div className="glass-card__mind__map__make__page">
        <h1 className="title__mind__map__make__page">Generate AI Mind Map</h1>

        <div className="input-container__mind__map__make__page">
          <input
            type="text"
            placeholder="Enter subject (e.g., Biology)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__mind__map__make__page"
          />

          <textarea
            placeholder="Enter topics (e.g., Photosynthesis)"
            value={headings}
            onChange={(e) => setHeadings(e.target.value)}
            className="textarea__mind__map__make__page"
          />

          <textarea
            placeholder="instructions Optional (e.g., Details on specific topic)"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea__mind__map__make__page"
          />

          <button
            onClick={generateMindMap}
            disabled={loading}
            className="button__mind__map__make__page"
          >
            {loading ? "Generating..." : "Generate Mind Map"}
          </button>
        </div>
      </div>

      {nodes.length > 0 && (
        <div className="mindmap-container__mind__map__make__page">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <MiniMap className="minimap__mind__map__make__page" />
            <Controls />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      )}
      <FooterNav />
      <UpgradeModal 
  message={
    "Weekly limit reached!\n\n" +
    "Free users can generate only 2 mind maps per week. Remove limits, plan smarter, and stay ahead.\n\n" +
    "Upgrade to Edusify Premium now!"
  }
  isOpen={isUpgradeModalOpen} 
  onClose={() => setIsUpgradeModalOpen(false)} 
/>


    </div>
  );
};

export default MindMapGenerator;
