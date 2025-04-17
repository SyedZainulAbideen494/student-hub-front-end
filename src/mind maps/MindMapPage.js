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

  // 🖌️ Curated luxury Apple-like gradients (pastel with depth)
  const nodeColors = [
    "linear-gradient(135deg, #e0f7ff, #c0e0ff)", // Ice blue
    "linear-gradient(135deg, #ffd6f0, #ffc8e1)", // Blush pink
    "linear-gradient(135deg, #f6ffe0, #d8ffc8)", // Mint cream
    "linear-gradient(135deg, #f0e4ff, #d2c6ff)", // Lavender
    "linear-gradient(135deg, #fff0e0, #ffd6c2)", // Soft peach
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
            color: "#222222",
            borderRadius: "16px",
            padding: "16px 24px",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
            fontSize: "15px",
            fontWeight: 600,
            fontFamily: "SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif",
            textAlign: "center",
            cursor: "grab",
            transition: "all 0.25s ease",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            userSelect: "none",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        }));

        const formattedEdges = response.data.edges.map((edge) => ({
          id: `edge-${edge.from}-${edge.to}`,
          source: edge.from.toString(),
          target: edge.to.toString(),
          animated: true,
          style: {
            stroke: "#b5d6ff",
            strokeWidth: 2.5,
            strokeDasharray: "3 3",
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
        background: "linear-gradient(to bottom right, #f9fbff, #e8f0ff)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {loading ? (
        <p
          style={{
            color: "#222",
            textAlign: "center",
            marginTop: "24px",
            fontSize: "16px",
            fontWeight: 500,
            fontFamily: "SF Pro Text, sans-serif",
          }}
        >
          Preparing your mind map...
        </p>
      ) : (
        <>
          {/* 🧭 Exit Button */}
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "rgba(255, 255, 255, 0.6)",
              color: "#222",
              border: "1px solid rgba(0,0,0,0.05)",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "SF Pro Text, sans-serif",
              cursor: "pointer",
              transition: "all 0.25s ease-in-out",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
              zIndex: 1000,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.6)")
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
              borderRadius: "0px",
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
