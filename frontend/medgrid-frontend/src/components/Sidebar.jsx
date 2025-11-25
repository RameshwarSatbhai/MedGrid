import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import {
  Wifi, WifiOff, Menu, X, User, LogOut, Settings,
  LayoutDashboard, Users, CreditCard, Hospital, Home
} from "lucide-react";

const Sidebar = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { connected } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    ...(isAuthenticated && isStaff
      ? [
          {
            path: "/dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard className="h-5 w-5" />,
          },
          {
            path: "/patients",
            label: "Patients",
            icon: <Users className="h-5 w-5" />,
          },
          {
            path: "/billing",
            label: "Billing",
            icon: <CreditCard className="h-5 w-5" />,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-100 border hover:bg-gray-200"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r shadow-lg z-40
          flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <Hospital className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">MedGrid</span>
        </div>

        {/* Connection Status */}
        {isAuthenticated && (
          <div
            className={`mx-4 mt-4 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
              connected
                ? "text-green-700 border-green-700 bg-green-100"
                : "text-red-700 border-red-700 bg-red-100"
            }`}
          >
            {connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {connected ? "Live" : "Offline"}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col px-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setOpen(false)}>
              <div
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                {link.label}
              </div>
            </Link>
          ))}
        </nav>

        {/* User info bottom section */}
        {isAuthenticated && (
          <div className="mt-auto px-4 py-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-gray-700" />
              <div>
                <p className="font-medium text-gray-800">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="h-4 w-4" />
              Profile Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
