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

  // 🌌 Luxury night-mode gradients
  const nodeColors = [
    "linear-gradient(135deg, #1f1c2c, #928dab)", // violet dusk
    "linear-gradient(135deg, #2c3e50, #4ca1af)", // deep ocean
    "linear-gradient(135deg, #373b44, #4286f4)", // steel blue
    "linear-gradient(135deg, #0f2027, #203a43, #2c5364)", // deep nebula
    "linear-gradient(135deg, #1a1a1a, #333333)", // graphite
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
            color: "#f5f5f5",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 6px 24px rgba(0, 255, 255, 0.1)",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: "center",
            cursor: "grab",
            transition: "all 0.25s ease",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            userSelect: "none",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          },
        }));

        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: true,
          style: {
            stroke: "#00ffe0",
            strokeWidth: 2.5,
            strokeDasharray: "2 4",
            strokeLinecap: "round",
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
        background: "linear-gradient(to bottom right, #0d0d0d, #1a1a1a)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {loading ? (
        <p
          style={{
            color: "#aaa",
            textAlign: "center",
            marginTop: "24px",
            fontSize: "15px",
            fontWeight: 500,
            fontFamily: "SF Pro Text, sans-serif",
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
              background: "rgba(255, 255, 255, 0.05)",
              color: "#eee",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "SF Pro Text, sans-serif",
              cursor: "pointer",
              transition: "all 0.25s ease-in-out",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
              zIndex: 1000,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)")
            }
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
