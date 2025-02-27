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
    <div className="assignment_maker__get_Page__Assigment">
      <div className="assignment_maker__container__get_Page__Assigment">
        <button className="assignment_maker__back_btn__get_Page__Assigment" onClick={() => navigate(-2)}>
          ← Back
        </button>
        <h2 className="assignment_maker__title__get_Page__Assigment">📄 Assignment</h2>

        {assignment ? (
          <div className="assignment_maker__result__get_Page__Assigment">
            <h3 className="assignment_maker__result_title__get_Page__Assigment">Generated Assignment</h3>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className="assignment_maker__editable__get_Page__Assigment"
            >
              <div dangerouslySetInnerHTML={{ __html: assignment }} />
            </div>
            <button className="assignment_maker__download__get_Page__Assigment" onClick={downloadPDF}>
              Download as PDF
            </button>
          </div>
        ) : (
          <p className="assignment_maker__not_found__get_Page__Assigment">Assignment not found.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
