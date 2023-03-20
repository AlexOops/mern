import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";

import {registerValidation} from "./validations/auth.js"
import UserModel from "./models/User.js";

mongoose
    // .connect('mongodb+srv://admin:12345@testdb.i3vxtxl.mongodb.net/?retryWrites=true&w=majority')
    .connect('mongodb://localhost:27017')
    .then(() => {
        console.log('Db has been connected!')
    })
    .catch((err) => {
        console.log("The problem with connecting...", err)
    })

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.post("/auth/register", registerValidation, async (req, res) => {

    const errors = validationResult(req); // проверка на валидацию
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }

    const password = req.body.password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = {
        fullName: req.body.fullName,
        email: req.body.email,
        passwordHash,
        avatarUrl: req.body.avatarUrl
    }

    const user = await doc.save();

    res.json(user);
})


app.post("/auth/login", (req, res) => {

    console.log(res.body)

    const token = jwt.sign({
        "email": req.body.email,
        "fullName": "Vasya",
    }, "secret123")

    res.json({
        success: true,
        token
    })
})

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    } else {
        console.log("Server has been started!")
    }
})


