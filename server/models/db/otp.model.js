import mongoose from "mongoose";

const otpSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: String,
    otp: { type: String, required: true },
    status: String,
})

const Otp = mongoose.model('otp', otpSchema);

export default Otp;

