import {
    SERVER_IS_UP
} from "../../common/constants/constants.js";

export const health = async (req, res) => {
    return res.status(200).send({
        message: SERVER_IS_UP,
    });
}