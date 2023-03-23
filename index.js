import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {registerValidation, loginValidation, postCreateValidation} from "./validations.js";

import {checkAuth, handleValidationErrors} from "./utils/index.js";

import {UserController, PostController} from "./controllers/index.js";

mongoose
    // .connect('mongodb+srv://admin:12345@testdb.i3vxtxl.mongodb.net/?retryWrites=true&w=majority')
    .connect('mongodb://localhost:27017/blog')
    .then(() => {
        console.log('Db has been connected!');
    })
    .catch((err) => {
        console.log("The problem with connecting...", err);
    })

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

app.use(multer({storage: storage}).single("image"));

app.use('/uploads', express.static('uploads'));

app.use(cors()); // c фронта не блокирвался на localhost:4444

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello world");
})

app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, (req, res) => {
    let data = req.file;
    if (!data)
        res.send("failed to upload file");
    else
        res.json({
            message: "file uploaded",
            url: `/uploads/${req.file.originalname}`
        })
});

app.get("/tags", PostController.getLastTags);

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch("/posts/:id", checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.delete("/posts/:id", checkAuth, PostController.remove);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    } else {
        console.log("Server has been started!");
    }
})


