import {body} from "express-validator";

export const registerValidation = [
    body("fullName", "enter your name").isLength({min: 5}),
    body("password", "the password must contain at least 5 characters").isLength({min: 5}),
    body("email", "invalid mail format").isEmail(),
    body("avatarUrl", "invalid image link").optional().isURL(),
]

export const loginValidation = [
    body("password", "the password must contain at least 5 characters").isLength({min: 5}),
    body("email", "invalid mail format").isEmail(),
]

export const postCreateValidation = [
    body("title", "enter the name of the post").isLength({min: 3}).isString(),
    body("text", "enter the text of the post").isLength({min: 10}).isString(),
    body("tags", "invalid tag format(enter an array)").optional().isString(),
    body("imageUrl", "invalid image link").optional().isString(),
]

