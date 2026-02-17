import { useEffect, useState } from "react";
import productService from "../../api/productService";
import { Link, useNavigate } from "react-router";
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
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table"); // table or cards
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const productsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, search, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getActiveProducts();
      if (res) {
        setProducts(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.productCode?.toString().includes(search) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "pricePerDay") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
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

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Bulk selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === paginatedProducts.length
        ? []
        : paginatedProducts.map(p => p.id)
    );
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'text-green-600 bg-green-50';
      case 'rented': return 'text-blue-600 bg-blue-50';
      case 'maintenance': return 'text-yellow-600 bg-yellow-50';
      case 'inactive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return <CheckCircle className="w-4 h-4" />;
      case 'rented': return <Package className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
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
        <Package className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p className="text-gray-500 mb-6">
        {search || selectedCategory !== "all" || selectedStatus !== "all"
          ? "Try adjusting your search or filters"
          : "Get started by adding your first product"}
      </p>
      {!search && selectedCategory === "all" && selectedStatus === "all" && (
        <Link
          to="/products/add"
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Product
        </Link>
      )}
    </div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">#{product.productCode}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(product.status)}`}>
            {getStatusIcon(product.status)}
            <span className="capitalize">{product.status || 'Unknown'}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily Rate</span>
            <span className="font-semibold text-lg text-gray-900">₹{product.pricePerDay}</span>
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}`);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}/edit`);
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Product"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">
            {product.category || 'Uncategorized'}
          </span>
        </div>
      </div>
    </div>
  );

  // Stats calculation
  const stats = {
    total: products.length,
    available: products.filter(p => p.status?.toLowerCase() === 'available').length,
    rented: products.filter(p => p.status?.toLowerCase() === 'rented').length,
    revenue: products.reduce((sum, p) => sum + (parseFloat(p.pricePerDay) || 0), 0)
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Management</h1>
              <p className="text-gray-600">Manage your rental inventory and track product performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchProducts}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <Link
                to="/products/add"
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Available</p>
                  <p className="text-2xl font-bold text-green-900">{stats.available}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Currently Rented</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.rented}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Avg. Daily Rate</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ₹{stats.total > 0 ? Math.round(stats.revenue / stats.total) : 0}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-[35%] w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, code, or description..."
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="camera">Camera</option>
                    <option value="laptop">Laptop</option>
                    <option value="gaming">Gaming</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <div className="flex space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="name">Name</option>
                      <option value="productCode">Product Code</option>
                      <option value="pricePerDay">Price</option>
                      <option value="status">Status</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedProducts.length > 0 && (
          <div className="bg-orange-600 text-white rounded-xl p-4 flex items-center justify-between">
            <span className="font-medium">
              {selectedProducts.length} product{selectedProducts.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Export
              </button>
              <button className="px-4 py-2 bg-orange-700 rounded-lg hover:bg-orange-800 transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Bulk Update
              </button>
            </div>
          </div>
        )}

        {/* Products Display */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Daily Rate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {product.description && (
                              <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        #{product.productCode}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">
                        {product.category || 'Uncategorized'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{product.pricePerDay}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1 capitalize">{product.status || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/products/${product.id}/edit`)}
                            className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedProducts.length === 0 && (
              <EmptyState />
            )}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > productsPerPage && (
          <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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
