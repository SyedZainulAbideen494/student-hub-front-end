const API_URL = 'https://0a178f0486065372b3e6182894e6aa5d.serveo.net';

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
  getGroupMemberCount: `${API_URL}/group/member-count`
};
