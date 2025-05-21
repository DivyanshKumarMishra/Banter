const SERVER_URL = import.meta.env.VITE_SERVER_URL
const USER_URL = '/api/user/user-info'
const SIGNUP_URL = '/api/auth/signup'
const LOGIN_URL = '/api/auth/login'
const LOGOUT_URL = '/api/auth/logout'
const DM_URL = '/api/user/get-dms'
const CHAT_URL = '/api/chat/get-messages'
const CONTACTS_URL = '/api/user/search-contacts'

export {SERVER_URL, SIGNUP_URL, LOGIN_URL, LOGOUT_URL, DM_URL, USER_URL, CHAT_URL, CONTACTS_URL}