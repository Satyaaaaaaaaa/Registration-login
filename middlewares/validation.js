const joi = require('joi');

const signupValidation = (req, res, next) =>{
    const schema = joi.object({
        name: joi.string().min(3).max(12).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(12).required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({
                message: error.details[0].message,
            })
    }
    next();
}

const loginValidation = (req, res, next) =>{
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(12).required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({
                message: error.details[0].message
            })
    }
    next();
}

const passwordValidation = (req, res, next) => {
    const schema = joi.object({
        password: joi.string().min(6).max(12).required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)
            .json({
                message: error.details[0].message
            })
    }
    next();
}

function generateOtp(length = 4) {

    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}



module.exports = {
    loginValidation,
    signupValidation,
    passwordValidation
}