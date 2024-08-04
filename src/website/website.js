import React, { Fragment, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Slide } from 'react-awesome-reveal';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ROUTES } from '../app_modules/apiRoutes';


const handleDownload = async () => {
  const response = await fetch(API_ROUTES.downloadAndroid, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/octet-stream',
    },
  });

  if (!response.ok) {
    console.error('Failed to download file');
    return;
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Edusify.apk'; // Replace with your file name
  document.body.appendChild(a);
  a.click();
  a.remove();
};



const checkTokenAndRedirect = async (token, navigate) => {
    try {
      const response = await axios.post(`${API_ROUTES.sessionCheck}`, { token });
  
      if (response.data.exists) {
        // Token is valid, redirect to /planner
        navigate('/planner');
      } else {
        console.error('No matching token found.');
      }
    } catch (error) {
      console.error('Error checking token:', error);
    }
  };


const DownloadPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token'); // Replace with actual token retrieval logic
      checkTokenAndRedirect(token, navigate);
    }, [navigate]);


  return (
    <Fragment>
      
    </Fragment>
  );
};

export default DownloadPage;