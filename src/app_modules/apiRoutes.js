const API_URL = 'https://3034374d9f9f6fe1312b0b98663e7617.serveo.net';

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
  addEduscribeComment: `${API_URL}/api/eduscribes/add/comment`
}
