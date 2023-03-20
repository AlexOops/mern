import {body} from "express-validator";

export const registerValidation = [
    body("fullName", "enter your name").isLength({min: 5}),
    body("password", "the password must contain at least 5 characters").isLength({min: 5}),
    body("email", "invalid mail format").isEmail(),
    body("avatarUrl", "invalid image link").optional().isURL(),
]
