import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns"; // For relative time formatting
import "./ActivityPage.css";
import { API_ROUTES } from "../../app_modules/apiRoutes";

const ActivityPageRooms = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState("today");
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams(); // Get roomId from the URL

  useEffect(() => {
    // Fetch activity data from the backend
    const fetchActivities = async () => {
      try {
        const response = await axios.post(API_ROUTES.fetchRoomActivity, {
          roomId,
          filter,
        });
        setActivities(response.data.activities);
      } catch (error) {
        console.error("Error fetching activity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [roomId, filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return <p>Loading activities...</p>;
  }

  return (
    <div className="rooms__activity__page__container">
      <div className="rooms__activity__page__header">
        <button onClick={() => window.history.back()} className="rooms__activity__page__back-btn">
          <i className="fa fa-arrow-left"></i>
        </button>
        <h2 className="rooms__activity__page__title">Activity</h2>
      </div>

      <div className="rooms__activity__page__filters">
        <button
          className={`rooms__activity__page__filter-btn ${filter === "today" ? "active" : ""}`}
          onClick={() => handleFilterChange("today")}
        >
          Today
        </button>
        <button
          className={`rooms__activity__page__filter-btn ${filter === "week" ? "active" : ""}`}
          onClick={() => handleFilterChange("week")}
        >
          Week
        </button>
        <button
          className={`rooms__activity__page__filter-btn ${filter === "lifetime" ? "active" : ""}`}
          onClick={() => handleFilterChange("lifetime")}
        >
          Lifetime
        </button>
      </div>

      <div className="rooms__activity__page__list">
        {activities.map((activity, index) => {
          const relativeTime = formatDistanceToNow(parseISO(activity.time), { addSuffix: true }); // Format relative time
          return (
            <div key={index} className="rooms__activity__page__activity-card">
              <p className="rooms__activity__page__activity-description">
                {activity.description}
              </p>
              <p className="rooms__activity__page__activity-time">{relativeTime}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityPageRooms;
