import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter, faTelegram, faChrome, faGoogle } from '@fortawesome/free-brands-svg-icons';
import './helpMain.css';
import InviteFriends from './InviteFriends';
import FeedbackForm from './FeedbackForm';
import MadeWithLove from '../app_modules/madeWithLove';

const HelpMain = () => {
  const [showMenu, setShowMenu] = useState(false);

  const navigate = useNavigate(); // Hook to navigate
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      {/* Sticky Header Navigation */}
      <header className="sticky__nav__helpp__page__new__desgin">
  <h1 className="logo__helpp__page__new__desgin">Edusify Help</h1>
  <nav className={`nav__helpp__page__new__desgin ${showMenu ? 'open' : ''}`}>
    <a href="#welcome">Welcome</a>
    <a href="#howtouse">How to Use</a>
    <a href="#premium">Premium</a>
    <a href="#faq">FAQs</a>
    <a href="#feedback">Feedback</a>
  </nav>
  <button className="burger__helpp__page__new__desgin" onClick={() => setShowMenu(!showMenu)}>
    ☰
  </button>
</header>



      <div className="container__helpp__page__new__desgin">
        {/* Sections will go here */}
        <section id="welcome" className="welcome__helpp__page__new__desgin">
  <h2>Welcome to Edusify ✨</h2>
  <p>Your all-in-one premium study companion — built for those who want to win at studying, not just survive it.</p>
</section>
<section className="feature__usage__helpp__page__new__desgin" id="guide">
  <h2>How to Use Each Feature</h2>

  {/* Study Plan */}
  <div id="howtouse" className="feature__card__helpp__page__new__desgin">
    <h3>📅 AI Study Plan</h3>
    <p>
      We generate a personalized study plan tailored to your subjects, goals, and availability.
      View it at the top of your Dashboard by tapping <strong>“View Today’s Plan”</strong>.
      It shows your sessions, subject-wise time breakdown, and total focus duration.
      Use the Pomodoro Timer to complete your session and update your progress.
      You’ll also find three powerful actions:
    </p>
    <ul>
      <li><strong>🎯 Get New Plan (AI):</strong> Instantly generate a new AI-powered plan.</li>
      <li><strong>🛠️ Build Manually:</strong> Create your plan from scratch, your way.</li>
      <li><strong>🧠 Generate Tasks:</strong> Auto-generate tasks based on today’s plan.</li>
    </ul>
  </div>

  {/* Sticky Notes */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>📝 Sticky Notes</h3>
    <p>
      Add colorful, customizable sticky notes right on your Dashboard. Perfect for reminders,
      ideas, or micro-tasks. Add a title, description, and pick a color that fits your mood.
    </p>
  </div>

  {/* AI Chat Assistant */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>💬 AI Assistant</h3>
    <p>
      Ask anything, from math problems to essay help. Your AI tutor is always ready. Use the
      <strong>“Click Here”</strong> button below the response to:
    </p>
    <ul>
      <li>📓 Convert the answer into notes</li>
      <li>🧠 Turn it into flashcards</li>
      <li>🗺️ Make a mind map</li>
      <li>❓ Create a quiz</li>
      <li>📝 Add related tasks</li>
    </ul>
    <p>To clear your chat history, tap the ⚙️ icon on the top-right and select “Clear All.”</p>
  </div>

  {/* AI Image Generator */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🎨 Image Generator (Beta)</h3>
    <p>
      Type your idea and get a stunning AI-generated image. It’s in beta, so expect magic with a pinch of experimentation.
    </p>
  </div>

  {/* AI Notes */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🧾 AI Notes</h3>
    <p>
      Create short, focused summary notes on any topic with AI. Once generated, you can expand
      them into flashcards, quizzes, and mind maps directly from the notes.
    </p>
  </div>

  {/* AI Quiz */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🧪 AI Quiz</h3>
    <p>
      Enter your subject and topic to generate instant quizzes. After attempting, get an AI-powered
      analysis showing your strengths, weaknesses, and improvement tips.
    </p>
  </div>

  {/* AI Mind Maps */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🗺️ AI Mind Maps</h3>
    <p>
      Visualize your topics. Just enter subject and topic, and optionally add instructions.
      AI will generate a structured, beautiful mind map for quick understanding.
    </p>
  </div>

  {/* Assignment Maker */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>📚 Assignment Maker</h3>
    <p>
      Beat deadlines with a complete AI-generated assignment (up to 15 pages) in under 5 seconds.
      With images, pick a subject, and download the final PDF ready to submit.
    </p>
  </div>

  {/* Exam Mode */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🎓 Exam Mode</h3>
    <p>
      This is your ultimate revision toolkit. Enter a topic, and the AI instantly provides:
    </p>
    <ul>
      <li>📝 Key Notes</li>
      <li>📌 Definitions & Formulas</li>
      <li>🧾 Last-Minute Revision Sheets</li>
      <li>❓ Practice Questions</li>
      <li>🧠 Quiz on that topic</li>
    </ul>
  </div>

  {/* Lecture Summarizer */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🎙️ Lecture AI</h3>
    <p>
      Record any lecture — school, online, or tuition — and let Edusify instantly turn it into
      summarized, structured notes so you never miss a thing.
    </p>
  </div>

  {/* To-Do List */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>✅ To-Do List</h3>
    <p>
      Add, edit, or delete tasks with a title, description, and due date. The AI can auto-generate
      tasks based on your study plan. Track what matters.
    </p>
  </div>

  {/* Flashcards */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>🧠 Flashcards</h3>
    <p>
      Learn and revise faster with flashcards. Make your own or convert notes into card format.
      Tap through and boost memory retention through active recall.
    </p>
  </div>

  {/* Mock Tests */}
  <div className="feature__card__helpp__page__new__desgin">
    <h3>📖 Mock Tests</h3>
    <p>
      Generate full-length 50-question competitive exam mock tests. Includes a built-in timer
      to simulate the real test experience and sharpen your exam-taking skills.
    </p>
  </div>
</section>

      </div>
      <section id="premium" className="premium__helpp__page__new__desgin">
  <h2 className="premium__title__helpp__page__new__desgin">Why Edusify is Premium Only</h2>
  <p className="premium__desc__helpp__page__new__desgin">
    Edusify isn’t just another study app. It’s your AI-powered academic partner built for ambitious students who want to study smarter, faster, and better.
  </p>

  <div className="premium__cards__helpp__page__new__desgin">
    <div className="premium__card__helpp__page__new__desgin">
      <h3>Unlimited AI Tools</h3>
      <p>From notes to quizzes, mind maps to assignments — everything powered by AI, with no limits.</p>
    </div>

    <div className="premium__card__helpp__page__new__desgin">
      <h3>Personalized Study Plans</h3>
      <p>AI-generated weekly study plans based on your subjects, time, and goals — always one step ahead.</p>
    </div>

    <div className="premium__card__helpp__page__new__desgin">
      <h3>No Distractions</h3>
      <p>100% ad-free experience so you can stay focused on what truly matters — your studies.</p>
    </div>

    <div className="premium__card__helpp__page__new__desgin">
      <h3>Lecture Summarizer</h3>
      <p>Just record — and get summarized class notes instantly. Study the lecture without replaying it.</p>
    </div>

    <div className="premium__card__helpp__page__new__desgin">
      <h3>Priority Access</h3>
      <p>Be the first to access new features and get VIP support directly from the Edusify team.</p>
    </div>
  </div>

  <p className="premium__footer__helpp__page__new__desgin">
    Edusify is built for serious learners. That's why it's 100% premium — no distractions, no limits, no compromises.
  </p>
</section>
<section id="faq" className="faq__helpp__page__new__desgin">
  <h2 className="faq__title__helpp__page__new__desgin">FAQs – You Asked, We Answered</h2>
  
  <div className="faq__list__helpp__page__new__desgin">
    <details className="faq__item__helpp__page__new__desgin">
      <summary>Is Edusify completely paid?</summary>
      <p>Yes. We believe serious students deserve serious tools. Edusify is 100% premium, with no free version, no ads, and no compromises.</p>
    </details>

    <details className="faq__item__helpp__page__new__desgin">
      <summary>Do I get all AI tools after subscribing?</summary>
      <p>Absolutely. One subscription unlocks everything: AI notes, quizzes, flashcards, lecture summarizer, mind maps, and more.</p>
    </details>

    <details className="faq__item__helpp__page__new__desgin">
      <summary>Is it safe to upload PDFs and record lectures?</summary>
      <p>Yes. Your data is encrypted and stored securely. You can delete anything anytime.</p>
    </details>

    <details className="faq__item__helpp__page__new__desgin">
      <summary>Can I cancel anytime?</summary>
      <p>Yes, you’re in control. You can cancel your subscription anytime — no lock-ins or hidden terms.</p>
    </details>

    <details className="faq__item__helpp__page__new__desgin">
      <summary>Will I lose my data if I unsubscribe?</summary>
      <p>No. Your data is safely stored. You can re-subscribe anytime and continue from where you left off.</p>
    </details>
  </div>
</section>
<footer id='feedback' className="footer__helpp__page__new__desgin">
  <div className="footer__content__helpp__page__new__desgin">
    <h2 className="footer__title__helpp__page__new__desgin">Got Feedback?</h2>
    <p className="footer__subtitle__helpp__page__new__desgin">We’re building Edusify for you. Share your thoughts below!</p>
    <FeedbackForm />
  </div>

  <div className="footer__bottom__helpp__page__new__desgin">
    <MadeWithLove />
  </div>
</footer>
    </>
  );
};

export default HelpMain;
