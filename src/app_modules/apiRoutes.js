const API_URL = 'https://srv594954.hstgr.cloud'; //https://srv594954.hstgr.cloud

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
  profileView: `${API_URL}/user-profile`,
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
  generateAiQuiz: `${API_URL}/api/quiz/generate`,
  viewDocument: `${API_URL}/api/documents/view`,
  getFolderDocuments: `${API_URL}/api/documents/getByFolder`,
  getFolderDetails: `${API_URL}/api/folders/get/details`,
  addDocument: `${API_URL}/api/documents/add`,
  addFolder: `${API_URL}/api/folders/add`,
  getFolders: `${API_URL}/api/folders/get`,
  getDocuments: `${API_URL}/api/documents/get`,
  deleteStickyNote: `${API_URL}/api/sticky-notes/delete`,
  addStickyNote: `${API_URL}/api/sticky-notes/add`,
  getStickyNotes: `${API_URL}/api/sticky-notes/get`,
  getQuizAnswers: `${API_URL}/quiz/answers`,
  updateStickyNote: `${API_URL}/api/sticky-notes/pin`,
  getWhatsNew: `${API_URL}/api/updates/get`,
  addWhatsNew: `${API_URL}/api/updates/add`,
  trackLogins: `${API_URL}/login-track`,
  getMonthlystats: `${API_URL}/api/stats/monthly`,
  getStreaks: `${API_URL}/api/streak`,
  apiStartPomodoro: `${API_URL}/start-session/pomodoro`,
  apiStopPomodoro: `${API_URL}/end-session/pomodoro`,
  pomodoroStatsFetch: `${API_URL}/session-stats/pomodoro`,
  addUserBirthday: `${API_URL}/api/birthday`,
  getPrevReports: `${API_URL}/api/reports`,
  getPrevReportWithId: `${API_URL}/api/reports`,
  generatePersonalReport: `${API_URL}/api/reports/generate`,
  fetchRoomMembers: `${API_URL}/room-members-fetch`,
  fetchRoomActivity: `${API_URL}/api/get-activities`,
  fetchRoomResources: `${API_URL}/api/roomResources`,
  createRoom: `${API_URL}/create-room`,
  joinRoom: `${API_URL}/join-room`,
  checkUserRoom: `${API_URL}/check-room`,
  shareNoteToRoom: `${API_URL}/shareNote-note`,
  fetchUserShareRooms: `${API_URL}/fetchRooms/user`,
  shareQuizToRooms: `${API_URL}/shareQuiz/room`,
  leaveRoom: `${API_URL}/leaveRoom`,
  checkIfUserAlreadyInRoom: `${API_URL}/check-user-in-room`,
  roomLeaderboard: `${API_URL}/api/roomLeaderboard`,
  generateFlashcardsFromPdf: `${API_URL}/api/flashcards/upload`,
  generateQuizFromPDF: `${API_URL}/api/quiz/generate-from-pdf`,
  generateQuizFromNotes: `${API_URL}/api/quiz/generate/from-notes`,
  generateQuizFromMagic: `${API_URL}/api/quiz/generate/from-magic`,
  completeFlashcardQuiz: `${API_URL}/complete-flashcard-quiz`,
  sendNoti: `${API_URL}/send-notification`,
  generateFlashcardsFromNotes: `${API_URL}/api/flashcards/generate-from-notes`,
  generateFlashcardsFromMagic: `${API_URL}/api/flashcards/generate-from-magic`,
  getShareStats: `${API_URL}/api/stats`,
  fetchRoomPosts: `${API_URL}/room/posts/fetch`,
  postRoomPosts: `${API_URL}/room/posts/add`,
  deleteRoomPost: `${API_URL}/room/posts/delete`,
  roomProgress:  `${API_URL}/room-progress`,
  getRoomTasks: `${API_URL}/api/room_tasks/get`,
  addRoomTasks: `${API_URL}/api/room_tasks/add`,
  deleteRoomTasks: `${API_URL}/api/room_tasks/delete`,
  generateFlashcardsFromPdfFromSet: `${API_URL}/api/flashcards/upload/set-created`,
  apiLogDownload: `${API_URL}/api/log-download`,
  sendFriendRequest: `${API_URL}/api/friend/request`,
  friendReqStatus: `${API_URL}/api/friend/status`,
  friendReqResponse: `${API_URL}/api/friend/response`,
  getuserFriendsDashboardWidget: `${API_URL}/api/friends-dashboard`,
  getProfileResources: `${API_URL}/user-resources`,
  aiImgProcessing: `${API_URL}/api/process-images`,
  pdfNotesMaker: `${API_URL}/summarize-pdf/notes`,
  aiNotesGen: `${API_URL}/api/notes/generate`,
  aiPdfProcessing: `${API_URL}/ai-chatbox/pdf/ai`,
  getStudyPlan: `${API_URL}/api/study-plan`,
  pomodoroStudyPlanData: `${API_URL}/api/today-pomodoro-study-plan`,
  generateStudyPlan: `${API_URL}/api/saveGoal`,
  getStudyPlanTaskData: `${API_URL}/getTasks/plan/study`,
  generateTasksFromStudyPlan: `${API_URL}/api/generate/ai/today/plan/tasks`,
  getStudyPlanCreatedDate: `${API_URL}/api/study-plan-created-date`,
  checkSubscription: `${API_URL}/check-premium`,
  magicUseage: `${API_URL}/api/magic/usage`,
  flashcardsCountPdfPremium: `${API_URL}/api/flashcards/count/pdf-premium`,
  QuizCountPdfPremium: `${API_URL}/api/quizzes/count/ai-premium`,
  getPremium: `${API_URL}/buy-premium`,
  verifyPayment: `${API_URL}/verify-payment`,
  aiPomdoroRecomendation: `${API_URL}/api/pomodoro/ai-recommendation`,
  aiExplanFlashcard: `${API_URL}/api/flashcard/ai-explanation`,
  updateStudyPlan: `${API_URL}/api/update-study-plan`,
  getuserQuestionPaper: `${API_URL}/api/question-paper/user`,
  generateAIQuestionPaper: `${API_URL}/api/question-paper/generate`
}
