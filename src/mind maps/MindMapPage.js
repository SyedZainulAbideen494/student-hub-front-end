import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, { applyNodeChanges } from "reactflow";
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

  const nodeColors = [
    "linear-gradient(135deg, #dfe9f3, #ffffff)", // Soft White-Blue
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)", // Soft Pink-Blue
    "linear-gradient(135deg, #fdfbfb, #ebedee)", // Light Silver
    "linear-gradient(135deg, #cfd9df, #e2ebf0)", // Subtle Gray
    "linear-gradient(135deg, #e0c3fc, #8ec5fc)", // Pastel Purple-Blue
  ];

  useEffect(() => {
    const fetchMindMap = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${API_ROUTES.getMindMapById}/${mindmapId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const formattedNodes = response.data.nodes.map((node, index) => ({
          id: node.id.toString(),
          position: { x: node.x, y: node.y },
          data: { label: node.label },
          draggable: true, // Ensure the node is draggable
          style: {
            background: nodeColors[index % nodeColors.length],
            color: "black",
            borderRadius: "15px",
            padding: "10px 15px",
            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.2)",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "grab", // Visual indication
            transition: "0.3s",
          },
        }));

        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: false,
          style: { stroke: "#333", strokeWidth: 4 },
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

  // Handle node position updates
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const handleBack = () => {
    navigate("/mindmap/create");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#121212",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {loading ? (
        <p style={{ color: "#fff", textAlign: "center", marginTop: "20px" }}>
          Loading mind map...
        </p>
      ) : (
        <>
          {/* Exit Button */}
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
              backdropFilter: "blur(5px)",
              zIndex: 9999,
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "rgba(255, 255, 255, 0.3)")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "rgba(255, 255, 255, 0.15)")
            }
          >
            Exit
          </button>

          {/* Mind Map */}
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange} // Handle node movement
            fitView
            zoomOnScroll
            panOnScroll
            panOnDrag
            elementsSelectable
            nodesDraggable
            minZoom={0.2}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            style={{ width: "100%", height: "100%" }}
            proOptions={{ hideAttribution: true }}
          />
        </>
      )}
    </div>
  );
};

export default MindMap;
