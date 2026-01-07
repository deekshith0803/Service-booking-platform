import { Request, Response } from 'express';
import fs from 'fs';
import imagekit from '../config/imageKit.js';
import User from '../model/User.js';
import Service from '../model/Service.js';
import { UserDocument } from '../model/User.js';
import { ServiceDocument } from '../model/Service.js';
import Booking from '../model/Booking.js';

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
    // ---------- AUTH ----------
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "Only providers can add services",
      });
    }

    // ---------- SERVICE DATA ----------
    let serviceData: any;
    try {
      serviceData =
        typeof req.body.service === "string"
          ? JSON.parse(req.body.service)
          : req.body.service;
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid service data format",
      });
    }

    // ---------- REQUIRED FIELD CHECK ----------
    if (
      !serviceData?.title ||
      !serviceData?.description ||
      !serviceData?.category ||
      !serviceData?.pricePerHour ||
      !serviceData?.serviceArea
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required service fields",
      });
    }

    // ---------- IMAGE ----------
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/services",
    });

    const optimizedImageUrl = imagekit.url({
      path: uploadResponse.filePath,
      transformation: [
        { width: "1200" },
        { quality: "80" },
        { format: "webp" },
      ],
    });

    // ---------- CREATE SERVICE (EXPLICIT MAPPING) ----------
    const service = await Service.create({
      provider: req.user._id,

      title: serviceData.title,
      description: serviceData.description,
      category: serviceData.category,

      price: serviceData.pricePerHour,          // 🔥 mapped
      service_area: serviceData.serviceArea,    // 🔥 mapped

      staffCount: serviceData.staffCount ?? 1,
      toolProvided: serviceData.toolsProvided ?? false,

      image: optimizedImageUrl,
    });

    // ---------- CLEANUP ----------
    fs.unlink(imageFile.path, () => { });

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
      service,
    });

  } catch (error: any) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Service validation failed",
        errors: Object.keys(error.errors),
      });
    }

    console.error("Error in addService:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// api to list provider services
export const getProviderService = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const services = await Service.find({
      provider: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      service: services,
    });
  } catch (error) {
    console.error("Error in getProviderService:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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

    if (service.provider.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    service.availability = !service.availability;
    await service.save();

    res.status(200).json({
      success: true,
      message: "Service availability updated",
      service,
    });
  } catch (error) {
    console.error("toggleServiceAvailability:", error);
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

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    if (service.provider.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Service.findByIdAndDelete(serviceId);

    return res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("deleteService:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// api to get dashboard data
export const getDashboardData = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    // ---------- AUTH ----------
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (user.role !== "provider") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access dashboard data",
      });
    }

    const userId = user._id;

    // ---------- FETCH DATA ----------
    const services = await Service.find({ provider: userId });

    const bookings = await Booking.find({ provider: userId })
      .populate("service")
      .sort({ createdAt: -1 });

    // ---------- COUNTS ----------
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    );

    const completedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    );

    // ---------- MONTHLY REVENUE ----------
    const now = new Date();

    const monthlyRevenue = completedBookings
      .filter((b) => {
        const created = new Date(b.createdAt);
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, b) => sum + b.price, 0);

    // ---------- RESPONSE ----------
    const dashboardData = {
      totalServices: services.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 4),
      monthlyRevenue,
    };

    return res.status(200).json({
      success: true,
      dashboardData,
    });

  } catch (error) {
    console.error("Error in getDashboardData:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


//api to update user image
export const updateUserImage = async (req: MulterRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/users',
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: '1200' },
        { quality: '80' },
        { format: 'webp' },
      ],
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(
      userId,
      { image },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'User image updated successfully' });

  } catch (error) {
    console.error("Error in updateUserImage:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
