import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req); // проверка на валидацию
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl
        })

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123", // ключ шифрования
            {
                expiresIn: "30d" // время жизни
            }
        )

        const {passwordHash, ...userData} = user._doc; // деструкт

        res.json({
            userData,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).send("failed to register!")
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(400).send("the user will not found")
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).send("invalid username or password")
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123", // ключ шифрования
            {
                expiresIn: "30d" // время жизни
            }
        )

        const {passwordHash, ...userData} = user._doc; // деструкт

        res.json({
            userData,
            token
        });

    } catch (err) {
        console.log(err)
        res.status(500).send("failed to login!")
    }
}

export const getMe = async (req, res) => { // функция проверки авторизации checkAuth
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).send({
                message: "the user will not found"
            })
        }

        const {passwordHash, ...userData} = user._doc; // деструкт

        res.json(userData);

    } catch (err) {
        console.log(err)
        res.status(500).send("permission denied")
    }
}