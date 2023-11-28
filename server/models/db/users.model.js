import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    phone: String,
    password: String,
    status: String,
})

const usersModel = mongoose.model('users', usersSchema);

export default usersModel;

