import express from "express";
import mongoose from "mongoose";

import {registerValidation} from "./validations/auth.js"
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js"

mongoose
    // .connect('mongodb+srv://admin:12345@testdb.i3vxtxl.mongodb.net/?retryWrites=true&w=majority')
    .connect('mongodb://localhost:27017/blog')
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

app.post("/auth/register", registerValidation, UserController.register)
app.post("/auth/login", UserController.login)
app.get("/auth/me", checkAuth, UserController.getMe)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    } else {
        console.log("Server has been started!")
    }
})


