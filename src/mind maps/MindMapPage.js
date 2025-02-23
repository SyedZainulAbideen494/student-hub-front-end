import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

const initialNodes = [
  { id: "1", position: { x: 250, y: 5 }, data: { label: "Start Node" } },
];

const MindMapPage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [title, setTitle] = useState("New Mind Map");

  // Load the mind map data from backend
  useEffect(() => {
    axios.get("http://localhost:8080/mindmaps").then((res) => {
      if (res.data.length > 0) {
        const map = res.data[0]; // Load first mind map
        setTitle(map.title);
        setNodes(JSON.parse(map.nodes));
      }
    });
  }, []);

  // Handle adding nodes
  const addNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((prev) => [...prev, newNode]);
  };

  // Handle node position change
  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  // Handle edge creation
  const onConnect = useCallback((connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  // Save Mind Map to Backend
  const saveMindMap = () => {
    axios
      .post("http://localhost:8080/mindmap", {
        title,
        nodes,
      })
      .then((res) => alert(res.data.message))
      .catch((err) => alert("Error saving: " + err));
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button onClick={addNode}>Add Node</button>
      <button onClick={saveMindMap}>Save Mind Map</button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MindMapPage;


