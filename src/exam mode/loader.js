import React from 'react';
import styled from 'styled-components';
import './loader.css'
const LoaderExamMode = () => {
  return (
    <StyledWrapper>
      <div className="loader__loader__exam__mode">
        <div className="container__loader__exam__mode">
          <div className="coffee-header__loader__exam__mode">
            <div className="coffee-header__buttons__loader__exam__mode" />
            <div className="coffee-header__display__loader__exam__mode" />
            <div className="coffee-header__details__loader__exam__mode" />
          </div>
          <div className="coffee-medium__loader__exam__mode">
            <div className="coffe-medium__exit__loader__exam__mode" />
            <div className="coffee-medium__arm__loader__exam__mode" />
            <div className="coffee-medium__liquid__loader__exam__mode" />
            <div className="smoke__loader__exam__mode one__loader__exam__mode" />
            <div className="smoke__loader__exam__mode two__loader__exam__mode" />
            <div className="smoke__loader__exam__mode three__loader__exam__mode" />
            <div className="smoke__loader__exam__mode four__loader__exam__mode" />
            <div className="coffee-medium__cup__loader__exam__mode" />
          </div>
        </div>
        <p className="loader-text__loader__exam__mode" >
          It might take some time ☕ <br />
          So feel free to grab yourself a coffee
        </p>
      </div>
    </StyledWrapper>

  );
};

const StyledWrapper = styled.div`
  /* Replace all CSS selectors below to match the renamed class names */
  .loader__loader__exam__mode {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    scale: 0.8;
  }

  .container__loader__exam__mode {
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .coffee-header__loader__exam__mode {
    padding: 10px;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ddcfcc;
    border-radius: 10px;
  }

  .coffee-header__buttons__loader__exam__mode {
    width: 25px;
    height: 25px;
    background-color: #282323;
    border-radius: 50%;
    box-shadow: 40px 0 0 0 #282323;
  }

  .coffee-header__buttons__loader__exam__mode::before {
    content: "";
    width: 8px;
    height: 8px;
    display: block;
    transform: translate(100%, 25px);
    background-color: #615e5e;
    box-shadow: 40px 0 0 0 #615e5e;
  }

  .coffee-header__display__loader__exam__mode {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #9acfc5;
    border: 5px solid #43beae;
  }

  .coffee-header__details__loader__exam__mode {
    width: 8px;
    height: 20px;
    margin-left: 16px;
    background-color: #9b9091;
    box-shadow: -12px 0 0 #9b9091, -24px 0 0 #9b9091;
  }

  .coffee-medium__loader__exam__mode {
    width: 90%;
    height: 160px;
    position: relative;
    background-color: #bcb0af;
  }

  .coffee-medium__loader__exam__mode::before {
    content: "";
    width: 90%;
    height: 100px;
    background-color: #776f6e;
    position: absolute;
    bottom: 0;
    left: 5%;
    border-radius: 20px 20px 0 0;
  }

  .coffe-medium__exit__loader__exam__mode {
    width: 60px;
    height: 20px;
    position: absolute;
    top: 0;
    left: calc(50% - 30px);
    background-color: #231f20;
  }

  .coffe-medium__exit__loader__exam__mode::before {
    content: "";
    width: 50px;
    height: 20px;
    border-radius: 0 0 50% 50%;
    position: absolute;
    bottom: -20px;
    left: calc(50% - 25px);
    background-color: #231f20;
  }

  .coffe-medium__exit__loader__exam__mode::after {
    content: "";
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: -30px;
    left: calc(50% - 5px);
    background-color: #231f20;
  }

  .coffee-medium__arm__loader__exam__mode {
    width: 70px;
    height: 20px;
    position: absolute;
    top: 15px;
    right: 25px;
    background-color: #231f20;
  }

  .coffee-medium__arm__loader__exam__mode::before {
    content: "";
    width: 15px;
    height: 5px;
    position: absolute;
    top: 7px;
    left: -15px;
    background-color: #9e9495;
  }

  .coffee-medium__cup__loader__exam__mode {
    width: 80px;
    height: 47px;
    position: absolute;
    bottom: 0;
    left: calc(50% - 40px);
    background-color: #fff;
    border-radius: 0 0 70px 70px/0 0 110px 110px;
  }

  .coffee-medium__cup__loader__exam__mode::after {
    content: "";
    width: 20px;
    height: 20px;
    position: absolute;
    top: 6px;
    right: -13px;
    border: 5px solid #fff;
    border-radius: 50%;
  }

  .coffee-medium__liquid__loader__exam__mode {
    width: 6px;
    height: 63px;
    position: absolute;
    top: 50px;
    left: calc(50% - 3px);
    background-color: transparent;
    overflow: hidden;
  }

  .coffee-medium__liquid__loader__exam__mode::before {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background-color: #74372b;
    transform: translateY(-100%);
    animation: liquid__loader__exam__mode 5s linear 3.5s infinite both;
  }

  .smoke__loader__exam__mode {
    opacity: 0;
    width: 8px;
    height: 20px;
    position: absolute;
    border-radius: 5px;
    background-color: #b3aeae;
  }

  .one__loader__exam__mode {
    bottom: 30px;
    left: 102px;
    animation: smoke__loader__exam__mode 3s 5s linear infinite;
  }

  .two__loader__exam__mode {
    bottom: 40px;
    left: 118px;
    animation: smoke__loader__exam__mode 3s 4s linear infinite;
  }

  .three__loader__exam__mode {
    bottom: 40px;
    right: 118px;
    animation: smoke__loader__exam__mode 3s 7s linear infinite;
  }

  .four__loader__exam__mode {
    bottom: 30px;
    right: 102px;
    animation: smoke__loader__exam__mode 3s 6s linear infinite;
  }

  .container__loader__exam__mode::after {
    content: "";
    width: 95%;
    height: 15px;
    background-color: #41bdad;
    box-shadow: 0 15px 0 5px #000;
    border-radius: 10px;
  }

  @keyframes smoke__loader__exam__mode {
    0% { transform: translateY(0px); opacity: 0; }
    40% { opacity: 0.5; }
    50% { transform: translateY(-10px); opacity: 0.3; }
    80% { opacity: 0.5; }
    100% { transform: translateY(-30px); opacity: 0; }
  }

  @keyframes liquid__loader__exam__mode {
    10% { transform: translateY(0); }
    90% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }
`;

export default LoaderExamMode;
