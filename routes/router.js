const express= require('express');
const router = express.Router();
const { loginValidation, signupValidation } = require('../middlewares/validation');
const { login, signup, otp, reset } = require('../controllers/controller')


router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/otp', otp);
router.post('/reset', reset);

module.exports = router;