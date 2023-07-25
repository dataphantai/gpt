import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import {
    APP_BASE_URL,
    APP_LOGIN_URL,
    APP_SIGNUP_URL,
    APP_MANAGE_DOCUMENTS_URL,
    APP_INFO_URL,
} from "common/constants/constants";
import AuthRoute from "common/components/AuthRoute/AuthRoute";
import PublicRoute from "common/components/PublicRoute/PublicRoute";
import Chat from "pages/Chat/Chat";
import ManageDocuments from "pages/ManageDocuments/ManageDocuments";
import Info from "pages/Info/Info";
import Login from "pages/Login/Login";
import SignUp from "pages/SignUp/SignUp";
import NotFound from "pages/NotFound/NotFound";

import "index.css";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const router = createBrowserRouter([
    {
        path: APP_BASE_URL,
        element: (
            <AuthRoute>
                <Chat />
            </AuthRoute>
        ),
        errorElement: <NotFound />,
    },
    {
        path: APP_MANAGE_DOCUMENTS_URL,
        element: (
            <AuthRoute>
                <ManageDocuments />
            </AuthRoute>
        ),
        errorElement: <NotFound />,
    },
    {
        path: APP_INFO_URL,
        element: (
            <AuthRoute>
                <Info />
            </AuthRoute>
        ),
        errorElement: <NotFound />,
    },
    {
        path: APP_LOGIN_URL,
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: APP_SIGNUP_URL,
        element: (
            <PublicRoute>
                <SignUp />
            </PublicRoute>
        ),
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <GoogleOAuthProvider
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
    >
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <SnackbarProvider
                anchorOrigin={{ horizontal: "center", vertical: "top" }}
            />
            <RouterProvider router={router} />
        </ThemeProvider>
    </GoogleOAuthProvider>
);
