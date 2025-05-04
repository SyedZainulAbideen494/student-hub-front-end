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

  // 🍬 Pastel node colors for light theme
  const nodeColors = [
    "linear-gradient(135deg, #fdfbfb, #ebedee)",     // light silver
    "linear-gradient(135deg, #d9afd9, #97d9e1)",     // pink to blue
    "linear-gradient(135deg, #ffecd2, #fcb69f)",     // peachy
    "linear-gradient(135deg, #e0c3fc, #8ec5fc)",     // purple to blue
    "linear-gradient(135deg, #f6f9fc, #e9eff5)",     // icy white
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
            color: "#333333",
            borderRadius: "20px",
            padding: "18px 24px",
            fontSize: "16px",
            fontWeight: 600,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            userSelect: "none",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            cursor: "grab",
            transition: "transform 0.2s ease",
          },
        }));

        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: true,
          style: {
            stroke: "#a1a1aa", // soft gray
            strokeWidth: 2,
            strokeLinecap: "round",
            opacity: 0.6,
          },
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
        background: "linear-gradient(120deg, #ffffff, #f6f6f6)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {loading ? (
        <p
          style={{
            color: "#777",
            textAlign: "center",
            marginTop: "24px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
          }}
        >
          Generating your mind map...
        </p>
      ) : (
        <>
          {/* 🚪 Exit Button */}
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(0, 0, 0, 0.03)",
              color: "#333",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              padding: "10px 18px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              zIndex: 1000,
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.06)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.background = "rgba(0, 0, 0, 0.03)";
            }}
          >
            ← Back
          </button>

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
            minZoom={0.5}
            maxZoom={2}
            snapToGrid={true}
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            style={{
              width: "100%",
              height: "100%",
              transition: "all 0.25s ease-in-out",
            }}
            proOptions={{ hideAttribution: true }}
          />
        </>
      )}
    </div>
  );
};

export default MindMap;
