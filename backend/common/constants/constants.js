export const API_BASE_URL = "/api";
export const API_IS_USER_AUTHENTICATED_URL = API_BASE_URL + "/authenticated";
export const API_LOGIN_URL = API_BASE_URL + "/login";
export const API_LOGIN_WITH_GOOGLE_URL = API_LOGIN_URL + "/google";
export const API_SIGNUP_URL = API_BASE_URL + "/signup";
export const API_SIGNUP_WITH_GOOGLE_URL = API_SIGNUP_URL + "/google";
export const API_DOCUMENTS_URL = API_BASE_URL + "/documents";
export const API_DOCUMENTS_DELETE_URL = API_BASE_URL + "/documents/:documentId";
export const API_DOCUMENTS_UPLOAD_URL = API_DOCUMENTS_URL + "/upload";
export const API_ANSWER_URL = API_BASE_URL + "/answer";
export const API_SERVER_HEALTH = "/"

export const SALT_ROUNDS = 10;
export const JWT_TOKEN_EXPIRY_TIME = "2h";
export const MAX_NUMBER_OF_SOURCES = 3;
export const MAX_DISTANCE = 0.25;

export const GOOGLE_USER_INFO_API_URL =
    "https://www.googleapis.com/oauth2/v3/userinfo";

export const AUTH_TOKEN_MISSING_ERROR_MESSAGE = "Authentication token missing.";
export const AUTH_TOKEN_EXPIRED_ERROR_MESSAGE = "Authentication token expired.";
export const AUTH_TOKEN_INVALID_ERROR_MESSAGE = "Invalid authentication token.";
export const AUTH_TOKEN_FAILED_ERROR_MESSAGE = "Authentication failed.";
export const GOOGLE_TOKEN_INVALID_ERROR_MESSAGE =
    "Invalid Google access token.";
export const EMAIL_INVALID_ERROR_MESSAGE = "Invalid email address.";
export const EMAIL_EXISTS_ERROR_MESSAGE = "Email already exists.";
export const PASSWORD_ERROR_MESSAGE = "Password cannot be empty.";
export const PASSWORDS_MATCH_ERROR_MESSAGE = "Passwords must match.";
export const EMAIL_NONEXISTENT_ERROR_MESSAGE = "Email not registered.";
export const EMAIL_PASSWORD_ERROR_MESSAGE = "Email and password do not match.";
export const NO_DOCUMENT_RECEIVED_ERROR_MESSAGE = "No document received.";
export const EXTENSION_NOT_SUPPORTED_ERROR_MESSAGE =
    "Extension not supported. Please upload only .pdf, .doc, .docx and .txt files.";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in bytes
export const FILE_SIZE_TOO_BIG_ERROR_MESSAGE =
    "File size too big. Upload documents less than 10MB.";
export const NO_PROMPT_RECEIVED_ERROR_MESSAGE = "No prompt received.";
export const INFORMATION_NOT_IN_DOCUMENTS_ERROR_MESSAGE =
    "Information is not in uploaded documents.";
export const INFORMATION_NOT_KNOWN_ERROR_MESSAGE = "I do not know.";
export const GENERIC_SERVER_ERROR_MESSAGE =
    "500 Internal Server Error. Please try again later.";
export const SERVER_IS_UP = 
    "200 The server is up."