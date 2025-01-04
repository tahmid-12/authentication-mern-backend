import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail,sendPasswordResetEmail } from "../mailtrap/emails.js"

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

export const verifyEmail = async(req, res) => {

    const { code } = req.body;

    try{
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({ success: false, message: "Invalid or Wrong Verification Code"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

    }catch(error){

    }
}

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
