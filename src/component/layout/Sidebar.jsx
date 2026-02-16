import { NavLink, useLocation } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Store,
  Plus,
  List,
  Settings,
  BarChart3
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    products: location.pathname.startsWith('/products'),
    customers: location.pathname.startsWith('/customers'),
    bookings: location.pathname.startsWith('/bookings'),
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isSectionActive = (section) => {
    return location.pathname.startsWith(`/${section}`);
  };

  const NavItem = ({ to, children, icon: Icon, className = "" }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
            : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-1"
        } ${className}`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{children}</span>
    </NavLink>
  );

  const SectionHeader = ({ title, icon: Icon, section, children }) => {
    const isActive = isSectionActive(section);
    const isExpanded = expandedSections[section];

    return (
      <div className="space-y-1">
        <button
          onClick={() => toggleSection(section)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border-l-4 border-orange-500"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform duration-200" />
          )}
        </button>

        {isExpanded && (
          <div className="ml-6 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl border-r border-gray-700 flex flex-col min-h-auto">
      {/* Brand Section */}
      <div className="p-3.5 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg">
            <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              RentalPro
            </h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <NavItem to="/" icon={LayoutDashboard}>
          Dashboard
        </NavItem>

        {/* Products Section */}
        <SectionHeader title="Products" icon={Package} section="products">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/products"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <List className="w-4 h-4" />
            All Products
          </NavLink>
          <NavLink
            to="/products/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/products/add"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <Plus className="w-4 h-4" />
            Add Product
          </NavLink>
        </SectionHeader>

        {/* Customers Section */}
        <SectionHeader title="Customers" icon={Users} section="customers">
          <NavLink
            to="/customers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/customers"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <List className="w-4 h-4" />
            All Customers
          </NavLink>
          <NavLink
            to="/customers/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/customers/add"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </NavLink>
        </SectionHeader>

        {/* Bookings Section */}
        <SectionHeader title="Bookings" icon={Calendar} section="bookings">
          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/bookings"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <List className="w-4 h-4" />
            All Bookings
          </NavLink>
          <NavLink
            to="/bookings/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                location.pathname === "/bookings/add"
                  ? "bg-orange-500/20 text-orange-300 border-l-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              }`
            }
          >
            <Plus className="w-4 h-4" />
            Add Booking
          </NavLink>
        </SectionHeader>

        {/* Payments */}
        <NavItem to="/payments" icon={CreditCard}>
          Payments
        </NavItem>

        {/* Analytics/Reports (Future Enhancement) */}
        {/* <div className="pt-4 border-t border-gray-700">
          <NavItem to="/analytics" icon={BarChart3} className="opacity-60">
            Analytics
            <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded-full">Soon</span>
          </NavItem>
        </div> */}
      </nav>
          
      {/* Footer */}
      <div className="p-2 border-t border-gray-700">
        <NavLink
          // to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
