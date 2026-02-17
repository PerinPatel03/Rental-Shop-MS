import { useLocation, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  User,
  ChevronRight,
  Home,
  Package,
  Users,
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import productService from "../../api/productService";
import customerService from "../../api/customerService";
import bookingService from "../../api/bookingService";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Refs for click outside detection
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Ctrl+K keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault(); // Prevent default browser behavior
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = [];

      // Search products
      try {
        const products = await productService.getActiveProducts();
        const productResults = products
          .filter(product =>
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.productCode?.toString().includes(query) ||
            product.description?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5) // Limit to 5 results per type
          .map(product => ({
            id: product.id,
            type: 'product',
            title: product.name,
            subtitle: `#${product.productCode}`,
            description: product.description,
            icon: Package,
            path: `/products/${product.id}`,
            color: 'orange'
          }));
        results.push(...productResults);
      } catch (error) {
        console.log('Error searching products:', error);
      }

      // Search customers
      try {
        const customers = await customerService.getCustomers();
        const customerResults = customers
          .filter(customer =>
            customer.name?.toLowerCase().includes(query.toLowerCase()) ||
            customer.email?.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone?.includes(query)
          )
          .slice(0, 5)
          .map(customer => ({
            id: customer.id,
            type: 'customer',
            title: customer.name,
            subtitle: customer.email,
            description: customer.phone,
            icon: Users,
            path: `/customers/${customer.id}`,
            color: 'blue'
          }));
        results.push(...customerResults);
      } catch (error) {
        console.log('Error searching customers:', error);
      }

      // Search bookings
      try {
        const bookings = await bookingService.getBookings();
        const bookingResults = bookings
          .filter(booking =>
            booking.bookingId?.toString().includes(query) ||
            booking.customerName?.toLowerCase().includes(query.toLowerCase()) ||
            booking.productName?.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map(booking => ({
            id: booking.bookingId,
            type: 'booking',
            title: `Booking #${booking.bookingId}`,
            subtitle: booking.customerName,
            description: booking.productName,
            icon: Calendar,
            path: `/bookings/${booking.bookingId}`,
            color: 'green'
          }));
        results.push(...bookingResults);
      } catch (error) {
        console.log('Error searching bookings:', error);
      }

      setSearchResults(results);
    } catch (error) {
      console.log('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = (result) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(result.path);
  };

  // Page title mapping based on current route
  const getPageTitle = (pathname) => {
    const titleMap = {
      "/": "Dashboard",
      "/products": "Products",
      "/products/add": "Add Product",
      "/customers": "Customers",
      "/customers/add": "Add Customer",
      "/bookings": "Bookings",
      "/bookings/add": "Add Booking",
      "/payments": "Payments",
      "/analytics": "Analytics",
      "/settings": "Settings"
    };

    // Handle dynamic routes
    if (pathname.startsWith("/products/")) {
      if (pathname.includes("/edit")) return "Edit Product";
      if (pathname !== "/products" && pathname !== "/products/add") return "Product Details";
    }
    if (pathname.startsWith("/customers/") && pathname.includes("/edit")) return "Edit Customer";
    if (pathname.startsWith("/bookings/")) {
      if (pathname.includes("/edit")) return "Edit Booking";
      if (pathname !== "/bookings" && pathname !== "/bookings/add") return "Booking Details";
    }

    return titleMap[pathname] || "Admin Panel";
  };

  // Breadcrumb generation
  const getBreadcrumbs = (pathname) => {
    const crumbs = [{ label: "Dashboard", path: "/", icon: Home }];

    if (pathname === "/") return crumbs;

    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments[0] === "products") {
      crumbs.push({ label: "Products", path: "/products", icon: Package });
      if (pathSegments[1] === "add") {
        crumbs.push({ label: "Add Product", path: "/products/add", icon: null });
      } else if (pathSegments[1] && pathSegments[2] === "edit") {
        crumbs.push({ label: "Product Details", path: `/products/${pathSegments[1]}`, icon: null });
        crumbs.push({ label: "Edit Product", path: pathname, icon: null });
      } else if (pathSegments[1]) {
        crumbs.push({ label: "Product Details", path: pathname, icon: null });
      }
    } else if (pathSegments[0] === "customers") {
      crumbs.push({ label: "Customers", path: "/customers", icon: Users });
      if (pathSegments[1] === "add") {
        crumbs.push({ label: "Add Customer", path: "/customers/add", icon: null });
      } else if (pathSegments[1] && pathSegments[2] === "edit") {
        crumbs.push({ label: "Edit Customer", path: pathname, icon: null });
      }
    } else if (pathSegments[0] === "bookings") {
      crumbs.push({ label: "Bookings", path: "/bookings", icon: Calendar });
      if (pathSegments[1] === "add") {
        crumbs.push({ label: "Add Booking", path: "/bookings/add", icon: null });
      } else if (pathSegments[1] && pathSegments[2] === "edit") {
        crumbs.push({ label: "Booking Details", path: `/bookings/${pathSegments[1]}`, icon: null });
        crumbs.push({ label: "Edit Booking", path: pathname, icon: null });
      } else if (pathSegments[1]) {
        crumbs.push({ label: "Booking Details", path: pathname, icon: null });
      }
    } else if (pathSegments[0] === "payments") {
      crumbs.push({ label: "Payments", path: "/payments", icon: CreditCard });
    } else if (pathSegments[0] === "analytics") {
      crumbs.push({ label: "Analytics", path: "/analytics", icon: null });
    } else if (pathSegments[0] === "settings") {
      crumbs.push({ label: "Settings", path: "/settings", icon: Settings });
    }

    return crumbs;
  };

  const pageTitle = getPageTitle(location.pathname);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Breadcrumbs and Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                  {crumb.icon && <crumb.icon className="w-4 h-4 text-gray-500 mr-1" />}
                  <span
                    className={`font-medium ${
                      index === breadcrumbs.length - 1
                        ? "text-gray-900"
                        : "text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>

            {/* Page Title */}
            <div className="md:hidden">
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {pageTitle}
              </h1>
            </div>
          </div>

          {/* Right Section - Search, Notifications, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="hidden md:flex items-center">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products, customers, bookings..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="mt-3 text-xs text-gray-500">
                        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">K</kbd> for quick search
                      </div>
                    </div>

                    {/* Search Results */}
                    {searchQuery.trim().length >= 2 && (
                      <div className="border-t border-gray-200 max-h-80 overflow-y-auto">
                        {isSearching ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mx-auto mb-2"></div>
                            Searching...
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="py-2">
                            {searchResults.map((result) => (
                              <button
                                key={`${result.type}-${result.id}`}
                                onClick={() => handleSearchResultClick(result)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`p-1.5 rounded-md bg-${result.color}-100 mt-0.5`}>
                                    <result.icon className={`w-4 h-4 text-${result.color}-600`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">
                                      {result.title}
                                    </div>
                                    <div className="text-sm text-gray-600 truncate">
                                      {result.subtitle}
                                    </div>
                                    {result.description && (
                                      <div className="text-xs text-gray-500 truncate">
                                        {result.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No results found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Admin User</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">admin@rentalpro.com</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, customers, bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {/* Mobile Search Results */}
          {searchQuery.trim().length >= 2 && (
            <div className="mt-4 border-t border-gray-200 max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-md bg-${result.color}-100 mt-0.5`}>
                          <result.icon className={`w-4 h-4 text-${result.color}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {result.subtitle}
                          </div>
                          {result.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
