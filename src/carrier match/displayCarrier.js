import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './displayCarrier.css';
import templateImg from './2.png';
import { API_ROUTES } from '../app_modules/apiRoutes';
import { FaArrowLeft, FaInstagram } from 'react-icons/fa';

const CareerResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [careerResult, setCareerResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const imageRef = useRef();

  useEffect(() => {
    const fetchCareerResult = async () => {
      try {
        const res = await fetch(`${API_ROUTES.displayAiCareerResult}/${id}`);
        const data = await res.json();
        if (!data.error) {
          setCareerResult(data);
        }
      } catch (err) {
        console.error('Error fetching career result:', err);
      } finally {
        setLoading(false);
      }
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

  const redirectToInstagram = async () => {
    await downloadImage();  // Download the image first
    // After download, open Instagram's mobile app or web story page
    const instagramUrl = 'https://www.instagram.com/create/story/';
    window.open(instagramUrl, '_blank');  // Open Instagram's story creation page
  };

  if (loading) return <div className="career-result__carreir__result__page">Loading...</div>;
  if (!careerResult) return <div className="career-result__carreir__result__page">No career result found.</div>;

  return (
    <>
      <div className="career-result__carreir__result__page">
        <div className="topbar__carreir__result__page">
          <button onClick={() => navigate(-2)} className="back-btn__carreir__result__page">
            <FaArrowLeft />
          </button>
        </div>

        <div className="career-card__carreir__result__page">
          <div className="career-header__carreir__result__page" style={{ backgroundColor: careerResult.background_image }}>
            <h1 className="career-title__carreir__result__page">{careerResult.career}</h1>
            <h2 className="catchy__carreir__result__page">{careerResult.catchy_title}</h2>
            <p className="reason__carreir__result__page">{careerResult.reason}</p>
            <p className="quote__carreir__result__page">“{careerResult.quote}”</p>

         

         <div className="share__carreir__result__page">
  <p className="hashtag__carreir__result__page">{careerResult.hashtag}</p>

  <button onClick={redirectToInstagram} className="instagram-story-btn__carreir__result__page">
    <FaInstagram style={{ marginRight: '8px' }} />
    Add to Story
  </button>

<p className="tagline__carreir__result__page">
  🌟 Your future deserves the spotlight. <strong>Share this on your story</strong> and <strong>tag @edusify.app</strong><br />
  🎁 We’ll reward a few students with <strong>15 days of Premium access</strong> — just for being you.
</p>

</div>

          </div>
        </div>
      </div>

      {/* Hidden HTML2Canvas image */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={imageRef}
          style={{
            width: '1500px',
            height: '1500px',
            backgroundImage: `url(${templateImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 50px',
            textAlign: 'center',
            fontFamily: "'Agrandir', sans-serif",
          }}
        >
          <h1 style={{
            fontSize: careerResult.career.length > 20 ? '80px' : '120px',
            lineHeight: careerResult.career.length > 20 ? '90px' : '130px',
            marginTop: careerResult.career.length > 20 ? '0px' : '200px',
            fontWeight: '700',
            width: '70%',
          }}>
            {careerResult.career}
          </h1>

          <p style={{
            fontSize: careerResult.career.length > 20 ? '36px' : '55px',
            lineHeight: careerResult.career.length > 20 ? '44px' : '62px',
            fontStyle: 'italic',
            marginTop: careerResult.career.length > 20 ? '80px' : '100px',
            fontWeight: '700',
            width: '70%',
          }}>
            “{careerResult.quote}”
          </p>

          <p style={{ fontSize: '25px', marginTop: '50px', fontWeight: '400' }}>
            {careerResult.hashtag}
          </p>
        </div>
      </div>
    </>
  );
};

export default CareerResult;
