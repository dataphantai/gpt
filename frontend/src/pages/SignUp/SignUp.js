import { useState, useCallback } from "react";
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
    API_SIGNUP_URL,
    API_SIGNUP_WITH_GOOGLE_URL,
    APP_LOGIN_URL,
    EMAIL_INVALID_ERROR_MESSAGE,
    PASSWORDS_MATCH_ERROR_MESSAGE,
    PASSWORD_ERROR_MESSAGE,
    APP_BASE_URL,
    LS_TOKEN_KEY,
    API_LOGIN_WITH_GOOGLE_URL,
    API_LOGIN_URL,
} from "common/constants/constants";
import useKeyPress from "common/hooks/useKeyPress";
import axios from "common/axios/axios";

const SignUp = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsEqualError, setPasswordsEqualError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [googleError, setGoogleError] = useState(null);

    const resetFormErrorState = useCallback(() => {
        setEmailError(null);
        setPasswordError(null);
        setPasswordsEqualError(null);
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

    const signupWithGoogle = useGoogleLogin({
        onSuccess: async (res) => {
            try {
                await axios.post(API_SIGNUP_WITH_GOOGLE_URL, {
                    token: res.access_token,
                });

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
                "Could not complete the signup process using Google. Please try again later."
            );

            setLoading(false);
        },
        onNonOAuthError: () => setLoading(false),
    });

    const handleSubmit = useCallback(async () => {
        resetFormErrorState();

        const isEmailValid = isEmail(email);
        const isPasswordValid = password !== "";
        const arePasswordsEqual = password === confirmPassword;

        if (isEmailValid && isPasswordValid && arePasswordsEqual) {
            setLoading(true);

            try {
                await axios.post(API_SIGNUP_URL, {
                    email,
                    password,
                    confirmPassword,
                });

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

            if (!arePasswordsEqual) {
                setPasswordsEqualError(PASSWORDS_MATCH_ERROR_MESSAGE);
            }
        }
    }, [
        email,
        password,
        confirmPassword,
        resetFormErrorState,
        navigateAfterLogin,
    ]);

    const handleSubmitWithGoogle = useCallback(() => {
        resetFormErrorState();

        setLoading(true);

        signupWithGoogle();
    }, [resetFormErrorState, signupWithGoogle]);

    useKeyPress("Enter", handleSubmit);

    return (
        <Page flexDirection="col" pageName="signup">
            <Box className="flex flex-col w-80">
                <Typography className="text-center mb-4" variant="h5">
                    Sign Up
                </Typography>
                <LoadingButton
                    variant="contained"
                    loading={loading}
                    onClick={handleSubmitWithGoogle}
                    startIcon={<GoogleIcon />}
                >
                    Sign Up With Google
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
                    className="mb-4"
                    label="Password"
                    type="password"
                    value={password}
                    error={!!passwordError}
                    helperText={passwordError}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    error={!!passwordsEqualError}
                    helperText={passwordsEqualError}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Sign Up
                </LoadingButton>
                <Typography className="text-center" variant="body2">
                    Go <Link to={APP_LOGIN_URL}>back to login</Link>.
                </Typography>
            </Box>
        </Page>
    );
};

export default SignUp;
