const API_URL = 'https://dropment.online';

export const API_ROUTES = {
  login: `${API_URL}/login`,
  signup: `${API_URL}/signup`,
  displayImg: `${API_URL}`,
  verifyOTP: `${API_URL}/verify-otp`,
  addTask: `${API_URL}/add/tasks`,
  fetchTask: `${API_URL}/fetch/tasks`,
  editTask: `${API_URL}/edit/task`,
  deleteTask: `${API_URL}/delete/task`,
  addFlashCard: `${API_URL}/api/add/flashcards`,
  getUserNotes: `${API_URL}/api/get/user/notes`,
  getNote: `${API_URL}/api/notes`,
  joinGroup: `${API_URL}/api/groups/join`,
  fetchJoinedGroups: `${API_URL}/api/groups/joined`,
  fetchPublicGroups: `${API_URL}/api/groups/public`,
  createGroup: `${API_URL}/api/groups/add`,
  shareFlashCard: `${API_URL}/shareFlashCard`,
  getGroupDetailsById: `${API_URL}/api/groups`,
  sendGroupMessages: `${API_URL}/api/groups/messages/send`,
  getUserByToken: `${API_URL}/api/user/details`, 
  getGroupMemberCount: `${API_URL}/group/member-count`,
  inviteMemberToGroup: `${API_URL}/invite/group`,
  getGroupMembers: `${API_URL}/api/groups/members`,
  fetchInvitations: `${API_URL}/api/invitations`,
  respondToInvitation: `${API_URL}/invitations/respond`,
  checkUserMembership: `${API_URL}/api/checkUserMembership`,
  getUserQuizzes: `${API_URL}/getUserQuizzes`,
  createQuiz: `${API_URL}/createQuiz`,
  getQuiz: `${API_URL}/getQuiz`,
  submitQuiz: `${API_URL}/submitQuiz`,
  shareQuiz: `${API_URL}/shareQuiz`,
  getUserResults: `${API_URL}/api/getUserResults`,
  getQuizResults: `${API_URL}/api/getQuizResults`,
  fetchEvents: `${API_URL}/api/fetchEvents`,
  addEvent: `${API_URL}/api/addEvent`,
  fetchUserActivity: `${API_URL}/api/fetchUserActivities`,
  deleteEvent: `${API_URL}/api/events/remove`,
  updateEvent: `${API_URL}/api/events/update`,
  userSessionAut: `${API_URL}/api/validate-token-session`,
  sessionCheck: `${API_URL}/api/session-check`,
  downloadAndroid: `${API_URL}/download/android`,
  loginSpotify: `${API_URL}/login/spotify`,
  refreshSpotifyToken: `${API_URL}/refresh_token`,
  saveNotificationSubscriptiopn: `${API_URL}/save-subscription`,
  fetchUserProfile: `${API_URL}/api/profile/user`,
  fetchAllEduscribes: `${API_URL}/api/eduscribes`,
  handleLikeEduscribes: `${API_URL}/api/eduscribes/like`,
  fetchEducribeComments: `${API_URL}/api/eduscribes/comments`,
  addEduscribeComment: `${API_URL}/api/eduscribes/comment/add`,
  profileView: `${API_URL}/api/profile/view/guest`,
  profileItems: `${API_URL}/api/user/profile/items`,
  addEduscribe: `${API_URL}/api/add/eduscribes`,
  unfollow: `${API_URL}/api/unfollow`,
  follow: `${API_URL}/api/follow`,
  isFollowing: `${API_URL}/api/isFollowing`,
  solveMath: `${API_URL}/api/solve-math`,
  scienceProblem: `${API_URL}/wolfram/science`,
  search: `${API_URL}/search`,
  editProfile:`${API_URL}/user/update`,
  removeAvatar: `${API_URL}/api/remove-avatar`, // Adjust the route as needed,
  CommerceHelper: `${API_URL}/api/commerce`,
  updateNote: `${API_URL}/api/update/note`,
  deleteNote: `${API_URL}/api/delete/note`,
  forgotPassword: `${API_URL}/api/auth/forgot-password`,
  resetPassword: `${API_URL}/api/auth/reset-password`,
  leaveGroup: `${API_URL}/api/leave-group`,
  getPremium: `${API_URL}/api/create-checkout-session`,
  verifyPremium: `${API_URL}/api/verifyPremium`,
  getUserOwnProfileEdusify: `${API_URL}/getEduScribe/user/profile`,
  deleteEduScribe: `${API_URL}/api/deleteEduScribe`,
  quizResultsPageAllresults: `${API_URL}/get-user-results`,
  checkUniqueId: `${API_URL}/check-unique-id`,
  generateAlternatives: `${API_URL}/generate-alternatives`,
  deleteQuiz: `${API_URL}/api/deleteQuiz`,
  downloadIOS: `${API_URL}/download/ios`, // Add this line
  incrementDownloadCount: `${API_URL}/notes/increment-download-count`,
  profileFollowers: `${API_URL}/api/profile/followers`,
  profileFollowing: `${API_URL}/api/profile/following`,
  flashcardImageUpload: `${API_URL}/api/upload/images/flashcard`,
  noDetailsUpdateUser: `${API_URL}/api/update-user-details`,
  noDetailPopModalcheck: `${API_URL}/api/check-user-details`,
  changeAvatar: `${API_URL}/user/update/avatar`,
  feedbackEduisfy: `${API_URL}/api/feedback`,
  aiGemini: `${API_URL}/api/chat/ai`,
  userBoxDataHome: `${API_URL}/api/getUserData/home/box`,
  todayTaskHome: `${API_URL}/api/tasks/today/data/home`,
  todayEventHome: `${API_URL}/api/events/today/data/home`,
  updateAvatar: `${API_URL}/api/update-avatar`,
  removeAvatar: `${API_URL}/api/remove-avatar`,
  inviteFriendToEdusify: `${API_URL}/invite/friend`,
  apiStartPomodoro: `${API_URL}/api/start/pomodoro`,
  apiStopPomodoro: `${API_URL}/api/stop/pomodoro`,
  leaderboard: `${API_URL}/api/leaderboard`,
  getFlashcards: `${API_URL}/api/flashcard-sets`,
  flashcardSetGetData: `${API_URL}/api/flashcards/set`,
  generateFlashcards: `${API_URL}/api/flashcards/generate`,
  updateFlashcardStatus: `${API_URL}/api/flashcards/update-status`,
  getsetdataFlashcard: `${API_URL}/api/flashcard-set/data`,
  createFlashcardSet: `${API_URL}/api/flashcard-sets/create`,
  fetchStats: `${API_URL}/api/flashcards/stats`, // New route
  deleteFlashcardIndividual: `${API_URL}/api/flashcards/individual`,
  createFlashcardManually: `${API_URL}/api/flashcards/create/manual`,
  deleteFlashcardSet: `${API_URL}/api/flashcards/set/delete`,
  createSubject: `${API_URL}/api/create-subject`,
  fetchsubjects: `${API_URL}/api/get/user/subjects`,
  fetchSubjectNotes: `${API_URL}/api/flashcards`,
  fetchUserStories: `${API_URL}/fetchStories`,  // Backend route to fetch stories
  addStory: `${API_URL}/addStory`,            
  generateAITasks: `${API_URL}/api/tasks/generate`,
  sendEmailAsAdmin: `${API_URL}/send-emails/all-users/admin`,
  apiLogDownload: `${API_URL}/api/log-download`,
  fetchAiChatHistory: `${API_URL}/api/chat/history/ai`,
  subjectDelete: `${API_URL}/subjects/delete`,
  generateAiQuiz: `${API_URL}/api/quiz/generate`
}
