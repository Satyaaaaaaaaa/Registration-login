const {userModel} = require("../models/users");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendMail = require("./SendMail");

function generateOtp(length = 4) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}
let tempOtp = ""; 

const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(403)
            .json({
                message: "Create an account to login!", 
                success: false
            });
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if(!isPasswordEqual){
            return res.status(403)
                .json({
                    message: "Wrong Password!", 
                    success: false                    
                })
        }
        const jwtToken = jwt.sign(
            {email: user.email, _id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        )
        res.status(201)
            .json({
                message: "login sucessfull",
                success:true,
                jwtToken,
                email,
                name: user.name
            });
    }catch(err){
        res.status(500)
            .json({
                message: "An error occured",
                error: err.message,
                sucess: false
            });
    }
}

const signup = async(req, res) =>{
    try{
        const {name, email, password} = req.body;
        const user = await userModel.findOne({email});

        if(user){
            return res.status(409)
            .json({
                message: "User already exists", 
                success: false
            });
        }

        const newUser = new userModel({name, email, password});
        newUser.password = await bcrypt.hash(password, 10);
        await newUser.save();

        tempOtp=generateOtp(4);
        sendMail(email, tempOtp);

        res.status(201)
            .json({
                message: "Signup sucessfull, OTP sent to your email!!",
                success:true
            });

    }catch(err){
        res.status(500)
            .json({
                message: "An error occured",
                error: err.message,
                sucess: false
            });
        }
}

const otp = async (req, res) => {

    const { otp } = req.body;
    
    if(otp==tempOtp){
        res.status(202)
        .json({
            success:true
        });
    }
    else{
        console.log(tempOtp);
        res.status(504)
        .json({
            message: "Wrong OTP!!",
            sucess: false
        });   
    }
}

let temporaryStore = {}; 
const reset = async (req, res) => {
    try {
        const { source, data } = req.body;

        if (source === "email") {
            const email = data;
            const user = await userModel.findOne({ email });

            console.log(email);

            if (!user) {
                return res.status(409).json({
                    message: "No account found!",
                    success: false,
                });
            }

            temporaryStore.email = email;

            tempOtp = generateOtp(4); 
            sendMail(email, tempOtp); 

            res.status(201).json({
                message: "OTP sent to your email!",
                success: true,
            });

        } else if (source === "pass") {

            const email = temporaryStore.email;
            if (!email) {
                return res.status(400).json({
                    message: "Email not found. Please request a reset first.",
                    success: false,
                });
            }

            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    message: "User not found!",
                    success: false,
                });
            }

            const hashedPassword = await bcrypt.hash(data, 10); 
            user.password = hashedPassword; 
            await user.save();

            temporaryStore = {}; 

            res.status(200).json({
                message: "Password updated successfully.",
                success: true,
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "An error occurred",
            error: err.message,
            success: false,
        });
    }
};

module.exports = {
    login,
    signup,
    otp,
    reset
};