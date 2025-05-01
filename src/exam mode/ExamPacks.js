import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaArrowLeft, FaBookOpen } from 'react-icons/fa';
import './ExamPacks.css';

const ExamPacks = () => {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(API_ROUTES.fetchExamPacks, { token });
        setPacks(res.data.packs);
      } catch (err) {
        console.error(err);
        setError('Failed to load your exam packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  return (
    <div className="examPacksContainer">
      <div className="examPacksHeader">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2><FaBookOpen style={{ marginRight: 8 }} /> Your Exam Mode Packs</h2>
      </div>

      {loading && <p className="statusText">Loading your exam packs...</p>}
      {error && <p className="statusText errorText">{error}</p>}

      {!loading && !error && (
        <>
          {packs.length === 0 ? (
            <p className="statusText">No packs created yet. Try creating one in Exam Mode!</p>
          ) : (
            <ul className="packList">
              {packs.map((pack) => (
                <li key={pack.id} className="packItem">
                  <Link to={`/exam-mode/${pack.id}`} className="packLink">
                    <div className="packInfo">
                      <strong>{pack.subject}</strong> — {pack.topic}
                      <small>{new Date(pack.created_at).toLocaleString()}</small>
                    </div>
                    <span className="viewBtn">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ExamPacks;
