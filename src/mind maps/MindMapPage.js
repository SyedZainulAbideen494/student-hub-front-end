import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ReactFlow from 'react-flow-renderer';
import * as d3 from "d3";

const MindMapPage = () => {
    const { mindMapId } = useParams();
    const [mindMap, setMindMap] = useState(null);

    useEffect(() => {
        axios.get(`https://g3zvcp57-8080.inc1.devtunnels.ms/api/mindmap/${mindMapId}`)
            .then(response => {
                setMindMap(response.data.mindMap);
                renderMindMap(response.data.mindMap);
            })
            .catch(error => console.error("Error fetching mind map:", error));
    }, [mindMapId]);

    // Helper function for rendering the mind map
    const renderMindMap = (data) => {
        const width = window.innerWidth * 0.9, height = window.innerHeight * 0.7; // Dynamic width and height based on viewport
        const svg = d3.select("#mindmap")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`); // Center the mind map

        const root = d3.hierarchy(data[0]);
        const treeLayout = d3.tree()
            .size([2 * Math.PI, 250]) // Radial layout (angle, radius)
            .separation(() => 1.5);

        treeLayout(root);

        const radialPoint = (x, y) => [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];

        // Draw edges (lines connecting nodes)
        svg.selectAll("line")
            .data(root.links())
            .enter()
            .append("line")
            .attr("x1", d => radialPoint(d.source.x, d.source.y)[0])
            .attr("y1", d => radialPoint(d.source.x, d.source.y)[1])
            .attr("x2", d => radialPoint(d.target.x, d.target.y)[0])
            .attr("y2", d => radialPoint(d.target.x, d.target.y)[1])
            .attr("stroke", "#888")
            .attr("stroke-width", 2);

        // Draw nodes (circles)
        svg.selectAll("circle")
            .data(root.descendants())
            .enter()
            .append("circle")
            .attr("cx", d => radialPoint(d.x, d.y)[0])
            .attr("cy", d => radialPoint(d.x, d.y)[1])
            .attr("r", d => (d.depth === 0 ? 20 : 12)) // Larger circle for the root
            .attr("fill", d => (d.depth === 0 ? "#007bff" : "#17a2b8"))
            .attr("stroke", "white")
            .attr("stroke-width", 2);

        // Add text labels
        svg.selectAll("text")
            .data(root.descendants())
            .enter()
            .append("text")
            .attr("x", d => radialPoint(d.x, d.y)[0])
            .attr("y", d => radialPoint(d.x, d.y)[1])
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .style("font-size", d => (d.depth === 0 ? "16px" : "14px"))
            .style("font-weight", d => (d.depth === 0 ? "bold" : "normal"))
            .style("fill", "#333")
            .text(d => d.data.content);

        // Zoom functionality with D3.js
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])  // Limit zoom between 50% and 300%
            .on("zoom", function(event) {
                svg.attr("transform", event.transform);  // Apply zooming and panning
            });

        svg.call(zoom);

        // Get the bounding box of the whole SVG to calculate the initial scale
        const boundingBox = svg.node().getBBox();
        const scale = Math.min(width / boundingBox.width, height / boundingBox.height) * 0.9; // Add margin

        // Apply the initial zoom to fit the entire map within the viewport
        svg.attr("transform", `translate(${width / 2}, ${height / 2}) scale(${scale})`);
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>Mind Map</h2>
            <div id="mindmap" style={{ display: "flex", justifyContent: "center", overflow: "hidden" }}></div>
            <div style={{ height: '500px', width: '100%', background: 'lightgray' }}>
                {/* React-Flow Component for Enhanced Interactivity */}
                <ReactFlow
                    elements={mindMap?.nodes || []}  // Add nodes here
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
            <Link to="/" style={{
                marginTop: "20px",
                display: "inline-block",
                padding: "10px 20px",
                background: "#007bff",
                color: "white",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "bold"
            }}>Go Back</Link>
        </div>
    );
};

export default MindMapPage;
