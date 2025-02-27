import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./assignment maker.css";
import FooterNav from "../app_modules/footernav";
import { API_ROUTES } from "../app_modules/apiRoutes";

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
    <div className="assignment_maker flex flex-col items-center justify-center min-h-screen p-6" style={{ marginBottom: "90px" }}>
      <div className="assignment_maker__container">
        <h2 className="assignment_maker__title">📄 Assignment Maker</h2>

        <div className="assignment_maker__form">
          <input type="text" className="assignment_maker__input" placeholder="Enter Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
          <textarea className="assignment_maker__textarea" placeholder="Additional Details" value={details} onChange={(e) => setDetails(e.target.value)} />
          <input
  type="number"
  className="assignment_maker__input"
  placeholder="Number of Pages"
  value={pages}
  onChange={(e) => {
    const value = Math.min(15, Math.max(1, Number(e.target.value))); // Ensure value stays between 1 and 15
    setPages(value);
  }}
  max={15}
  min={1} // Prevents values below 1
/>

          <button className="assignment_maker__button" onClick={generateAssignment} disabled={loading || (!isPremium && hasGenerated)}>
            {loading ? "Generating..." : hasGenerated && !isPremium ? "Upgrade to Generate More" : "Generate Assignment"}
          </button>
          <button style={{ marginTop: "10px" }} className="assignment_maker__button" onClick={() => navigate("/my-assignments")}>
            My Assignments
          </button>
        </div>
      </div>
      <FooterNav />
    </div>
  );
};

export default GenerateAssignment;
