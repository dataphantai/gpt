import Typography from "@mui/material/Typography";

import Page from "common/components/Page/Page";

const NotFound = () => {
    return (
        <Page flexDirection="col" pageName="notFound">
            <Typography variant="body1">404 Not Found.</Typography>
        </Page>
    );
};

export default NotFound;
