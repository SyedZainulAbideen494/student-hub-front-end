import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyAssignments.css";
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

const MyAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
        const response = await fetch(API_ROUTES.getAllAssignments, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch assignments");

        setAssignments(data.assignments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="assignments_page" style={{marginBottom: '90px'}}>
      <h2 className="assignments_title">📂 My Assignments</h2>

      {loading ? (
        <p className="loading_message">Loading assignments...</p>
      ) : error ? (
        <p className="error_message">⚠️ {error}</p>
      ) : assignments.length > 0 ? (
        <div className="assignments_list">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="assignment_card"
              onClick={() => navigate(`/assignment/${assignment.id}`)}
            >
              <h3 className="assignment_title">{assignment.topic}</h3>
              <p className="assignment_date">📅 {new Date(assignment.created_at).toDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no_assignments">No assignments found.</p>
      )}
      <FooterNav/>
    </div>
  );
};

export default MyAssignments;
