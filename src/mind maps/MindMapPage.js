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

  // **Luxurious Colors & Soft Gradients**
  const nodeColors = [
    "linear-gradient(135deg, #f7f7f7, #e6e6e6)", // Elegant Silver
    "linear-gradient(135deg, #dce5f6, #ffffff)", // Frosted Blue-White
    "linear-gradient(135deg, #f0f8ff, #ffffff)", // Subtle Ice White
    "linear-gradient(135deg, #eaeaea, #d4d4d4)", // Minimalist Platinum
    "linear-gradient(135deg, #ffffff, #f9f9f9)", // Apple-like Glass
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
          draggable: true,
          style: {
            background: nodeColors[index % nodeColors.length],
            color: "#333",
            borderRadius: "18px",
            padding: "12px 18px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
            fontSize: "15px",
            fontWeight: "bold",
            textAlign: "center",
            cursor: "grab",
            transition: "all 0.3s ease-in-out",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(10px)",
          },
        }));

        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: false,
          style: { stroke: "#888", strokeWidth: 3 },
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
        background: "linear-gradient(135deg, #1a1a1a, #111)",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <p style={{ color: "#fff", textAlign: "center", fontSize: "18px" }}>
          Loading mind map...
        </p>
      ) : (
        <>
          {/* **Exit Button - Premium Look** */}
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s ease-in-out",
              backdropFilter: "blur(8px)",
              zIndex: 9999,
            }}
            onMouseOver={(e) =>
              (e.target.style.background = "rgba(255, 255, 255, 0.25)")
            }
            onMouseOut={(e) =>
              (e.target.style.background = "rgba(255, 255, 255, 0.1)")
            }
          >
            ⬅ Exit
          </button>

          {/* **Mind Map - Ultra Smooth & Elegant** */}
          <div
            style={{
              width: "90%",
              height: "90%",
              borderRadius: "20px",
              boxShadow: "0 10px 40px rgba(255, 255, 255, 0.05)",
              overflow: "hidden",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              fitView
              zoomOnScroll
              panOnScroll
              panOnDrag
              elementsSelectable
              nodesDraggable
              minZoom={0.4}
              maxZoom={1.8}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(255, 255, 255, 0.05)",
              }}
              proOptions={{ hideAttribution: true }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MindMap;
