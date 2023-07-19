### Prerequisites

1. You need to have Node.js v18.16.0 or more installed.
2. You need to register a new project in your Google Cloud Console. Follow the first steps of [this tutorial](https://blog.logrocket.com/guide-adding-google-login-react-app/).

### Instructions on how to start the project locally

1. Run `npm i` in the root folder.
2. Create a new `.env` file in the root folder and copy the contents from `.env.template` inside.
3. In the `.env` file, modify the `REACT_APP_GA_ID` variable to match the ID generated from Google Analytics for your app.
4. In the `.env` file, modify the `REACT_APP_API_BASE_URL` variable to match the base URL of where the BE API will be deployed.
5. In the `.env` file, modify the `REACT_APP_GOOGLE_OAUTH_CLIENT_ID` variable to match the OAuth Client ID generated from your registered Google Cloud project (see the above section).
6. Run `npm start`.

### Instructions on how to build for production

1. Follow steps 1 - 3 from above.
2. Run `npm build`.

The contents of the resulting `build` folder can be deployed on the production server. The app will start by running `npm start`.

### Other mentions

In `src/common/constants/constants.js` is a list of CONSTANTS used throughout the code.

The most important one:

1. `MAX_FILE_SIZE`: defines the maximum file size when uploading documents (defaults to 10 MB, expressed in bytes).
