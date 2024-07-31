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
import DownloadPage from "./website/website";
import SpotifyPlayer from "./music/Music";
import Callback from "./music/SpotifyRedirect";
import Welcome from "./welcome/welcomePage";
import NotificationComponent from "./notifications/NotificationComponent";
import NotiPage from "./notifications/notiPage";
import SocialFeed from "./soical feed/socialfeed";
import ProfilePage from "./profile/ProfilePage";

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
  {path: '/', element: <DownloadPage/>},
  {path: '/music', element: <SpotifyPlayer/>},
  {path: '/callback', element: <Callback/>},
  {path: '/welcome', element: <Welcome/>},
  {path: '/noti', element: <NotiPage/>},
  {path: '/social-feed', element: <SocialFeed/>},
  {path: '/profile', element: <ProfilePage/>},
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;