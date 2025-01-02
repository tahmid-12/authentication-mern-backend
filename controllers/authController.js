import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js"

export const signup = async (req, res) => {

    const { email, name, password  } = req.body;

    try{
        if(!email || !password || !name){
            throw new Error("All Fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        if(userAlreadyExists){
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }

        const hashedPassowrd = await bcryptjs.hash(password, 10);
        const verificationToken = generateVerificationToken();


        const user = new User({
            email,
            password: hashedPassowrd,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 *60 * 1000
        });

        await user.save();

        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "user Created Successfully",
            user: {
                ...user._doc,
                password
            }
        });

    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    // res.send("Sign Up Controller");
}

export const login = async (req, res) => {
    res.send("Log In Controller");
}

export const logout = async (req, res) => {
    res.send("Log Out Controller");
}