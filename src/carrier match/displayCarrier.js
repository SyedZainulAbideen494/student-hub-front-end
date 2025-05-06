import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './displayCarrier.css';
import templateImg from './2.png'; // Make sure this path is correct

const CareerResult = () => {
  const { id } = useParams();
  const [careerResult, setCareerResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef();

  useEffect(() => {
    const fetchCareerResult = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/career-ai/result/${id}`);
        const data = await res.json();
        if (data.error) {
          console.error('Error:', data.error);
        } else {
          setCareerResult(data);
        }
      } catch (err) {
        console.error('Error fetching career result:', err);
      }
      setLoading(false);
    };

    fetchCareerResult();
  }, [id]);

  const downloadImage = async () => {
    const canvas = await html2canvas(imageRef.current);
    const link = document.createElement('a');
    link.download = `${careerResult.career.replace(/\s+/g, '_')}_Result.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (loading) return <div>Loading...</div>;
  if (!careerResult) return <div>No career result found.</div>;

  return (
    <>
      <div className="career-result__carreir__result__page">
        <div className="career-card__carreir__result__page">
          <div
            className="career-header__carreir__result__page"
            style={{ backgroundColor: careerResult.background_image }}
          >
            <div className="emoji__carreir__result__page">{careerResult.emoji}</div>
            <h1 className="career-title__carreir__result__page">{careerResult.career}</h1>
            <h2 className="catchy__carreir__result__page">{careerResult.catchy_title}</h2>
            <p className="reason__carreir__result__page">{careerResult.reason}</p>
            <p className="quote__carreir__result__page">“{careerResult.quote}”</p>

            <div className="match__carreir__result__page">
              <span>{careerResult.match_percentage}% Match</span>
              <div className="progress-bar__carreir__result__page">
                <div
                  className="progress__carreir__result__page"
                  style={{ width: `${careerResult.match_percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="share__carreir__result__page">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${careerResult.career}: ${careerResult.hashtag}`);
                  alert('Copied to clipboard!');
                }}
              >
                📋 Copy & Share
              </button>
              <p className="hashtag__carreir__result__page">{careerResult.hashtag}</p>
              <button onClick={downloadImage}>📥 Download Image</button>
            </div>
          </div>
        </div>
      </div>

      <div
  ref={imageRef}
  style={{
    width: '1500px',
    height: '1500px',
    backgroundImage: `url(${templateImg})`,
    backgroundSize: 'cover',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px 50px',
    textAlign: 'center',
    fontFamily: "'Agrandir', sans-serif", // Font update
  }}
>
  <h1
    style={{
      fontSize: '120px', // Relative font size based on the viewport width
      marginTop: '200px',
      marginRight: '10px',
      fontWeight: '700',
    }}
  >
    {careerResult.career}
  </h1>

  <p
    style={{
      fontSize: '55px', // Smaller font size for quote
      fontStyle: 'italic',
      marginTop: '100px',
      fontWeight: '700',
      width: '70%'
    }}
  >
    “{careerResult.quote}”
  </p>

  <p
    style={{
      fontSize: '25px', // Even smaller for hashtags
      marginTop: 'auto',
      marginTop: '50px',
      fontWeight: '400',
    }}
  >
    {careerResult.hashtag}
  </p>
</div>

    </>
  );
};

export default CareerResult;
