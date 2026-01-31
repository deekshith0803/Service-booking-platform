import Booking from "../model/Booking.js"
import { Request, Response } from "express";
import Service from "../model/Service.js";
import crypto from "crypto";


// function to check if the service is available for a date
export const checkAvailability = async (serviceId: string, date: Date) => {
    const serviceData = await Service.findById(serviceId);
    if (!serviceData) return false;

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[targetDate.getDay()];

    // Get capacity for this specific day of the week
    const dayCapacity = (serviceData.dailyCapacity as any)[dayName] ?? 1;

    // Find all bookings for this provider on this specific date
    const dayStart = new Date(targetDate);
    const dayEnd = new Date(targetDate);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const bookingsCount = await Booking.countDocuments({
        provider: serviceData.provider,
        date: { $gte: dayStart, $lt: dayEnd },
        status: { $ne: "cancelled" }
    });

    if (bookingsCount >= dayCapacity) {
        return false;
    }

    return true;
}

// Api to check availability of service fot the given date and time
export const checkAvailabilityOfService = async (req: Request, res: Response) => {
    try {
        const { service_area, date, time } = req.body;
        const bookingDate = new Date(date);

        const services = await Service.find({ service_area, availability: true });
        const availableServicesPromises = services.map(async (service: any) => {
            const isAvailable = await checkAvailability(service._id.toString(), bookingDate);
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
export const createBooking = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const { service, date, time, notes, address, phone, paymentId, orderId, signature } = req.body;

        if (!service || !date || !time || !address || !phone) {
            return res.status(400).json({ success: false, message: "Missing required fields: service, date, address, and phone" });
        }

        const serviceData = await Service.findById(service);
        if (!serviceData) {
            return res.status(404).json({ success: false, message: "Service not found" });
        }

        const bookingDate = new Date(date);
        const isAvailable = await checkAvailability(service, bookingDate);

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Provider is fully booked for this day" });
        }

        // Verify Payment if payment details are provided
        let paymentStatus = "pending";
        let finalPaymentId = paymentId || "";

        if (req.body.paymentMethod === "cod") {
            finalPaymentId = "COD";
            paymentStatus = "pending";
        } else if (paymentId && orderId && signature) {
            const body = orderId + "|" + paymentId;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
                .update(body.toString())
                .digest("hex");

            if (expectedSignature === signature) {
                paymentStatus = "paid";
            } else {
                return res.status(400).json({ success: false, message: "Invalid payment signature" });
            }
        }

        // Fixed Price for the work
        const calculatedPrice = serviceData.price;

        const booking = await Booking.create({
            service: serviceData._id,
            user: req.user._id,
            provider: serviceData.provider,
            date: bookingDate,
            time,
            price: calculatedPrice,
            status: "pending",
            notes: notes || "",
            address,
            phone,
            paymentId: finalPaymentId,
            orderId: orderId || "",
            paymentStatus,
            paymentMethod: req.body.paymentMethod === "cod" ? "cod" : "online"
        });

        res.status(201).json({ success: true, booking, message: "Booking created successfully" });
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

        // Update status using findByIdAndUpdate to avoid validation errors on old documents
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        res.json({ success: true, message: "Status updated successfully", booking: updatedBooking });
    } catch (error: any) {
        console.error("Error in changeBookingStatus:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

// API to mark booking as paid (for COD)
export const markBookingAsPaid = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        if (req.user.role !== "provider") {
            return res.status(403).json({ success: false, message: "Unauthorized: Only providers can perform this action" });
        }

        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ success: false, message: "Booking ID is required" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.provider.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized: You can only update your own bookings" });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { paymentStatus: "paid" },
            { new: true }
        );

        res.json({ success: true, message: "Payment status updated to Paid", booking: updatedBooking });
    } catch (error: any) {
        console.error("Error in markBookingAsPaid:", error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
}

// API to check availability for all slots of a specific service on a specific date
export const getServiceAvailabilityForDate = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;
        const { date } = req.query;
        if (!date) return res.status(400).json({ success: false, message: "Date is required" });

        const bookingDate = new Date(date as string);
        const isAvailable = await checkAvailability(serviceId, bookingDate);

        res.json({ success: true, isAvailable });
    } catch (error) {
        console.error("Error in getServiceAvailabilityForDate:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// API to check availability for a range of dates (e.g., next 7 days)
export const getServiceAvailabilityRange = async (req: Request, res: Response) => {
    try {
        const { serviceId } = req.params;
        const { startDate, days } = req.query;

        if (!startDate) return res.status(400).json({ success: false, message: "startDate is required" });
        const numDays = parseInt(days as string) || 7;

        const results = [];
        const start = new Date(startDate as string);

        for (let i = 0; i < numDays; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);
            const isAvailable = await checkAvailability(serviceId, current);
            results.push({
                date: current.toISOString().split('T')[0],
                isAvailable
            });
        }

        res.json({ success: true, availability: results });
    } catch (error) {
        console.error("Error in getServiceAvailabilityRange:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};