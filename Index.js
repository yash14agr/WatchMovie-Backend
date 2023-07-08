import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import UserSchema from "./Schema/User.js";
import MovieSchema from "./Schema/Movie.js";
// import dbUrl from "./config/keys.js"
import validateLogin from "./Auth/ValidateLogin.js"
import validateSignIn from "./Auth/ValidateSignIn.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import 'dotenv/config'
import generateMail from './GenerateMail/Mail.js'


const PORT = process.env.PORT || 5000;

//middleware
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.dbUrl, { useNewUrlParser: true })
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

//check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


app.post('/SignUp', async (req, res) => {

    //validating signIn Detils
    var message = {
        successfull: "",
        Name: "",
        UserName: "",
        Email: "",
        Password: "",
        RePassword: ""
    }
    const { errors, isValid } = validateSignIn(req.body)
    if (!isValid) {
        message = errors
        message.successfull = ""
        return res.json({ message: message, isValid: false })
    }


    //checking if email already exists
    await UserSchema.findOne({ Email: req.body.Email })
        .then(async olduser => {
            if (olduser) {
                message.Email = "Email already exists";
                return res.json({ message: message, isValid: false });
            }
            else {
                //encoding password to passwordHash
                const salt = await bcrypt.genSalt();
                const passwordHash = await bcrypt.hash(req.body.Password, salt)

                const newUser = new UserSchema({
                    Name: req.body.Name,
                    UserName: req.body.UserName,
                    Email: req.body.Email,
                    Password: passwordHash,
                    // MovieBooked:[{
                    //     M
                    // }]
                })
                try {
                    //save user in db
                    const savedUser = await newUser.save()

                    //creating token which will be based on the secret provided
                    const token = jwt.sign({
                        user: savedUser._id
                    }, process.env.My_secret_code)

                    //sending token without using local storage
                    res.cookie("token", token, {
                        httpOnly: true,
                    })
                    message.successfull = "Successfull Sign-In"
                    return res.json({ message: message, isValid: true })
                }
                catch (e) {
                    console.error(e)
                    return res.json({ message: message, isValid: false });
                }
            }
        })
})



app.post('/Login', async (req, res) => {
    const email = req.body.Email;
    const password = req.body.Password;
    const userData = {
        Name: "",
        UserName: "",
        Email: "",
    };
    var message = {
        successfull: "",
        Name: "",
        UserName: "",
        Email: "",
    }
    //validating Login Detils
    const { errors, isValid } = validateLogin(req.body)

    if (!isValid) {
        message = errors
        message.successfull = ""
        return res.json({ message: message, isValid });
    }

    //checking if email exists
    const existUser = await UserSchema.findOne({ Email: email })
    if (!existUser) {
        // isValid=false;
        message.Email = "wrong email or password"
        return res.json({ message: message, isValid: false })
    }

    //checking encoded password
    const passwordCorrect = await bcrypt.compare(password, existUser.Password)
    if (!passwordCorrect) {
        message.Email = "wrong email or password"
        return res.json({ message: message, isValid: false })
    }

    userData.Name = existUser.Name;
    userData.UserName = existUser.UserName;
    userData.Email = existUser.Email;

    const token = jwt.sign({
        user: existUser._id
    }, process.env.My_secret_code)
    // console.log(token)

    //sending token without using local storage
    // console.log("existUser=", existUser)
    res.cookie("token", token, {
        httpOnly: true,
    })
    message.successfull = "Successfull-logged-in"
    return res.json({ message: message, userData, isValid: true })

})


app.post('/UserDetails', async (req, res) => {

    const data = {
        Email: req.body.Email,
        Name: req.body.Name,
        MoviesBooked: [{
            ImgUrl: req.body.ImgUrl,
            Language: req.body.Language || 'English',
            MovieName: req.body.MovieName,
            Day: req.body.Day,
            Time: req.body.Time,
            TotalSeat: req.body.TotalSeat,
            TotalPrice: req.body.TotalPrice
        }]
    }

    var message = {
        successfull: false
    }
    const existUser = await MovieSchema.findOne({ Email: data.Email })
    if (!existUser) {
        //save directly
        let newUser = new MovieSchema(data);
        try {
            const savedUser = await newUser.save()
            message.successfull = true

        }
        catch (e) {
            console.log(e)

        }


    } else {
        existUser.MoviesBooked.push(data.MoviesBooked[0])
        try {
            const savedUser = await existUser.save()
            message.successfull = true

        }
        catch (e) {
            console.log(e)

        }

    }
    //generate mail
    var msg
    await generateMail(data)
    // .then((msg1) => {
    // msg = msg1
    // })
    // .catch(e => console.log(e))
    return res.json({ message: message })
})


app.post('/Profile', async (req, res) => {
    const existUser = await MovieSchema.findOne({ Email: req.body.Email })
    if (!existUser) {
        console.log("User Not found")
    }
    else {
        console.log('Profile data passed:', existUser)
        res.json({ existUser })
    }
})


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})