import mongoose from "mongoose";

const tasksSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    startDate: String,
    endDate: String,
    assignee: Array,
    projectName: String,
    projectDescription: String,
    priority: String,
    files: Array,
    createdBy: String,
    createdAt: Date,
})

const Tasks = mongoose.model('Tasks', tasksSchema);

export default Tasks;
