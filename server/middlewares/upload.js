import multer from "multer";
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const __basedir = process.cwd();
        cb(null, __basedir + "/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

const uploadFiles = (req, res, next) => {
    upload.array('files', 5)(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const files = req.files;
        const errors = [];

        files.forEach(file => {
            const maxSize = 100 * 1024 * 1024;

            if (!allowedTypes.includes(file.mimetype)) {
                errors.push(`Invalid file type: ${file.originalname}`);
            }

            if (file.size > maxSize) {
                errors.push(`File too large: ${file.originalname}`);
            }
        });

        if (errors.length > 0) {

        files.forEach((file) => {
            fs.unlinkSync(file.path);
        });

        return res.status(400).json({ errors });
        }

        req.files = files;

        next();
    });
}

export default uploadFiles;
