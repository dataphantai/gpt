import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import isEmail from "validator/lib/isEmail";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import LoadingButton from "@mui/lab/LoadingButton";
import GoogleIcon from "@mui/icons-material/Google";

import Page from "common/components/Page/Page";

import {
    APP_BASE_URL,
    APP_SIGNUP_URL,
    API_LOGIN_URL,
    API_LOGIN_WITH_GOOGLE_URL,
    EMAIL_INVALID_ERROR_MESSAGE,
    PASSWORD_ERROR_MESSAGE,
    LS_TOKEN_KEY,
} from "common/constants/constants";
import useKeyPress from "common/hooks/useKeyPress";
import axios from "common/axios/axios";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [googleError, setGoogleError] = useState(null);

    const resetFormErrorState = useCallback(() => {
        setEmailError(null);
        setPasswordError(null);
        setLoading(false);
        setServerError(null);
        setGoogleError(null);
    }, []);

    const navigateAfterLogin = useCallback(
        (token) => {
            localStorage.setItem(LS_TOKEN_KEY, token);

            navigate(APP_BASE_URL);
        },
        [navigate]
    );

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (res) => {
            try {
                const loginRes = await axios.post(API_LOGIN_WITH_GOOGLE_URL, {
                    token: res.access_token,
                });

                navigateAfterLogin(loginRes.data.token);
            } catch (err) {
                setGoogleError(err.response.data.message);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setGoogleError(
                "Could not complete the login process using Google. Please try again later."
            );

            setLoading(false);
        },
        onNonOAuthError: () => setLoading(false),
    });

    const handleSubmit = useCallback(async () => {
        resetFormErrorState();

        const isEmailValid = isEmail(email);
        const isPasswordValid = password !== "";

        if (isEmailValid && isPasswordValid) {
            setLoading(true);

            try {
                const res = await axios.post(API_LOGIN_URL, {
                    email,
                    password,
                });

                navigateAfterLogin(res.data.token);
            } catch (err) {
                setServerError(err.response.data.message);
            } finally {
                setLoading(false);
            }
        } else {
            if (!isEmailValid) {
                setEmailError(EMAIL_INVALID_ERROR_MESSAGE);
            }

            if (!isPasswordValid) {
                setPasswordError(PASSWORD_ERROR_MESSAGE);
            }
        }
    }, [email, navigateAfterLogin, password, resetFormErrorState]);

    const handleSubmitWithGoogle = useCallback(() => {
        resetFormErrorState();

        setLoading(true);

        loginWithGoogle();
    }, [resetFormErrorState, loginWithGoogle]);

    useKeyPress("Enter", handleSubmit);

    return (
        <Page flexDirection="col" pageName="login">
            <Box className="flex flex-col w-80">
                <Typography className="text-center mb-4" variant="h5">
                    Login
                </Typography>
                <LoadingButton
                    variant="contained"
                    loading={loading}
                    onClick={handleSubmitWithGoogle}
                    startIcon={<GoogleIcon />}
                >
                    Log In With Google
                </LoadingButton>
                {googleError && (
                    <FormHelperText className="mt-4" error={!!googleError}>
                        {googleError}
                    </FormHelperText>
                )}
                <Typography className="text-center mt-4 mb-4" variant="body1">
                    OR
                </Typography>
                <TextField
                    className="mb-4"
                    label="Email"
                    type="email"
                    value={email}
                    error={!!emailError}
                    helperText={emailError}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    error={!!passwordError}
                    helperText={passwordError}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {serverError && (
                    <FormHelperText className="mt-4" error={!!serverError}>
                        {serverError}
                    </FormHelperText>
                )}
                <LoadingButton
                    className="mt-4 mb-12"
                    variant="contained"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Login
                </LoadingButton>
                <Typography className="text-center" variant="body2">
                    Don't have an account yet?{" "}
                    <Link to={APP_SIGNUP_URL}>Sign up</Link> now.
                </Typography>
            </Box>
        </Page>
    );
};

export default Login;
