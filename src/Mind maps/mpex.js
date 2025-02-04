import React from "react";

const MindMapNode = ({ node }) => {
  return (
    <div style={{ border: "1px solid black", padding: "10px", margin: "10px" }}>
      <strong>{node.title}</strong>
      {node.children && node.children.length > 0 && (
        <div style={{ marginLeft: "20px", borderLeft: "2px solid gray", paddingLeft: "10px" }}>
          {node.children.map((child) => (
            <MindMapNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const MindMap = ({ data }) => {
  return (
    <div>
      <h2>Mind Map</h2>
      <MindMapNode node={data} />
    </div>
  );
};

export default MindMap;
