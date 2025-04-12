// EdusifyArticle2.js
import React from 'react';
import { Helmet } from 'react-helmet';
import './EdusifyArticle2.css';

const EdusifyArticle2 = () => {
  return (
    <>
      <Helmet>
        <title>Edusify - Unlock Your Academic Potential with AI Study Tools</title>
        <meta 
          name="description" 
          content="Edusify provides advanced AI tools to help students excel in their studies. Experience personalized study plans, smart timers, and real-time progress tracking to optimize your study sessions and boost your academic performance." 
        />
        <meta 
          name="keywords" 
          content="Edusify, AI-powered study tools, study optimization, personalized study plans, Pomodoro, study productivity, academic excellence, AI study assistant, study tips"
        />
        <meta property="og:title" content="Edusify - Unlock Your Academic Potential with AI Study Tools" />
        <meta property="og:description" content="Unlock your academic potential with Edusify’s AI-powered study tools. Personalize your study plans, use the smart Pomodoro timer, and track your progress for greater academic success." />
        <meta property="og:image" content="https://example.com/edusify-og-image-2.jpg" />
        <meta property="og:url" content="https://example.com/edusify-article-2" />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="container__EdusifyArticle2">
        <header className="header__EdusifyArticle2">
          <h1>Unlock Your Academic Potential with Edusify</h1>
          <p>Edusify’s AI-powered tools will help you study smarter and achieve your academic goals faster.</p>
        </header>

        <section className="intro__EdusifyArticle2">
          <h2>Why Edusify is the Future of Studying</h2>
          <p>
            Edusify combines cutting-edge AI technology with proven study strategies to help you achieve your academic dreams.
            The app provides personalized study plans, a smart Pomodoro timer, and detailed progress tracking, ensuring that you stay on track and reach your goals efficiently.
          </p>
        </section>

        <section className="features__EdusifyArticle2">
          <h2>Key Features to Optimize Your Study Routine</h2>
          <ul>
            <li><strong>AI-Powered Study Plans</strong>: Tailored study schedules based on your goals and learning style.</li>
            <li><strong>Pomodoro Timer</strong>: Stay focused with an intelligent timer that adjusts to your energy levels.</li>
            <li><strong>Comprehensive Progress Tracking</strong>: Monitor your progress and improve based on detailed stats.</li>
            <li><strong>Shared Notes and Study Rooms</strong>: Collaborate with peers and access shared resources in real time.</li>
          </ul>
        </section>

        <section className="cta__EdusifyArticle2">
          <h2>Start Studying Smarter Today!</h2>
          <p>Get started with Edusify Premium and unlock the full potential of AI-driven study tools. Experience the future of studying today!</p>
          <button className="button__EdusifyArticle2">Start Now</button>
        </section>
      </div>
    </>
  );
};

export default EdusifyArticle2;
