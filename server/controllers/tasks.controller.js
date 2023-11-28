import Mongoose from 'mongoose';
import jwtDecode from 'jwt-decode';
import Tasks from '../models/db/tasks.model';
import { validateTasks } from '../helpers/validations/tasks.validation';
import { taskBody } from '../models/body/tasks.body';
import 'dotenv/config';
import fs from 'fs';

export const createTask = async (req, res) => {
    try {
        const { name,startDate, endDate, assignee, projectName ,projectDescription, priority } = req.body;
        const { error } = validateTasks(taskBody(req));
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;

        if(error){
            return res.status(400).json({
                message: error.details[0].message.replace(/"/g, '')
            })
        }

        const results = await Tasks.find({ name });

        if(results.length > 0) {
            return res.status(409).json({
                message: 'Task name taken, please use another name',
            });
        }

        const created = await Tasks.create({
            _id: new Mongoose.Types.ObjectId(),
            name,
            startDate,
            endDate,
            assignee,
            projectName,
            projectDescription,
            priority,
            createdAt: new Date(),
            createdBy: user._id,
        });

        if(created){
            res.status(201).json({
                message: 'Tasks Created successfully',
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

export const getTasks = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;

        const page = parseInt(req.query.page) || 1;
        const count = 12
        const skip = (page - 1) * count;
        const results = await Tasks.find({ createdBy: user._id }).skip(skip).limit(count);
        const totalDocuments = await Tasks.countDocuments({ createdBy: user._id });
        const totalPages = Math.ceil(totalDocuments / count);

        let next = null;
        let previous = null;

        const baseUrl = process.env.BASEURL;
        if(page < totalPages){
            nextLink = `${baseUrl}/api/tasks?page=${page + 1}`;
        }

        if(page > 1){
            prevLink = `${baseUrl}/api/tasks?page=${page - 1}`;
        }


        return res.status(200).json({
            results,
            next,
            previous
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error
        })
    }
}

export const editTasks = async (req, res) => {
    try {
        const { name,startDate, endDate, assignee, projectName ,projectDescription,priority, files, id } = req.body;
        const token = req.headers.authorization;
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;

        const results = await Tasks.find({ name });

        if(results.length > 0) {
            return res.status(409).json({
                message: 'Task name taken, please use another name',
            });
        }

        const created = await Tasks.findByIdAndUpdate(id,{ 
            name,
            startDate,
            endDate,
            assignee,
            projectName,
            projectDescription,
            priority,
            files,
        })

        if(created){
            res.status(201).json({
                message: 'Tasks Updated successfully',
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

export const deleteTasks = async () => {
    try {
        const id = req.query.id;
        const results = await Tasks.deleteOne({ _id: id });
        if(results){
            res.status(201).json({
                message: 'Tasks Updated successfully',
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
