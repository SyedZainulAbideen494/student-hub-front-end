import { Fragment } from "react";
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
import TermsAndConditions from "./auth/terms-conditions";
import Pomodoro from "./Pomodoro/pomodoro";
import Website from "./website/website";
import SpotifyPlayer from "./music/Music";
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
import TaskManagerGuidePage from "./help/TaskmanagerHelp";
import GroupsGuidePage from "./help/groupshelp";
import NotesFlashcardsGuidePage from "./help/NotesFlashcardsGuidePage";
import PomodoroTimerGuidePage from "./help/PomodoroTimerGuidePage";
import CalendarGuidePage from "./help/CalendarGuidePage";
import SocialFeedGuidePage from "./help/SocialFeedGuidePage";
import SubjectHelpersGuidePage from "./help/SubjectHelpersGuidePage";
import AboutAppPage from "./help/AboutAppPage";
import HomeMain from "./home/homeMain";

const router = createBrowserRouter([
  {path: '/login', element: <Login/>},
  {path: '/sign-up', element: <SignUp/>},
  {path: '/planner', element: <Dashbaord/>},
  {path: '/notes', element: <FlashcardsPage/>},
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
  {path: '/pomodoro', element: <Pomodoro/>},
  {path: '/music', element: <SpotifyPlayer/>},
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
  {path: '/subscription', element: <SubscriptionPage/>},
  {path: '/payment-success', element: <SuccessPage/>},
  {path: '/help', element: <HelpMain/>},
  {path: '/task-management-guide/guide', element: <TaskManagerGuidePage/>},
  {path: '/collaborative-study-groups-guide/guide', element: <GroupsGuidePage/>},
  {path: '/aesthetic-notes-flashcards-guide/guide', element: <NotesFlashcardsGuidePage/>},
  {path: '/pomodoro-timer-guide/guide', element: <PomodoroTimerGuidePage/>},
  {path: '/calendar-reminders-guide/guide', element: <CalendarGuidePage/>},
  {path: '/social-feed-guide/guide', element: <SocialFeedGuidePage/>},
  {path: '/subject-helpers-guide/guide', element: <SubjectHelpersGuidePage/>},
  {path: '/about-app', element: <AboutAppPage/>},
  {path: '/', element: <HomeMain/>},
  { path: '*', element: <NotFoundPage /> }, // This catches all undefined routes
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;