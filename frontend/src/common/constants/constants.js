export const APP_BASE_URL = "/";
export const APP_LOGIN_URL = APP_BASE_URL + "login";
export const APP_SIGNUP_URL = APP_BASE_URL + "signup";
export const APP_MANAGE_DOCUMENTS_URL = APP_BASE_URL + "documents";

export const API_BASE_URL = 'https://api.dataphant.ai/api';
export const API_IS_USER_AUTHENTICATED_URL = "/authenticated";
export const API_LOGIN_URL = "/login";
export const API_LOGIN_WITH_GOOGLE_URL = API_LOGIN_URL + "/google";
export const API_SIGNUP_URL = "/signup";
export const API_SIGNUP_WITH_GOOGLE_URL = API_SIGNUP_URL + "/google";
export const API_DOCUMENTS_URL = "/documents";
export const API_DOCUMENTS_UPLOAD_URL = API_DOCUMENTS_URL + "/upload";
export const API_ANSWER_URL = "/answer";

export const EMAIL_INVALID_ERROR_MESSAGE = "Invalid email address.";
export const PASSWORD_ERROR_MESSAGE = "Password cannot be empty.";
export const PASSWORDS_MATCH_ERROR_MESSAGE = "Passwords must match.";
export const SIGNUP_SUCCESS_MESSAGE =
    "Sign up successful. Go to login page and continue.";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
export const FILE_SIZE_TOO_BIG_MESSAGE =
    "File size too big. Upload documents less than 10MB.";
export const FILE_UPLOAD_SUCCESS_MESSAGE = "File successfully uploaded.";
export const FILE_DELETE_SUCCESS_MESSAGE = "File successfully deleted.";

export const LS_TOKEN_KEY = "token";

export const QAGPT_CHAT_PARTICIPANT = "qagpt";
export const USER_CHAT_PARTICIPANT = "user";
export const QAGPT_REQUEST_IN_FLIGHT_MESSAGE = "REQUEST_IN_FLIGHT";
export const QAGPT_FAILED_ANSWER_MESSAGE =
    "Could not answer  your question. Try again later.";
export const QAGPT_INFORMATION_NOT_KNOWN_ERROR_MESSAGE = "I do not know.";
export const QAGPT_ANSWER_TEMPLATE = "ANSWER: ";
