import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const StoryCard = ({ name, hours, percentile, badge, profilePic }) => {
  const cardRef = useRef();

  const downloadImage = async () => {
    const canvas = await html2canvas(cardRef.current);
    const link = document.createElement('a');
    link.download = 'edusify_card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        ref={cardRef}
        style={{
          width: 400,
          height: 700,
          borderRadius: 30,
          background: 'linear-gradient(145deg, #0e0e14, #1c1c2e)',
          padding: '40px 30px',
          color: 'white',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #7a5cfa',
            boxShadow: '0 0 12px #7a5cfa',
            marginBottom: 20,
          }}
        >
          <img
            src={profilePic}
            alt="profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Name */}
        <h2 style={{ margin: 0 }}>{name}</h2>

        {/* Study Stats */}
        <p style={{ marginTop: 40, fontSize: 24 }}>
          You studied <strong>{hours}</strong> hours today.
        </p>
        <p style={{ color: '#aaa' }}>You’re ahead of {percentile}% students</p>

        {/* Badge */}
        <div
          style={{
            marginTop: 60,
            padding: '18px 30px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #7f5aff, #a17ff5)',
            boxShadow: '0 0 20px rgba(128, 90, 255, 0.5)',
          }}
        >
          <h3 style={{ margin: 0 }}>{badge}</h3>
        </div>

        {/* Logo */}
        <div style={{ position: 'absolute', bottom: 30, width: '100%' }}>
          <h4 style={{ color: '#666', letterSpacing: '3px' }}>EDUSIFY</h4>
        </div>
      </div>

      <button
        onClick={downloadImage}
        style={{
          marginTop: 20,
          padding: '10px 20px',
          borderRadius: 10,
          border: 'none',
          background: '#7a5cfa',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Download Card
      </button>
    </div>
  );
};

export default StoryCard;
