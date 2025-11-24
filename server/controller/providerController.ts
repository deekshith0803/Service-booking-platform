import { Request, Response } from 'express';
import fs from 'fs';
import imagekit from '../config/imageKit';
import User from '../model/User';
import Service from '../model/service';
import { UserDocument } from '../model/User';
import { ServiceDocument } from '../model/service';
import Booking from '../model/Booking';

// Extend Express Request interface to include Multer file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
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

// api to list provider services
export const getProviderService = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const _id = req.user;
    const service = await Service.find({ provider: _id });
    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error('Error in getProviderService:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

//api to toggle service availability
export const toggleServiceAvailability = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;
    const { serviceId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.title.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    service.availability = !service.availability;
    await service.save();

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//api to delete service
export const deleteService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { serviceId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // fetch the service first (do NOT update before ownership check)
    const service = await Service.findById(serviceId).exec() as ServiceDocument | null;

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // --- Ownership check ---
    // Adjust the field below to whatever field in your Service model stores the owner's user id:
    // common names: owner, createdBy, user, seller, author, etc.
    const ownerField = (service as any).owner ?? (service as any).createdBy ?? (service as any).user;

    if (!ownerField) {
      // no owner field found on service model — treat as unauthorized / bad data
      return res.status(400).json({ success: false, message: "Service owner not defined" });
    }

    // ownerField may be an ObjectId or a string — compare as strings
    if (ownerField.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this service" });
    }

    // --- Perform deletion or soft-delete ---
    // Option A: Hard delete
    // await service.remove();

    // Option B: Soft-delete (preserve doc but mark as inactive) — adjust fields to match your schema
    service.title = null as any;
    (service as any).isAvailable = false;
    (service as any).deletedAt = new Date(); // optional
    await service.save();

    return res.status(200).json({ success: true, message: "Service deleted", service });
  } catch (error) {
    console.error("Error in deleteService:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//api to get dashboard data
export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // guard against missing user
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const userId = user._id;
    const role = user.role;

    if (role !== "provider") {
      return res.status(403).json({ success: false, message: "You are not authorized to get dashboard data" });
    }

    // find services where provider field references this user
    const services = await Service.find({ provider: userId }).exec();


    return res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

