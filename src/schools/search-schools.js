import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchSchool = () => {
  const [location, setLocation] = useState(null);
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchNearbySchools(latitude, longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert(
              "Location access denied! Please enable location services in your browser settings."
            );
          }
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchNearbySchools = async (lat, lng) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/nearbySchools?lat=${lat}&lng=${lng}&radius=15`
      );
      setSchools(response.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const searchSchools = async () => {
    if (!search) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/searchSchool?query=${search}`
      );
      setSchools(response.data);
    } catch (error) {
      console.error("Error searching schools:", error);
    }
  };

  return (
    <div>
      <h1>Find Your School</h1>
      <button onClick={getLocation}>Get My Location</button>

      <input
        type="text"
        placeholder="Search by school name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchSchools}>Search</button>

      <ul>
        {schools.map((school, index) => (
          <li key={index}>
            {school.name} -{" "}
            {school.studentCount ? `${school.studentCount} students on Edusify` : "No students yet"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSchool;
