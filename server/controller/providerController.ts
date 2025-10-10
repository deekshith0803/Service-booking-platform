import { Request, Response } from 'express';
import fs from 'fs';
import imagekit from '../config/imageKit';
import User from '../model/User';
import Service from '../model/service';

// Extend Express Request interface to include Multer file
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

// Change user role to provider
export const changeRollToProvider = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { _id } = req.user;

        const updatedUser = await User.findByIdAndUpdate(
            _id,
            { role: 'provider' },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'Role changed to provider' });
    } catch (error) {
        console.error('Error in changeRollToProvider:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add a new service
export const addService = async (req: MulterRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const { _id } = req.user;
        if (req.user.role !== 'provider') {
            return res.status(403).json({ success: false, message: 'Only providers can add services' });
        }

        const serviceData = JSON.parse(req.body.service);
        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/services',
        });

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1200' },
                { quality: '80' },
                { format: 'webp' },
            ],
        });

        const service = await Service.create({
            ...serviceData,
            provider: _id,
            image: optimizedImageUrl,
        });

        try {
            fs.unlinkSync(imageFile.path);
        } catch (unlinkError) {
            console.warn('Failed to delete temporary file:', unlinkError);
        }

        res.status(201).json({ success: true, message: 'Service added successfully', service });
    } catch (error) {
        console.error('Error in addService:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};