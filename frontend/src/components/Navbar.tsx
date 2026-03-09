import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Route, Boxes, Rocket } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/journey", label: "Journey", icon: Route },
    { path: "/toolkit", label: "Toolkit", icon: Boxes },
  ];

  return (
    <nav className="bg-white border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-lg font-bold text-indigo-600 gap-2"
            >
              <Rocket className="w-6 h-6" />
              <span>DevOps HQ</span>
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
