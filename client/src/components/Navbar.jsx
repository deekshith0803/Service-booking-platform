import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const {
    setShowLogin,
    user,
    logout,
    isProvider,
    setIsProvider,
    axios,
    fetchUser,
  } = useAppContext();

  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/provider/change-role");
      if (data.success) {
        toast.success("Request sent to admin for approval");
        fetchUser(); // Refresh user data
      } else {
        toast.error(data.message || "Unable to change role");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"
      );
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/services?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 left-0 w-full z-50 border-b border-borderColor bg-white
      ${location.pathname === "/" ? "bg-light" : ""}`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4">

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)}>
          <motion.img
            src={assets.logo}
            alt="logo"
            className="h-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-8">
          {user?.email === "deekshithm321@gmail.com" ? (
            <>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Link to="/admin?tab=stats">Stats</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Link to="/admin?tab=users">Users</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Link to="/admin?tab=providers">Providers</Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Link to="/admin?tab=bookings">Bookings</Link>
              </motion.div>
            </>
          ) : (
            menuLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <Link to={link.path}>{link.name}</Link>
              </motion.div>
            ))
          )}

          {/* Search */}
          {user?.email !== "deekshithm321@gmail.com" && (
            <div className="hidden lg:flex items-center gap-2 text-sm border border-borderColor px-4 py-1 rounded-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search services"
                className="py-1.5 w-full bg-transparent outline-none"
              />
              <img src={assets.search_icon} alt="search" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user?.email !== "deekshithm321@gmail.com" && (
              <motion.button
                whileHover={!user?.isProviderRequested ? { scale: 1.05 } : {}}
                disabled={user?.isProviderRequested && !isProvider}
                onClick={() => (isProvider ? navigate("/provider") : changeRole())}
                className={user?.isProviderRequested && !isProvider ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isProvider ? "Dashboard" : user?.isProviderRequested ? "Pending Approval" : "List your service"}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => (user ? logout() : setShowLogin(true))}
              className="px-8 py-2 bg-primary text-white rounded-full font-medium"
            >
              {user ? "Logout" : "Login"}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="sm:hidden" onClick={() => setOpen(!open)}>
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`sm:hidden fixed top-16 right-0 h-screen w-full p-6
            ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
          >
            <div className="flex flex-col gap-6">
              {user?.email === "deekshithm321@gmail.com" ? (
                <>
                  <Link to="/admin?tab=stats" onClick={() => setOpen(false)}>Stats</Link>
                  <Link to="/admin?tab=users" onClick={() => setOpen(false)}>Users</Link>
                  <Link to="/admin?tab=providers" onClick={() => setOpen(false)}>Providers</Link>
                  <Link to="/admin?tab=bookings" onClick={() => setOpen(false)}>Bookings</Link>
                </>
              ) : (
                menuLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    onClick={() => setOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))
              )}

              {user?.email !== "deekshithm321@gmail.com" && (
                <button
                  disabled={user?.isProviderRequested && !isProvider}
                  onClick={() =>
                    isProvider ? (navigate("/provider"), setOpen(false)) : changeRole()
                  }
                  className={user?.isProviderRequested && !isProvider ? "opacity-50" : ""}
                >
                  {isProvider ? "Dashboard" : user?.isProviderRequested ? "Pending Approval" : "List your service"}
                </button>
              )}

              <button
                onClick={() => {
                  user ? logout() : setShowLogin(true);
                  setOpen(false);
                }}
                className="px-8 py-2 bg-primary text-white rounded-full"
              >
                {user ? "Logout" : "Login"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
