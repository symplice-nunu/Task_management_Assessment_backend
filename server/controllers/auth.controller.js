import Mongoose from 'mongoose';
import { createUser, loginUser, otp, recoverPassword } from '../models/body/user.body';
import User from '../models/db/users.model';
import jwtDecode from 'jwt-decode';
import { validateForgot, validateLogin, validateNewPassword, validateSignUp } from '../helpers/validations/auth.validation';
import { comparePassword, generateToken, hashPassword } from '../helpers/authenticate';
import Otp from '../models/db/otp.model';

export const signup = async(req, res) => {
    try {
        const { phone, name, password } = req.body;
        const { error } = validateSignUp(createUser(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const results = await User.find({ phone });

        if(results.length > 0) {
            return res.status(409).json({
                message: 'Mobile phone number is already used, please try another',
            })
        }

        const hashedPassword = hashPassword(password);
        const created = await User.create({
            _id: new Mongoose.Types.ObjectId(),
            name,
            phone,
            password: hashedPassword,
            status: 'active'
        })
        if(created){
            res.status(201).json({
                message: 'User Created successfully',
                token: generateToken(created),
            });
            return false;
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const { error } = validateLogin(loginUser(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const results = await User.findOne({ phone });

        if(!results){
            return res.status(401).json({
                message: 'Invalid phone number or password',
            });
        };

        if(results.status === 'deactivated'){
            return res.status(401).json({
                message: 'Your Account is Suspended, please contact the support team for help.',
            });
        }

        const isPasswordTrue = comparePassword(password, results.password);
        if(!isPasswordTrue){
            return res.status(401).json({
                message: 'Invalid username or password',
            });
        }

        return res.status(201).json({
            token: generateToken({ 
                _id: results._id,
                name: results.name,
                phone: results.phone,
                status: results.status,
            }),
            userInfo: {
                _id: results._id,
                name: results.name,
                phone: results.phone,
                status: results.status,
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        const { error } = validateForgot(otp(req));

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }
        const generateOTP = () => {
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++ ) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        }
        const OTP = generateOTP()

        const user = await User.findOne({ phone });

        if(!user){
            return res.status(404).json({
                message: 'User not found, please check your phone number and try again.',
            });
        }

        const created = await Otp.create({
            _id: new Mongoose.Types.ObjectId(),
            userId: user._id,
            otp: '000000',
            status: 'pending',
        });

        if(created){
            //Send to the email or phone number
            return res.status(200).json({
                message: 'Otp sent to your phone number'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;

        const otpUsed = await Otp.findOne({ otp });
        if(otpUsed.status === 'verified'){
            return res.status(400).json({
                message: 'OTP is Invalid.'
            })
        }
        const otpValid = await Otp.findOneAndUpdate({ otp }, { status: 'verified' });
        if(!otpValid){
            return res.status(400).json({
                message: "OTP is Invalid.",
            })
        }

        return res.status(200).json({
            message: 'OTP Verified',
            otp
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, phone } = req.body;
        const { error } = validateNewPassword(recoverPassword(req));
        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const changes = await User.findOneAndUpdate({ phone }, { password: hashPassword(newPassword) });
        if(changes){
            return res.status(200).json({
                message: 'Password recovered successfully.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, phone, password } = req.body;
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        const hashedPassword = hashPassword(password)
        const updated = await User.findByIdAndUpdate(decodedToken.user._id, { name, phone, password: hashedPassword });

        if(updated){
            return res.status(200).json({
                message: 'Profile Updated successfully.'
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
} 

