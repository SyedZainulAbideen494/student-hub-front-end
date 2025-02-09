import { Fragment, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Params,
} from "react-router-dom";
import "./index.css";
import "./App.css";
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
import PaymentButton from "./testing/testingpayment";
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
import YouTubeSearch from "./youtube/YouTubeSearch";
import VideoPage from "./youtube/VideoPage";
import EmailFetcher from "./Email sender/emailFetcher";
import GenerateQuiz from "./quiz/GenerateQuiz";
import DocumentLockerPage from "./documnet locker/DocumentLockerPage";
import DocumentViewPage from "./documnet locker/ViewDocument";
import FolderPage from "./documnet locker/FolderPage";
import CanvasPage from "./canvas/canvas";
import NotesList from "./canvas/NotesList";
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
import YoutubeCaption from "./Youtube video caption/YtCaption";
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
import Onboarding from "./OnBoarding/onBoardng";
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
import VoiceAssistant from "./voice assistant/voice assistant";
import ViewQuestionPaperExample from "./question paper/ViewQuestionPaper copy";
import TestModeApp from "./test mode/MainTestPage";
import MindMapsApp from "./Mind maps/mp";
import GenerateEliteNotesAI from "./flashCards/elite Notes/EliteNotes";
import QuizGeneratorExam from "./competivie exam/competiveexam";
import LoaderComponentExamMock from "./competivie exam/comp-exam-loader";
import LoaderMockExamApp from "./competivie exam/page-loader-mock-exam";
import ResourceFinder from "./resoruces finder/components/ResourcesPage";
import AdminResourceReview from "./resoruces finder/components/AdminResourceReview";

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};


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
  {path:'/youtube', element: <YouTubeSearch/>},
  {path: '/video/:videoId', element: <VideoPage/>},
  {path: '/quiz/ai', element: <GenerateQuiz/>},
  {path:'/document-locker', element: <DocumentLockerPage/>},
  {path: '/document/view/:id', element: <DocumentViewPage/>},
  {path: '/folder/:id', element: <FolderPage/>},
  {path: '/canvas', element: <CanvasPage/>},
  {path:'/canvas/list', element: <NotesList/>},
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
  {path: '/send/noti', element: <SendNotiApp/>},
  {path: '/insta-story', element: <InstaStory/>},
  {path: '/onboarding', element: <Onboarding/>},
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
  {path: '/voice-assistant', element: <VoiceAssistant/>},
  {path: '/test-mode', element: <TestModeApp/>},
  {path: '/mind-maps', element: <MindMapsApp/>},
  {path: '/competive-exam', element: <QuizGeneratorExam/>},
  {path: '/loading/mock-exam', element:<LoaderMockExamApp />},
  {path: '/resource-finder', element: <ResourceFinder/>},
  {path: '/admin-resources-review-page-not-allowed', element: <AdminResourceReview/>},
  { path: '*', element: <NotFoundPage /> },
]);


function App() {

  {/*
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          // Register the service worker
          const registration = await navigator.serviceWorker.register('/serviceWorker.js');
          console.log('Service Worker Registered:', registration);

          // Subscribe the user to push notifications
          await subscribeUser(registration);
        } catch (error) {
          console.error('Service Worker Registration Failed:', error);
        }
      } else {
        console.warn('Push Notifications are not supported in this browser.');
      }
    };

    registerServiceWorker();
  }, []);

  const subscribeUser = async (registration) => {
    const vapidPublicKey =
      'BLDWVHPzXRA9ZOFhSyCet2trdRuvErMUBKuUPNzDsffj-b3-yvd7z58UEhpQAu-MA3DREuu4LwQhspUKBD1yngs'; // Replace with your VAPID public key

    try {
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Request push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      console.log('Push Subscription:', subscription);

      // Send the subscription to the server
      const response = await fetch('https://srv594954.hstgr.cloud/subscribe/noti', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error(`Failed to send subscription to server: ${response.statusText}`);
      }

      console.log('Subscription sent to server successfully');
    } catch (error) {
      console.error('Failed to subscribe user for push notifications:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };
*/}

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;