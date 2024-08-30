const API_URL = 'https://mn4jqd3r-5000.inc1.devtunnels.ms';

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
  quizResultsPageAllresults: `${API_URL}/get-user-results`
}
