import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./assignment maker.css";
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { FaArrowRight, FaFileAlt, FaStickyNote } from "react-icons/fa";

const GenerateAssignment = () => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [pages, setPages] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(API_ROUTES.checkSubscription, {}, { headers: { Authorization: token } })
        .then((response) => setIsPremium(response.data.premium))
        .catch(() => setIsPremium(false));

      // Check if user has already generated an assignment
      axios
        .get(API_ROUTES.checkUserAssignment, { headers: { Authorization: token } })
        .then((response) => {
          if (response.data.assignments.length > 0) {
            setHasGenerated(true);
          }
        })
        .catch(() => setHasGenerated(false));
    } else {
      setIsPremium(false);
      setHasGenerated(false);
    }
  }, []);

  

  const generateAssignment = async () => {
    if (!topic) return alert("Enter an assignment topic.");
    if (!isPremium && hasGenerated) return alert("Free users can generate only one assignment. Upgrade to premium!");

    setLoading(true);
    navigate("/loading-assignment"); // Navigate to the loading page

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_ROUTES.generateAssignment, {
        topic,
        details,
        pages,
        token,
      });

      const assignmentId = response.data.id; // API should return an ID
      navigate(`/assignment/${assignmentId}`); // Redirect to assignment page
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate assignment.");
      navigate("/assignment-maker"); // Redirect back if failed
    }

    setLoading(false);
  };

  return (
    <div className="wrapper__assignment__gen__page">
      <div className="card__assignment__gen__page animate__fade__assignment__gen__page">
        <h2 className="title__assignment__gen__page">
          <FaFileAlt /> Assignment Maker
        </h2>

        <input
          type="text"
          placeholder="Topic"
          className="input__assignment__gen__page"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <textarea
          placeholder="Additional Details"
          className="textarea__assignment__gen__page"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <input
          type="number"
          className="input__assignment__gen__page"
          placeholder="Number of Pages (1–15)"
          value={pages}
          onChange={(e) => setPages(Math.min(15, Math.max(1, Number(e.target.value))))}
          max={15}
          min={1}
        />

        <button
          className={`button__assignment__gen__page ${loading || (!isPremium && hasGenerated) ? 'disabled__assignment__gen__page' : ''}`}
          disabled={loading || (!isPremium && hasGenerated)}
          onClick={generateAssignment}
        >
          {loading ? "Generating..." : hasGenerated && !isPremium ? "Upgrade to Generate More" : "Generate"}
          <FaArrowRight style={{ marginLeft: '8px' }} />
        </button>

        <button
          className="button__assignment__gen__page outline__assignment__gen__page"
          onClick={() => navigate("/my-assignments")}
        >
          <FaStickyNote style={{ marginRight: '8px' }} />
          My Assignments
        </button>
      </div>
    </div>
  );
};

export default GenerateAssignment;
