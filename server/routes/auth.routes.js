import express from 'express';
import { changePassword, forgotPassword, login, signup, updateProfile, verifyOtp } from '../controllers/auth.controller';
import verifyLogin from '../middlewares/verifyLogin';

const routes = express();

routes.post('/signup', signup);
routes.post('/login', login);
routes.post('/forgotpassword', forgotPassword);
routes.post('/changepassword', changePassword);
routes.post('/verifyotp', verifyOtp);
routes.patch('/profile', verifyLogin , updateProfile);

export default routes;
