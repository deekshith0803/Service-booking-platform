import logo from "./logo.png";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg";
import close_icon from "./close_icon.svg";
import users_icon from "./users_icon.svg";
import service_icon from "./car_icon.svg";
import location_icon from "./location_icon.svg";
import fuel_icon from "./fuel_icon.svg";
import addIcon from "./addIcon.svg";
import serviceIcon from "./carIcon.svg";
import serviceIconColored from "./serviceIconColored.png";
import dashboardIcon from "./dashboardIcon.svg";
import dashboardIconColored from "./dashboardIconColored.svg";
import addIconColored from "./addIconColored.svg";
import listIcon from "./listIcon.svg";
import listIconColored from "./listIconColored.svg";
import cautionIconColored from "./cautionIconColored.svg";
import arrow_icon from "./arrow_icon.svg";
import star_icon from "./star_icon.svg";
import check_icon from "./check_icon.svg";
import tick_icon from "./tick_icon.svg";
import delete_icon from "./delete_icon.svg";
import eye_icon from "./eye_icon.svg";
import eye_close_icon from "./eye_close_icon.svg";
import filter_icon from "./filter_icon.svg";
import edit_icon from "./edit_icon.svg";
import calendar_icon_colored from "./calendar_icon_colored.svg";
import location_icon_colored from "./location_icon_colored.svg";
import testimonial_image_1 from "./testimonial_image_1.png";
import testimonial_image_2 from "./testimonial_image_2.png";
import main_service from "./main_service.png";
import banner_service_image from "./banner_service_image.jpeg";
import user_profile from "./user_profile.png";
import upload_icon from "./upload_icon.svg";
import service_image2 from "./service_image2.jpeg";
import service_image1 from "./service_image1.jpeg";
import service_image3 from "./service_image3.jpeg";
import service_image4 from "./service_image4.jpeg";

export const cityList = ["New York", "Los Angeles", "Houston", "Chicago"];

export const assets = {
  logo,
  gmail_logo,
  facebook_logo,
  instagram_logo,
  twitter_logo,
  menu_icon,
  search_icon,
  close_icon,
  users_icon,
  edit_icon,
  service_icon,
  location_icon,
  fuel_icon,
  addIcon,
  serviceIcon,
  serviceIconColored,
  dashboardIcon,
  dashboardIconColored,
  addIconColored,
  listIcon,
  listIconColored,
  cautionIconColored,
  calendar_icon_colored,
  location_icon_colored,
  arrow_icon,
  star_icon,
  check_icon,
  tick_icon,
  delete_icon,
  eye_icon,
  eye_close_icon,
  filter_icon,
  testimonial_image_1,
  testimonial_image_2,
  main_service,
  banner_service_image,
  service_image1,
  upload_icon,
  user_profile,
  service_image2,
  service_image3,
  service_image4,
};

export const menuLinks = [
  { name: "Home", path: "/" },
  { name: "service", path: "/service" },
  { name: "My Bookings", path: "/my-bookings" },
];

export const providerMenuLinks = [
  {
    name: "Dashboard",
    path: "/provider",
    icon: dashboardIcon,
    coloredIcon: dashboardIconColored,
  },
  {
    name: "Add service",
    path: "/provider/add-service",
    icon: addIcon,
    coloredIcon: addIconColored,
  },
  {
    name: "Manage service",
    path: "/provider/manage-service",
    icon: serviceIcon,
    coloredIcon: serviceIconColored,
  },
  {
    name: "Manage Bookings",
    path: "/provider/manage-bookings",
    icon: listIcon,
    coloredIcon: listIconColored,
  },
];

export const dummyUserData = {
  _id: "6847f7cab3d8daecdb517095",
  name: "GreatStack",
  email: "admin@example.com",
  role: "provider",
  image: user_profile,
};

export const dummyserviceData = [
  {
    _id: "67ff5bc069c03d4e45f30b77",
    provider: "67fe3467ed8a8fe17d0ba6e2",
    title: "Home Deep Cleaning",
    category: "Cleaning",
    image: service_image1,
    service_area: "New York",
    pricePerHour: 50,
    duration: "2-4 hours",
    toolsProvided: true,
    staffCount: 3,
    description:
      "Comprehensive deep cleaning service for homes including kitchen, bathrooms, floors, and more. Perfect for seasonal cleaning or moving in/out.",
    isAvailable: true,
    createdAt: "2025-04-16T07:26:56.215Z",
  },
  {
    _id: "67ff6b758f1b3684286a2a65",
    provider: "67fe3467ed8a8fe17d0ba6e2",
    title: "Plumbing & Leak Repair",
    category: "Plumbing",
    image: service_image2,
    service_area: "Chicago",
    pricePerHour: 65,
    duration: "1-3 hours",
    toolsProvided: true,
    staffCount: 1,
    description:
      "Professional plumbing service for fixing pipe leaks, clogged drains, water heater issues, and more. Quick response and reliable work.",
    isAvailable: true,
    createdAt: "2025-04-16T08:33:57.993Z",
  },
  {
    _id: "67ff6b9f8f1b3684286a2a68",
    provider: "67fe3467ed8a8fe17d0ba6e2",
    title: "Air Conditioner Repair",
    category: "Electrical",
    image: service_image3,
    service_area: "Los Angeles",
    pricePerHour: 80,
    duration: "2-5 hours",
    toolsProvided: false,
    staffCount: 2,
    description:
      "Experienced technician for AC repair, servicing, and gas refill. Suitable for both window and split AC units.",
    isAvailable: true,
    createdAt: "2025-04-16T08:34:39.592Z",
  },
  {
    _id: "68009c93a3f5fc6338ea7e34",
    provider: "67fe3467ed8a8fe17d0ba6e2",
    title: "Furniture Assembly",
    category: "Handyman",
    image: service_image4,
    service_area: "Houston",
    pricePerHour: 40,
    duration: "1-2 hours",
    toolsProvided: false,
    staffCount: 2,
    description:
      "Quick and efficient assembly of IKEA and other flat-pack furniture. Includes shelves, desks, beds, and more.",
    isAvailable: true,
    createdAt: "2025-04-17T06:15:47.318Z",
  },
];

export const dummyMyBookingsData = [
  {
    id: "68482bcc98eb9722b7751f70",
    service: dummyserviceData[0],
    serviceId: "67ff5bc069c03d4e45f30b77",
    category: "Cleaning",
    service_area: "New York",
    pricePerHour: 50,
    duration: "2-4 hours",
    toolsProvided: true,
    staffCount: 3,
    userId: "6847f7cab3d8daecdb517095",
    providerId: "6847f7cab3d8daecdb517095",
    pickupDate: "2025-06-13",
    returnDate: "2025-06-14",
    status: "confirmed",
    price: 440,
    bookedAt: "2025-06-10T12:57:48.244Z",
  },
  {
    id: "68482bb598eb9722b7751f60",
    service: dummyserviceData[1],
    serviceId: "67ff6b758f1b3684286a2a65",
    category: "Plumbing",
    service_area: "Chicago",
    pricePerHour: 65,
    duration: "1-3 hours",
    toolsProvided: true,
    staffCount: 1,
    userId: "6847f7cab3d8daecdb517095",
    providerId: "67fe3467ed8a8fe17d0ba6e2",
    pickupDate: "2025-06-12",
    returnDate: "2025-06-12",
    status: "pending",
    price: 130,
    bookedAt: "2025-06-10T12:57:25.613Z",
  },
  {
    id: "684800fa0fb481c5cfd92e56",
    service: dummyserviceData[2],
    serviceId: "67ff6b9f8f1b3684286a2a68",
    category: "Electrical",
    service_area: "Los Angeles",
    pricePerHour: 80,
    duration: "2-5 hours",
    toolsProvided: false,
    staffCount: 2,
    userId: "6847f7cab3d8daecdb517095",
    providerId: "67fe3467ed8a8fe17d0ba6e2",
    pickupDate: "2025-06-11",
    returnDate: "2025-06-12",
    status: "pending",
    price: 600,
    bookedAt: "2025-06-10T09:55:06.379Z",
  },
  {
    id: "6847fe790fb481c5cfd92d94",
    service: dummyserviceData[3],
    serviceId: "68009c93a3f5fc6338ea7e34",
    category: "Handyman",
    service_area: "Houston",
    pricePerHour: 40,
    duration: "1-2 hours",
    toolsProvided: false,
    staffCount: 2,
    userId: "6847f7cab3d8daecdb517095",
    providerId: "6847f7cab3d8daecdb517095",
    pickupDate: "2025-06-11",
    returnDate: "2025-06-12",
    status: "confirmed",
    price: 440,
    bookedAt: "2025-06-10T09:44:25.410Z",
  },
];

export const dummyDashboardData = {
  totalService: 4,
  totalBookings: 2,
  pendingBookings: 0,
  completedBookings: 2,
  recentBookings: [dummyMyBookingsData[0], dummyMyBookingsData[1]],
  monthlyRevenue: 840,
};

export const serviceCategories = [
  "Electrical",
  "Plumbing",
  "Cleaning",
  "Appliance Repair",
  "Painting",
  "Carpentry",
  "Pest Control",
  "AC Services",
  "Gardening",
  "Other",
];
