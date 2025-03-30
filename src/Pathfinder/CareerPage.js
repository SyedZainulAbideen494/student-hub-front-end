import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CareerPage = () => {
  const { id } = useParams();
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/pathfinder/${id}`);
        const data = await response.json();

        // Ensure all JSON fields are properly parsed in case the backend sends them as strings
        data.alternatives = typeof data.alternatives === "string" ? JSON.parse(data.alternatives) : data.alternatives;
        data.improvement_plan = typeof data.improvement_plan === "string" ? JSON.parse(data.improvement_plan) : data.improvement_plan;
        data.exams_colleges = typeof data.exams_colleges === "string" ? JSON.parse(data.exams_colleges) : data.exams_colleges;

        setCareerData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching career data:", error);
        setLoading(false);
      }
    };

    fetchCareerData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!careerData) return <p>Error: No career data found</p>;

  return (
    <div>
      <h1>Career Analysis</h1>
      <h2>{careerData.top_career} (Success Rate: {careerData.success_rate}%)</h2>
      <p>{careerData.details}</p>

      <h3>Alternative Paths</h3>
      <ul>
        {careerData.alternatives.map((alt, index) => (
          <li key={index}>
            {alt.field} - {alt.success_rate}% success rate
            <p>{alt.details}</p>
          </li>
        ))}
      </ul>

      <h3>Improvement Plan</h3>
      <ul>
        {careerData.improvement_plan.map((improve, index) => (
          <li key={index}>{improve.advice}</li>
        ))}
      </ul>

      <h3>Relevant Exams & Colleges</h3>
      <ul>
        {careerData.exams_colleges.map((exam, index) => (
          <li key={index}>
            {exam.exam}: {exam.colleges.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareerPage;
