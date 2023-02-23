import express from 'express'
import multer from "multer"
import cors from "cors"

import mongoose from "mongoose";
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import {registerValidator, loginValidator, postCreateValidation} from "./validations.js"
import User from "./models/User.js";
import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import * as fs from "fs";

mongoose.connect(
    'mongodb+srv://1yusupoveldar1:Yusupov1998@cluster0.uqfq1zj.mongodb.net/blog?retryWrites=true&w=majority'
)
    .then(() => {
        console.log('db ok')
    })
    .then(() => {
        console.log('Ok')
    })

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login',  loginValidator, handleValidationErrors, UserController.login )
app.post('/auth/register', registerValidator, handleValidationErrors, UserController.register )
app.get('/auth/me', checkAuth, UserController.getMe)


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth,  PostController.update)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server ok  ')
})