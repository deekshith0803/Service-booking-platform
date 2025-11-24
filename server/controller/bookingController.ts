import Booking from "../model/Booking.js"
import { Request, Response } from "express";
import Service from "../model/service.js";
import { error } from "console";
import { populate } from "dotenv";

//functiom to check if the service is available
export const checkAvailability = async (serviceId: string, date: Date, time: string) => {
    const bookings = await Booking.find({
        service: serviceId,
        date: { $gte: date },
        time: { $gte: time },
    });
    return bookings.length === 0
}

// Api to check availability of service fot the given date and time
export const checkAvailabilityOfService = async (req: Request, res: Response) => {
    try {
        const {service_area, date, time} = req.body;
        const services = await Service.find({service_area, availability: true});
        const availableServicesPromises = services.map(async (service) => {
            const isAvailable = await checkAvailability(service._id.toString(), date, time);
            return {
                ...service.toObject(),
                isAvailable,
            };
        });
        let availableService = await Promise.all(availableServicesPromises);
        availableService = availableService.filter((service) => service.isAvailable);
        res.json({ success: true, availableServices: availableService });
    } catch (error) {
        console.error("Error in checkAvailabilityOfService:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//api to create booking
export const createBooling = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const { service, date, time } = req.body;

        // Validate required fields
        if (!service || !date || !time) {
            return res.status(400).json({ success: false, message: "Missing required fields: service, date, and time" });
        }

        // Find service data
        const serviceData = await Service.findById(service);
        if (!serviceData) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        // Check if service is available
        const bookingDate = new Date(date);
        const isAvailable = await checkAvailability(service, bookingDate, time);
        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Service is not available at this time" });
        }

        // Calculate price based on duration
        // Time slots are in format "9-11", "11-1", "2-4", "4-6" (2-hour slots)
        const calculatePrice = (timeSlot: string, pricePerHour: number): number => {
            // Parse time slot to get duration in hours
            const timeParts = timeSlot.split('-');
            if (timeParts.length !== 2) {
                // Default to 2 hours if format is unexpected
                return pricePerHour * 2;
            }
            
            let startHour = parseInt(timeParts[0]);
            let endHour = parseInt(timeParts[1]);
            
            // Handle cases like "11-1" (11 AM to 1 PM)
            if (endHour < startHour) {
                endHour += 12; // Convert to 24-hour format
            }
            
            // Handle 12-hour to 24-hour conversion for afternoon times
            if (startHour < 9) {
                startHour += 12; // Afternoon times
            }
            if (endHour <= 12 && endHour < startHour) {
                endHour += 12;
            }
            
            const duration = endHour - startHour;
            return pricePerHour * duration;
        };

        const calculatedPrice = calculatePrice(time, serviceData.price);

        // Create booking
        const booking = await Booking.create({
            service: serviceData._id,
            user: req.user._id,
            provider: serviceData.provider,
            date: bookingDate,
            time,
            price: calculatedPrice,
            status: "pending"
        });

        res.status(201).json({ success: true, booking, message: "booking created" });
    } catch (error) {
        console.error("Error in createBooking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

///api to list user booking 
export const getUserBooking = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const bookings = await Booking.find({ user: req.user._id })
            .populate("service")
            .populate("provider", "name email image")
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error in getUserBooking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//api to get provider booking
export const getProviderBooking = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Check if user is a provider
        if (req.user.role !== "provider") {
            return res.status(403).json({ success: false, message: "Unauthorized: Only providers can access this resource" });
        }

        const bookings = await Booking.find({ provider: req.user._id })
            .populate("service")
            .populate("user", "name email image")
            .sort({ date: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error("Error in getProviderBooking:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

//api to change booking status
export const changeBookingStatus = async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // Check if user is a provider
        if (req.user.role !== "provider") {
            return res.status(403).json({ success: false, message: "Unauthorized: Only providers can change booking status" });
        }

        const { bookingId, status } = req.body;

        // Validate required fields
        if (!bookingId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields: bookingId and status" });
        }

        // Validate status value
        const validStatuses = ["pending", "confirmed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        // Find booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // Check if the booking belongs to this provider
        if (booking.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only change status of your own bookings" });
        }

        // Update status
        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status updated successfully", booking });
    } catch (error) {
        console.error("Error in changeBookingStatus:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}