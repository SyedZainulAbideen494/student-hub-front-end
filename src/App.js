import { Fragment, useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
  useNavigate,
} from "react-router-dom";
import { useLocation } from "react-router-dom";

import "./index.css";
import "./App.css";
import axios from "axios";
import Login from "./auth/login";
import SignUp from "./auth/signup";
import Dashbaord from "./dashbaord/dashboard";
import FlashcardsPage from "./flashCards/flashCards";
import NoteDetailPage from "./flashCards/noteDetails";
import GroupsPage from "./group/group";
import GroupChat from "./group/groupChat";
import GroupDetails from "./group/GroupDetails";
import QuizHomePage from "./quiz/QuizHomePage";
import CreateQuizPage from "./quiz/CreateQuizPage";
import QuizPage from "./quiz/QuizPage";
import SubmitPage from "./quiz/submitPage";
import CalendarPage from "./calander/calander";
import Pomodoro from "./Pomodoro/pomodoro";
import Website from "./website/website";
import Callback from "./music/SpotifyRedirect";
import Welcome from "./welcome/welcomePage";
import NotificationComponent from "./notifications/NotificationComponent";
import NotiPage from "./notifications/notiPage";
import SocialFeed from "./soical feed/socialfeed";
import ProfilePage from "./profile/ProfilePage";
import GroupDetailsPage from "./group/GroupDetails";
import CommentsPage from "./soical feed/commentsPage";
import UsersProfile from "./user profile/userProfile";
import MathSolver from "./math/mathPage";
import ScienceHelper from "./science helper/scienceHelper";
import SearchPage from "./search/searchPage";
import MathPage from "./math/mathPage";
import DownloadPage from "./website/website";
import SettingsPage from "./profile/settings-profile";
import CommerceHelper from "./commerce helper/CommerceHelper";
import NotFoundPage from "./app_modules/404Page";
import ForgotPassword from "./auth/forgot-password";
import ResetPassword from "./auth/ResetPassword";
import SubscriptionPage from "./premium/SubscriptionPage";
import SuccessPage from "./premium/SuccessPage";
import HelpMain from "./help/helpMain";
import AboutAppPage from "./help/AboutAppPage";
import HomeMain from "./home/homeMain";
import ViewFlashCard from "./flashCards/viewFlashcard";
import CreateFlashcard from "./flashCards/createFlashcard";
import QuizGuidePage from "./quiz/quizGuidePage";
import Leaderboard from "./streaks/leaderBoard";
import FlashcardLibraryPage from "./Flashcard/FlashcardLibraryPage";
import FlashcardSetPage from "./Flashcard/FlashcardSetPage";
import CreateFlashcardSet from "./Flashcard/CreateFlashcardSet";
import FlashcardViewPage from "./Flashcard/FlashcardViewPage";
import TermsAndConditions from "./docs/TermsAndConditions";
import PrivacyPolicy from "./docs/PrivacyPolicy";
import MoreInfo from "./docs/MoreInfo";
import IOSInstructions from "./docs/iosInstructionsPage";
import Subjects from "./flashCards/subjects/subjectPage";
import Calculator from "./toolkit/Calculator";
import GpaCalculator from "./toolkit/GpaCalculator";
import UnitConverter from "./toolkit/UnitConverter";
import ToolkitPage from "./toolkit/toolkitMainpage";
import EmailSender from "./Email sender/EmailSender";
import ReportCardMaker from "./toolkit/ReportCardMaker";
import DownloadPageAndorid from "./docs/andriodDownload";
import ChatHistoryPage from "./math/chatHistory";
import EmailFetcher from "./Email sender/emailFetcher";
import GenerateQuiz from "./quiz/GenerateQuiz";
import DocumentLockerPage from "./documnet locker/DocumentLockerPage";
import DocumentViewPage from "./documnet locker/ViewDocument";
import FolderPage from "./documnet locker/FolderPage";
import QuizAnswersPage from "./quiz/quizAnswers";
import WhatsNew from "./what's New/whatsnew";
import AdminPage from "./what's New/AdminPage";
import MonthlyStats from "./weekly stats/MonthlyStats";
import Streaks from "./Steak/streak";
import PomodoroApp from "./Pomodoro/pomodoro2.0/PomodoroApp";
import SessionStatsPage from "./Pomodoro/pomodoro2.0/SessionStatsPage";
import SettingsPagePomodoro from "./Pomodoro/pomodoro2.0/SettingsPage";
import PdfNotesConvertor from "./toolkit/pdfNotesconvertor";
import StoryGame from "./Games/story";
import UserReport from "./user report/user-report";
import ReportDisplayPage from "./user report/ReportDisplayPage";
import PreviousReports from "./user report/previousReports";
import AchievementPage from "./Achivements/AchievementPage";
import ScientificCalculator from "./toolkit/ScientificCalculator";
import MainPageRooms from "./Rooms/MainPage";
import JoinRoom from "./Rooms/JoinRoom";
import RoomMainPageJoined from "./Rooms/Joined rooms/RoomMainJoined";
import ActivityPageRooms from "./Rooms/Joined rooms/activity";
import ResourcesPage from "./Rooms/Joined rooms/ResourcesPage";
import RoomLeaderboard from "./Rooms/Joined rooms/RoomLeaderboard";
import GuideToEdusify from "./Pop ups/GuideToEdusify";
import SendNotiApp from "./Send noti/notiSend";
import InstaStory from "./Share Stats/Share-stats";
import PostsRooms from "./Rooms/Joined rooms/roomPosts";
import RoomProgress from "./Rooms/Joined rooms/Progress";
import RoomTasks from "./Rooms/Joined rooms/RoomTasks";

import WordScrambleGame from "./Games/wordScramble";
import PlayGame from "./Games/PlayGame";
import SwipeFlashcardViewPage from "./Flashcard/swipeCardView";
import ImageToText from "./notifications/txt-img";
import DownloadPageComplete from "./docs/complete-download-page";
import MusicPlayer from "./music/player2.0/musicPlayer";
import JournalPage from "./journals/mainPage";
import PDFnotesCreation from "./flashCards/pdf notes creation/PDFnotesCreation";
import GenerateNotesAI from "./flashCards/Ai notes/aiNotes";
import CreateNotesPageChoice from "./flashCards/chooseNoteCreateType";
import YtVidDownload from "./flashCards/youtube video to notes/sample";
import AudioToNotes from "./flashCards/youtube video to notes/sample";
import UserFlow from "./Personalized study plan/Input-flow";
import LoadingPage from "./Personalized study plan/LoadingPage";
import StudyPlanPage from "./Personalized study plan/StudyPlanPage";
import TodayAiOverview from "./Personalized study plan/TodayOverview";
import Music from "./music/Music";
import PaymentComponent from "./premium/SubscriptionPage";
import Leaderboard2 from "./streaks/leaderboard2.0";
import GenerateQuestion from "./question paper/main-question";
import ViewQuestionPaper from "./question paper/ViewQuestionPaper";
import AllQuestionPapers from "./question paper/all-paper";
import TypewriterLoader from "./question paper/TypewriterLoader";
import ViewQuestionPaperExample from "./question paper/ViewQuestionPaper copy";
import GenerateEliteNotesAI from "./flashCards/elite Notes/EliteNotes";
import QuizGeneratorExam from "./competivie exam/competiveexam";
import LoaderComponentExamMock from "./competivie exam/comp-exam-loader";
import LoaderMockExamApp from "./competivie exam/page-loader-mock-exam";
import ResourceFinder from "./resoruces finder/components/ResourcesPage";
import AdminResourceReview from "./resoruces finder/components/AdminResourceReview";
import GiftCardPage from "./gift Cards/GiftCardPage";
import SendNotificationPage from "./Send noti/notiSend";
import { API_ROUTES } from "./app_modules/apiRoutes";
import NeetSwipeGuide from "./guides/neet/NeetGuide";
import GenerateMindMap from "./mind maps/GenerateMindMap";
import MindMapPage from "./mind maps/MindMapPage";
import GetYtApp from "./math/yt/ytTranscript";
import MindMap from "./mind maps/GenerateMindMap";
import MindMapHistory from "./mind maps/MindMapHistory";
import LoaderMagic from "./math/magicLoader";
import CheckSubscription from "./help/CheckSubscription";
import TrialSuccess from "./help/trail-success";
import FeaturesCard from "./premium/FeaturesCard";
import SubmitPageCompExam from "./quiz/submitPage competiveExam";
import AssignmentMaker from "./assignment Maker/assignment maker";
import AssignmentPage from "./assignment Maker/AssignmentPage";
import MyAssignments from "./assignment Maker/MyAssignments";
import LoaderAssignemnt from "./assignment Maker/loaderAssignment";
import YouTubeSummarizer from "./math/yt/ytTranscript";
import PomodoroChallenge from "./Challenges/PomodoroChallenge";
import MathPageImageGen from "./math/mathPageImageGen";
import AiSelectionPage from "./math/AiSelectionPage";
import LoaderQuizGen from "./quiz/quizGenLaoder";
import EdusifyStory__filkename from "./docs/about Edusify/EdusifyStory__filkename";
import FormFilename from "./Pathfinder/FormFilename";
import CareerPage from "./Pathfinder/CareerPage";
import DeepResearchApp from "./deep reserach ai/DeepReseacrApp";
import EdusifyArticle1 from "./seo/EdusifyArticle1";
import EdusifyArticle2 from "./seo/EdusifyArticle2";
import LoadingHome from "./help/loaderHome";
import QuizGeneratorAPi from "./api testing/apitesting";
import QuizGeneratorCompExam from "./api testing/apiTestingCompExam";
import ExamMode from "./exam mode/ExamMode";
import ExamModeResult from "./exam mode/ExamModeResult";
import LoaderExamMode from "./exam mode/loader";
import ExamPacks from "./exam mode/ExamPacks";
import CareerMatcherFlow from "./carrier match/CareerMatcherFlow";
import CareerResult from "./carrier match/displayCarrier";
import PaymentComponentUserReg from "./premium/subs-user-reg";
import PremiumReminder from "./premium/premiumAbandon";
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const PUBLIC_VAPID_KEY = "BLDWVHPzXRA9ZOFhSyCet2trdRuvErMUBKuUPNzDsffj-b3-yvd7z58UEhpQAu-MA3DREuu4LwQhspUKBD1yngs";

const router = createBrowserRouter([
  {path: '/login', element: <Login/>},
  {path: '/sign-up', element: <SignUp/>},
  {path: '/planner', element: <Dashbaord/>},
  {path: '/note/view/:id', element: <NoteDetailPage/>},
  {path: '/groups', element: <GroupsPage/>},
  {path: '/group-chat/:id', element: <GroupChat/>},
  {path: '/group/details/:id', element: <GroupDetails/>},
  {path: '/quiz/home', element: <QuizHomePage/>},
  {path: '/quiz/create', element: <CreateQuizPage/>},
  {path: '/quiz/:id', element: <QuizPage/>},
  {path: '/quiz/submit', element: <SubmitPage/>},
  {path: '/calendar', element: <CalendarPage/>},
  {path: '/terms-and-conditions', element: <TermsAndConditions/>},
  {path: '/privacy-policy', element: <PrivacyPolicy/>},
  {path: '/more-info', element: <MoreInfo/>},
  // {path: '/pomodoro', element: <Pomodoro/>},
  {path: '/music', element: <Music/>},
  {path: '/callback', element: <Callback/>},
  {path: '/welcome', element: <Welcome/>},
  {path: '/noti', element: <NotiPage/>},
  {path: '/social-feed', element: <SocialFeed/>},
  {path: '/profile', element: <ProfilePage/>},
  {path: "/group-details/:id", element: <GroupDetailsPage />},
  {path: '/comments/:id', element: <CommentsPage/>},
  {path: '/profile/:id', element: <UsersProfile/>},
  {path: '/ai', element: <MathPage/>},
  {path: '/ai/image', element: <MathPageImageGen/>},
  {path: '/ai/select', element: <AiSelectionPage/>},
  {path: '/science/helper', element: <ScienceHelper/>},
  {path: '/search', element: <SearchPage/>},
  {path: '/settings', element: <SettingsPage/>},
  {path: '/commerce/helper', element: <CommerceHelper/>},
  {path: '/forgot-password', element: <ForgotPassword/>},
  {path: '/reset-password/:token', element: <ResetPassword/>},
  {path: '/subscription', element: <PaymentComponent/>},
  {path: '/payment-success', element: <SuccessPage/>},
  {path: '/help', element: <HelpMain/>},
  {path: '/about-app', element: <AboutAppPage/>},
  {path: '/', element: <HomeMain/>},
  {path: '/notes/view', element: <ViewFlashCard/>},
  {path: '/notes/create', element: <CreateFlashcard/>},
  {path: '/quiz/guide', element: <QuizGuidePage/>},
  {path: '/leaderboard', element: <Leaderboard2/>},
  {path: '/flashcard', element: <FlashcardLibraryPage/>},
  {path: '/flashcard/set/:id', element: <FlashcardSetPage/>},
  {path: '/create/flashcard', element: <CreateFlashcardSet/>},
  {path: '/flashcard/card/view/:id/:setId', element: <FlashcardViewPage/>},
  {path: '/ios/instructions/download', element: <IOSInstructions/>},
  {path: '/subject/:subjectId', element: <Subjects/>},
  {path: '/toolkit', element: <ToolkitPage/>},
  {path: '/toolkit/calculator', element: <Calculator/>},
  {path: '/toolkit/gpa/calculator', element: <GpaCalculator/>},
  {path: '/toolkit/unitconverter', element: <UnitConverter/>},
  {path: '/admin/send/email/all/users/not/allowed/here', element: <EmailSender/>},
  {path: '/toolkit/report-card-maker', element: <ReportCardMaker/>},
  {path: '/android/download', element: <DownloadPageAndorid/>},
  {path:'/ai/chat/history', element: <ChatHistoryPage/>},
  {path: '/quiz/ai', element: <GenerateQuiz/>},
  {path:'/document-locker', element: <DocumentLockerPage/>},
  {path: '/document/view/:id', element: <DocumentViewPage/>},
  {path: '/folder/:id', element: <FolderPage/>},
  {path: '/quiz/answers/:id',element:<QuizAnswersPage/>},
  {path: '/whats-new', element: <WhatsNew/>},
  {path: '/whats-new-admin', element: <AdminPage/>},
  {path: '/monthly-stats', element: <MonthlyStats/>},
  {path: '/streaks', element: <Streaks/>},
  {path: '/pomodoro', element: <PomodoroApp/>},
  {path:'/pomodoro/stats', element: <SessionStatsPage/>},
  {path: '/pomodoro/settings', element: <SettingsPagePomodoro/>},
  {path: '/toolkit/pdf-notes-to-text-convertor', element: <PdfNotesConvertor/>},
  {path: '/game/story', element: <StoryGame/>},
  {path: '/user/report', element: <UserReport/>},
  {path:'/previous-reports', element: <PreviousReports/>},
  {path: '/user/report/:id', element: <ReportDisplayPage/>},
  {path: '/achievements', element: <AchievementPage/>},
  {path: '/toolkit/scientific-calculator', element: <ScientificCalculator/>},
  {path: '/room', element: <MainPageRooms/>},
  {path: '/room/invite/:roomId', element: <JoinRoom/>},
  {path: '/room/members/:roomId', element: <RoomMainPageJoined/>},
  {path: '/room/activity/:roomId', element: <ActivityPageRooms/>},
  {path: '/room/resources/:roomId', element: <ResourcesPage/>},
  {path: '/room/leaderboard/:roomId', element: <RoomLeaderboard/>},
  {path: '/room/post/:roomId', element: <PostsRooms/>},
  {path: '/room/progress/:roomId', element: <RoomProgress/>},
  {path: '/room/tasks/:roomId', element: <RoomTasks/>},
  {path: '/how-to-use-edusify', element: <GuideToEdusify/>},
  {path: '/send/noti', element: <SendNotificationPage/>},
  {path: '/insta-story', element: <InstaStory/>},
  {path: '/word-scramble', element: <WordScrambleGame/>},
  {path: '/word-scramble/:gameId', element: <PlayGame/>},
  {path: '/swipe/flashcard/card/view/:id/:setId', element: <SwipeFlashcardViewPage/>},
  {path: '/download-app', element: <DownloadPageComplete/>},
  {path: '/journal', element: <JournalPage/>},
  {path: '/flow-user-data', element: <UserFlow/>},
  {path: '/loading-goal-plan', element: <LoadingPage/>},
  {path: '/study-plan', element: <StudyPlanPage/>},
  {path: '/notes/create/pdf', element: <PDFnotesCreation/>},
  {path: '/notes/create/ai', element: <GenerateNotesAI/>},
  {path: '/notes/create/elite', element: <GenerateEliteNotesAI/>},
  {path: '/create/notes/page', element: <CreateNotesPageChoice/>},
  {path: '/yt/vid/download', element: <AudioToNotes/>},
  {path: '/my-ai-plan', element: <TodayAiOverview/>},
  {path: '/question-paper-generator', element: <GenerateQuestion/>},
  {path: '/view-paper/:id', element: <ViewQuestionPaper/>},
  {path: '/view-paper-example/:id', element: <ViewQuestionPaperExample/>},
  {path: '/all-papers', element: <AllQuestionPapers/>},
  {path: '/type-writter-loader', element: <TypewriterLoader/>},
  {path: '/competive-exam', element: <QuizGeneratorExam/>},
  {path: '/loading/mock-exam', element:<LoaderMockExamApp />},
  {path: '/resource-finder', element: <ResourceFinder/>},
  {path: '/admin-resources-review-page-not-allowed', element: <AdminResourceReview/>},
  {path: '/gift-card', element: <GiftCardPage/>},
  {path: '/guide/neet', element: <NeetSwipeGuide/>},
  {path: '/mindmap/create', element: <MindMap/>},
  {path: '/mindmap/:mindMapId', element: <MindMapPage/>},
  {path: '/mindmap/user', element: <MindMapHistory/>},
  {path: '/testing-yt', element: <GetYtApp/>},
  {path: '/loading-magic', element: <LoaderMagic/>},
  {path: '/trial-success', element: <TrialSuccess/>},
  {path: '/subscription/features', element: <FeaturesCard/>},
  {path :'/submit/quiz/competitive', element: <SubmitPageCompExam/>},
  {path: '/assignment-maker', element: <AssignmentMaker/>},
  {path: '/assignment/:id', element: <AssignmentPage/>},
  {path: '/my-assignments', element: <MyAssignments/>},
  {path: '/loading-assignment', element: <LoaderAssignemnt/>},
  {path: '/week-challenge', element: <PomodoroChallenge/>},
  {path: '/loader/quiz/ai', element: <LoaderQuizGen/>},
  {path: '/story-of-edusify', element: <EdusifyStory__filkename/>},
  {path: '/pathfinder-form', element: <FormFilename/>},
  {path: '/career/:id', element: <CareerPage/>},
  {path: '/ai/deep-research', element: <DeepResearchApp/>},
  {path: '/edusify-article-1-boost-study-productivity', element: <EdusifyArticle1/>},
  {path: '/edusify-article-2-study-tools-ai', element: <EdusifyArticle2/>},
  {path: '/loading/home', element: <LoadingHome/>},
  {path: '/api-testing-quiz', element: <QuizGeneratorAPi/>},
  {path: '/api-testing-comp-exam', element: <QuizGeneratorCompExam/>},
  {path: '/exam-mode', element: <ExamMode/>},
  {path: '/exam-mode/loader', element: <LoaderExamMode/>},
  {path: '/exam-mode/:id', element: <ExamModeResult/>},
  {path: '/exam-mode/packs', element: <ExamPacks/>},
  {path: '/carrier/flow',element: <CareerMatcherFlow/>},
  {path: '/carrier/:id', element: <CareerResult/>},
  {path: '/reg-user-subs', element: <PaymentComponentUserReg/>},
  {path: "/premium-abandon", element: <PremiumReminder/>},
  { path: '*', element: <NotFoundPage /> },
]);


function App() {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    async function registerServiceWorker() {
      if ("serviceWorker" in navigator) {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js");

  
          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
    
            return;
          }
  
          const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
          });
  

  
          // Get the user token (or user_id from localStorage, context, etc.)
          const userToken = localStorage.getItem('token'); // Example
  
          // Send subscription to backend along with user_id or token
          await fetch(API_ROUTES.subscribeNoti, {
            method: "POST",
            body: JSON.stringify({
              subscription,
              userToken
            }),
            headers: { "Content-Type": "application/json" },
          });
  
          setSubscription(subscription);
        } catch (error) {
          console.error("Service Worker Error:", error);
        }
      }
    }
  
    registerServiceWorker();
  }, []);
  

  // Convert VAPID key to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  };


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;