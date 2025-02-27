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
  const [pdfFile, setPdfFile] = useState(null); // State for PDF
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mindMapCount, setMindMapCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("AI"); // Toggle between AI and PDF
  const [pdfFileName, setPdfFileName] = useState("");

  const navigate = useNavigate();

  const generateMindMap = async () => {
    if (selectedMode === "AI" && (!subject || !headings)) {
      alert("Please enter a subject and topics.");
      return;
    }

    if (selectedMode === "PDF" && !pdfFile) {
      alert("Please upload a PDF file.");
      return;
    }

    if (!isPremium && mindMapCount >= 1) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      let response;
      if (selectedMode === "AI") {
        response = await axios.post(
          API_ROUTES.generateMindMaps,
          { subject, headings, instructions },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const formData = new FormData();
        formData.append("file", pdfFile);

        response = await axios.post(API_ROUTES.generateMindMapsFromPDF, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

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

      setMindMapCount((prevCount) => prevCount + 1);

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
      axios
        .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then((response) => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));

      axios
        .get(API_ROUTES.coutMindMaps, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => setMindMapCount(response.data.count))
        .catch(() => setMindMapCount(0));
    } else {
      setIsPremium(false);
      setMindMapCount(0);
    }
  }, []);

  const handleMyMindMaps = () => {
    navigate("/mindmap/user");
  };

  return (
<div className="container__mind__map__make__page">
  <div className="glass-card__mind__map__make__page">
    <h1 className="title__mind__map__make__page">Generate AI Mind Map</h1>

    {/* Toggle Buttons for AI & PDF */}
    <div className="toggle-container__gen__mind__map">
      <button
        className={`toggle-btn__gen__mind__map ${selectedMode === "AI" ? "active__gen__mind__map" : ""}`}
        onClick={() => setSelectedMode("AI")}
      >
        AI
      </button>
      <button
        className={`toggle-btn__gen__mind__map ${selectedMode === "PDF" ? "active__gen__mind__map" : ""}`}
        onClick={() => setSelectedMode("PDF")}
      >
        PDF
      </button>
    </div>

    <div className="input-container__mind__map__make__page">
      {selectedMode === "AI" ? (
        <>
          <label className="label__gen__mind__map">Subject</label>
          <input
            type="text"
            placeholder="Enter subject (e.g., Biology)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input__mind__map__make__page"
          />

          <label className="label__gen__mind__map">Topics</label>
          <textarea
            placeholder="Enter topics (e.g., Photosynthesis)"
            value={headings}
            onChange={(e) => setHeadings(e.target.value)}
            className="textarea__mind__map__make__page"
          />

          <label className="label__gen__mind__map">Instructions (Optional)</label>
          <textarea
            placeholder="Enter any specific instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="textarea__mind__map__make__page"
          />
        </>
      ) : (
        <div className="file-upload-container__gen__mind__map">
  <label htmlFor="pdf-upload" className="label__gen__mind__map">
    Upload PDF
  </label>
  <input
  id="pdf-upload"
  type="file"
  accept="application/pdf"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  }}
  className="input__gen__mind__map"
/>
{pdfFileName && <p className="file-name__gen__mind__map">File uploaded: {pdfFileName}</p>}

</div>

      )}

      <button
        onClick={generateMindMap}
        disabled={loading}
        className="button__mind__map__make__page"
      >
        {loading ? "Generating..." : `Generate ${selectedMode} Mind Map`}
      </button>

      <button
        style={{ marginTop: "20px" }}
        onClick={handleMyMindMaps}
        className="button__mind__map__make__page"
      >
        My MindMaps
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
