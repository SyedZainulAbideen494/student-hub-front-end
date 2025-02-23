import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls } from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_ROUTES } from "../app_modules/apiRoutes";

const MindMap = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  const mindmapId = params.mindMapId;

  useEffect(() => {
    const fetchMindMap = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_ROUTES.getMindMapById}/${mindmapId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Format nodes
        const formattedNodes = response.data.nodes.map((node) => ({
          id: node.id.toString(),
          position: { x: node.x, y: node.y },
          data: { label: node.label },
          style: {
            background: "#1e1e1e", // Dark theme
            color: "#fff",
            borderRadius: "12px",
            padding: "8px 12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "pointer",
          },
        }));

        // Format edges
        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: true,
          style: { stroke: "#00bfff", strokeWidth: 2 },
        }));

        setNodes(formattedNodes);
        setEdges(formattedEdges);
      } catch (error) {
        console.error("Error fetching mind map:", error);
      }
      setLoading(false);
    };

    fetchMindMap();
  }, [mindmapId]);

  const handleBack = () => {
    navigate('/mindmap/create')
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#121212", overflow: "hidden", position: "relative" }}>
      {loading ? (
        <p style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>Loading mind map...</p>
      ) : (
        <>
          {/* Exit Button */}
       {/* Exit Button */}
<button
  onClick={handleBack}
  style={{
    position: "absolute",
    top: "20px",
    left: "20px", // Move it to the left to avoid edge overlays
    background: "rgba(255, 255, 255, 0.15)", // Slightly more visible
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
    backdropFilter: "blur(5px)", // Aesthetic blur effect
    zIndex: 9999, // Ensures it's above the ReactFlow canvas
  }}
  onMouseOver={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.3)")}
  onMouseOut={(e) => (e.target.style.background = "rgba(255, 255, 255, 0.15)")}
>
  Exit
</button>


          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            zoomOnScroll
            panOnScroll
            panOnDrag
            elementsSelectable
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Controls />
          </ReactFlow>
        </>
      )}
    </div>
  );
};

export default MindMap;
