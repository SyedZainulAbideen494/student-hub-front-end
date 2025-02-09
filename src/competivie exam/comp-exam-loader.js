import React from 'react';
import styled from 'styled-components'; // Import styled-components

const LoaderComponentExamMock = () => {
  return (
    <StyledWrapper>
      <div className="loader__Loader__mock__Exam">
        <div className="load-inner__Loader__mock__Exam load-one__Loader__mock__Exam" />
        <div className="load-inner__Loader__mock__Exam load-two__Loader__mock__Exam" />
        <div className="load-inner__Loader__mock__Exam load-three__Loader__mock__Exam" />
        <span className="text__Loader__mock__Exam">Generating</span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .loader__Loader__mock__Exam {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    perspective: 780px;
  }

  .text__Loader__mock__Exam {
    font-size: 18px;
    font-weight: 700;
    color: #cecece;
    z-index: 10;
    margin-top: 10px;
  }

  .load-inner__Loader__mock__Exam {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 50%;
  }

  .load-one__Loader__mock__Exam {
    left: 0%;
    top: 0%;
    border-bottom: 3px solid #5c5edc;
    animation: rotate1__Loader__mock__Exam 1.15s linear infinite;
  }

  .load-two__Loader__mock__Exam {
    right: 0%;
    top: 0%;
    border-right: 3px solid #9147ff;
    animation: rotate2__Loader__mock__Exam 1.15s 0.1s linear infinite;
  }

  .load-three__Loader__mock__Exam {
    right: 0%;
    bottom: 0%;
    border-top: 3px solid #3b82f6;
    animation: rotate3__Loader__mock__Exam 1.15s 0.15s linear infinite;
  }

  @keyframes rotate1__Loader__mock__Exam {
    0% {
      transform: rotateX(45deg) rotateY(-45deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(45deg) rotateY(-45deg) rotateZ(360deg);
    }
  }

  @keyframes rotate2__Loader__mock__Exam {
    0% {
      transform: rotateX(45deg) rotateY(45deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(45deg) rotateY(45deg) rotateZ(360deg);
    }
  }

  @keyframes rotate3__Loader__mock__Exam {
    0% {
      transform: rotateX(-60deg) rotateY(0deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(-60deg) rotateY(0deg) rotateZ(360deg);
    }
  }
`;

export default LoaderComponentExamMock;
