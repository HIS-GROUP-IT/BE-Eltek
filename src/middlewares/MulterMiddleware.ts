import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { HttpException } from "@/exceptions/HttpException";

// Ensure the uploads directory exists
const uploadDir = "leaves/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage (temporary local storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Initialize Multer
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
}).array("files", 10); // Allow up to 10 files

/**
 * Middleware to handle multiple file uploads
 */
const multerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, (error: any) => {
        if (error instanceof multer.MulterError) {
            return next(new HttpException(400, error.message));
        } else if (error) {
            return next(new HttpException(400, "Error uploading files."));
        }

        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return next(new HttpException(400, "No files uploaded"));
        }

        next();
    });
};

export default multerMiddleware;
