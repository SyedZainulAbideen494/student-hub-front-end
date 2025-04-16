// src/pages/Loading.js
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
    return (
      <StyledWrapper__loader__home>
        <div className="card__loader__home">
          <div className="loader__loader__home">
            <p>loading</p>
            <div className="words__loader__home">
              <span className="word__loader__home">buttons</span>
              <span className="word__loader__home">forms</span>
              <span className="word__loader__home">switches</span>
              <span className="word__loader__home">cards</span>
              <span className="word__loader__home">buttons</span>
            </div>
          </div>
        </div>
      </StyledWrapper__loader__home>
    );
  };
  
  const StyledWrapper__loader__home = styled.div`
    .card__loader__home {
      --bg-color: #212121;
      background-color: var(--bg-color);
      padding: 1rem 2rem;
      border-radius: 1.25rem;
    }
  
    .loader__loader__home {
      color: rgb(124, 124, 124);
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      font-size: 25px;
      box-sizing: content-box;
      height: 40px;
      padding: 10px 10px;
      display: flex;
      border-radius: 8px;
    }
  
    .words__loader__home {
      overflow: hidden;
      position: relative;
    }
  
    .words__loader__home::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        var(--bg-color) 10%,
        transparent 30%,
        transparent 70%,
        var(--bg-color) 90%
      );
      z-index: 20;
    }
  
    .word__loader__home {
      display: block;
      height: 100%;
      padding-left: 6px;
      color: #956afa;
      animation: spin_4991__loader__home 4s infinite;
    }
  
    @keyframes spin_4991__loader__home {
      10% {
        transform: translateY(-102%);
      }
  
      25% {
        transform: translateY(-100%);
      }
  
      35% {
        transform: translateY(-202%);
      }
  
      50% {
        transform: translateY(-200%);
      }
  
      60% {
        transform: translateY(-302%);
      }
  
      75% {
        transform: translateY(-300%);
      }
  
      85% {
        transform: translateY(-402%);
      }
  
      100% {
        transform: translateY(-400%);
      }
    }
  `;
  


const LoadingHome = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#121212' }}>
      <div style={{ color: '#ffffff', fontSize: '2rem' }}>
        <Loader/>
      </div>
    </div>
  );
};

export default LoadingHome;
