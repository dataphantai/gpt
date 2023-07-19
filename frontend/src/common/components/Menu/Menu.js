import { useCallback } from "react";
import { useNavigate, useResolvedPath } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from "@mui/icons-material/ChatOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";

import {
    APP_BASE_URL,
    APP_LOGIN_URL,
    APP_MANAGE_DOCUMENTS_URL,
    LS_TOKEN_KEY,
} from "common/constants/constants";

const Menu = () => {
    const path = useResolvedPath();
    const navigate = useNavigate();

    const { pathname } = path;

    const doLogout = useCallback(() => {
        localStorage.removeItem(LS_TOKEN_KEY);

        navigate(APP_LOGIN_URL);
    }, [navigate]);

    return (
        <Drawer className="w-60" variant="permanent" open>
            <List className="w-60 p-0">
                <ListItem className="p-0">
                    <ListItemButton
                        className={`p-4 ${
                            pathname === APP_BASE_URL ? "active" : ""
                        }`}
                        onClick={() => navigate(APP_BASE_URL)}
                        sx={(theme) => ({
                            "&.active, &.active:hover": {
                                backgroundColor: `${theme.palette.primary.dark}`,
                            },
                        })}
                    >
                        <ListItemIcon className="mr-2 min-w-0">
                            <ChatIcon />
                        </ListItemIcon>
                        <ListItemText className="m-0" primary="Ask Questions" />
                    </ListItemButton>
                </ListItem>
                <ListItem className="p-0">
                    <ListItemButton
                        className={`p-4 ${
                            pathname === APP_MANAGE_DOCUMENTS_URL
                                ? "active"
                                : ""
                        }`}
                        onClick={() => navigate(APP_MANAGE_DOCUMENTS_URL)}
                        sx={(theme) => ({
                            "&.active, &.active:hover": {
                                backgroundColor: `${theme.palette.primary.dark}`,
                            },
                        })}
                    >
                        <ListItemIcon className="mr-2 min-w-0">
                            <FolderIcon />
                        </ListItemIcon>
                        <ListItemText
                            className="m-0"
                            primary="Manage Documents"
                        />
                    </ListItemButton>
                </ListItem>
                <ListItem className="p-0">
                    <ListItemButton className="p-4" onClick={doLogout}>
                        <ListItemIcon className="mr-2 min-w-0">
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText className="m-0" primary="Logout" />
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    );
};

export default Menu;
