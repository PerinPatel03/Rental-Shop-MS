import { useEffect, useState } from "react";
import customerService from "../../api/customerService";
import { useNavigate } from "react-router";
import {
  Search,
  Plus,
  Filter,
  Grid,
  List,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  User,
  Phone,
  MapPin,
  Mail,
  Calendar,
  RefreshCw,
  Download,
  Upload,
  Users,
  TrendingUp,
  Star,
  CheckCircle
} from "lucide-react";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("customerName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const customersPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, search, selectedStatus, sortBy, sortOrder]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await customerService.getCustomers();
      if (res) {
        setCustomers(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Search filter
    if (search) {
      filtered = filtered.filter(c =>
        c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber?.includes(search) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.address?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(c => c.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + customersPerPage);

  // Bulk selection
  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev =>
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === paginatedCustomers.length
        ? []
        : paginatedCustomers.map(c => c.id)
    );
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty State
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
      <p className="text-gray-600 mb-6">
        {search || selectedStatus !== "all"
          ? "Try adjusting your search or filters"
          : "Get started by adding your first customer"}
      </p>
      {!search && selectedStatus === "all" && (
        <button
          onClick={() => navigate("/customers/add")}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Customer
        </button>
      )}
    </div>
  );

  // Customer Card Component
  const CustomerCard = ({ customer }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {customer.customerName}
              </h3>
              <p className="text-sm text-gray-500">#{customer.id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Active
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{customer.phoneNumber}</span>
          </div>
          {customer.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.address && (
            <div className="flex items-start space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{customer.address}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Joined {new Date(customer.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/customers/${customer.id}/edit`);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Customer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats calculation
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status !== 'inactive').length,
    newThisMonth: customers.filter(c => {
      const createdAt = new Date(c.createdAt);
      const now = new Date();
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
    }).length,
    avgRating: 4.3
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Management</h1>
              <p className="text-gray-600">Manage your customer database and relationships</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCustomers}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/customers/add")}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Customers</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Active Customers</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">New This Month</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.newThisMonth}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Avg. Rating</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.avgRating}</p>
                </div>
                <Star className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-[35%] w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, phone, email, or address..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 border rounded-xl transition-colors ${
                  showFilters ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title="Toggle Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-3 transition-colors ${
                    viewMode === 'table' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-3 transition-colors ${
                    viewMode === 'cards' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title="Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="customerName">Name</option>
                    <option value="phoneNumber">Phone</option>
                    <option value="email">Email</option>
                    <option value="createdAt">Join Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortOrder('asc')}
                      className={`flex-1 px-3 py-2 border rounded-lg font-medium ${
                        sortOrder === 'asc' ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => setSortOrder('desc')}
                      className={`flex-1 px-3 py-2 border rounded-lg font-medium ${
                        sortOrder === 'desc' ? 'bg-orange-600 text-white border-orange-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Descending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedCustomers.length > 0 && (
          <div className="bg-orange-600 text-white rounded-xl p-4 flex items-center justify-between">
            <span className="font-medium">
              {selectedCustomers.length} customer{selectedCustomers.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
              <button className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors">
                <Mail className="w-4 h-4 inline mr-2" />
                Send Email
              </button>
            </div>
          </div>
        )}

        {/* Customers Display */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCustomers.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCustomers.map(customer => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{customer.customerName}</div>
                            <div className="text-sm text-gray-500">ID: {customer.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{customer.phoneNumber}</div>
                        {customer.email && (
                          <div className="text-sm text-gray-500 truncate max-w-32">{customer.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-48 truncate" title={customer.address}>
                          {customer.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit Customer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedCustomers.length === 0 && (
              <EmptyState />
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > customersPerPage && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 mt-8">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + customersPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
