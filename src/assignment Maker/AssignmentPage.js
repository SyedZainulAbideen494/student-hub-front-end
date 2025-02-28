import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./assignmentPage.css";
import { API_ROUTES } from "../app_modules/apiRoutes";

const AssignmentPage = () => {
  const { id } = useParams(); // Get ID from URL
  const navigate = useNavigate(); // Hook for back button navigation
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`${API_ROUTES.fetchAssignment}/${id}`);
        setAssignment(response.data.assignment);
      } catch (error) {
        console.error("Error fetching assignment:", error);
        alert("Failed to load assignment.");
      }
      setLoading(false);
    };

    fetchAssignment();
  }, [id]);

  const downloadPDF = () => {
    if (!contentRef.current) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Assignment</title>
          <style>
            * { font-family: 'Poppins', sans-serif; padding: 20px; margin: 0; }
            h1 { text-align: center; }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return <div className="assignment_maker__loading__get_Page__Assigment">Loading assignment...</div>;
  }

  return (
    <div className="assignment-maker">
    <div className="assignment-container">
      <button className="back-btn" onClick={() => navigate(-2)}>←</button>
      
      <h2 className="assignment-title">📄 Your Assignment</h2>
  
      {assignment ? (
        <div className="assignment-content" ref={contentRef} contentEditable suppressContentEditableWarning>
          <div dangerouslySetInnerHTML={{ __html: assignment }} />
        </div>
      ) : (
        <p className="assignment-not-found">Assignment not found.</p>
      )}
  
      {assignment && (
        <button className="download-btn" onClick={downloadPDF}>⬇ Download PDF</button>
      )}
    </div>
  </div>
  
  );
};

export default AssignmentPage;
