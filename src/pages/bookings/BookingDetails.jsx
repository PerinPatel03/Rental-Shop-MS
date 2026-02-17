import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import bookingService from "../../api/bookingService";
import productService from "../../api/productService";
import customerService from "../../api/customerService";
import { AddPaymentModal, PaymentListOfBooking, PaymentSummary, PickupProductModal, ReturnProductModal } from "../../component/index";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Edit,
  RefreshCw,
  Phone,
  MapPin,
  Mail,
  Activity,
  BarChart3,
  Receipt,
  Truck,
  RotateCcw
} from "lucide-react";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [product, setProduct] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchBooking = async () => {
    try {
      setIsLoading(true);
      const bookingRes = await bookingService.getBookingById(id);
      if (bookingRes) setBooking(bookingRes);

      if (bookingRes?.productId) {
        const productRes = await productService.getProductById(bookingRes.productId);
        if (productRes) setProduct(productRes);
      }

      if (bookingRes?.customerId) {
        const customerRes = await customerService.getCustomerById(bookingRes.customerId);
        if (customerRes) setCustomer(customerRes);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const getBookingStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked_up': return 'bg-green-100 text-green-800 border-green-200';
      case 'returned': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBookingStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'reserved': return <Clock className="w-4 h-4" />;
      case 'picked_up': return <CheckCircle className="w-4 h-4" />;
      case 'returned': return <Package className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate booking duration and costs
  const calculateBookingDetails = () => {
    if (!booking || !product) return null;

    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    const basePrice = product.pricePerDay * days;
    const discountAmount = (basePrice * booking.discount) / 100;
    const subtotal = basePrice - discountAmount;
    const securityDeposit = booking.securityDeposit || 0;
    const total = subtotal + securityDeposit;

    return {
      days,
      basePrice,
      discountAmount,
      subtotal,
      securityDeposit,
      total
    };
  };

  const bookingDetails = calculateBookingDetails();

  // Mock activity data (replace with real API data)
  const bookingActivity = [
    {
      id: 1,
      type: 'created',
      message: 'Booking created',
      timestamp: booking?.createdAt,
      icon: <Calendar className="w-4 h-4" />,
      color: 'text-blue-600'
    },
    booking?.bookingStatus === 'PICKED_UP' && {
      id: 2,
      type: 'pickup',
      message: 'Product picked up by customer',
      timestamp: booking?.pickupDate,
      icon: <Truck className="w-4 h-4" />,
      color: 'text-green-600'
    },
    booking?.bookingStatus === 'RETURNED' && {
      id: 3,
      type: 'return',
      message: 'Product returned successfully',
      timestamp: booking?.returnDate,
      icon: <RotateCcw className="w-4 h-4" />,
      color: 'text-purple-600'
    }
  ].filter(Boolean);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-pulse">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate('/bookings')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Bookings</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Booking #{booking.id}</span>
          </nav>

          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600 mt-1">Manage and track booking information</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchBooking}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Status-based Action Buttons */}
              <div className="flex items-center space-x-3">
                {(booking.bookingStatus === "RESERVED" || booking.bookingStatus === "PICKED_UP") && (
                  <button
                    onClick={() => navigate(`/bookings/${booking.id}/edit`)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Booking
                  </button>
                )}

                {booking.bookingStatus === "RESERVED" && (
                  <>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment
                    </button>
                    <button
                      onClick={() => setShowPickupModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Pickup Product
                    </button>
                  </>
                )}

                {booking.bookingStatus === "PICKED_UP" && (
                  <>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Add Payment
                    </button>
                    <button
                      onClick={() => setShowReturnModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Return Product
                    </button>
                  </>
                )}

                {booking.bookingStatus === "RETURNED" && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(booking.bookingStatus)}`}>
                {getBookingStatusIcon(booking.bookingStatus)}
                <span className="ml-1 capitalize">{booking.bookingStatus?.replace('_', ' ')}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Booking Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {booking.bookingStatus?.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                <span className="capitalize">{booking.paymentStatus}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Payment Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {booking.paymentStatus}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{bookingDetails?.total?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                    <p className="text-sm text-gray-600">Rental item details</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{product?.name}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Code</label>
                      <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                        #{product?.productCode}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate</label>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">₹{product?.pricePerDay}</span>
                        <span className="text-sm text-gray-600">per day</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rental Period</label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            Start: {new Date(booking.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            End: {new Date(booking.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        {bookingDetails && (
                          <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            Duration: {bookingDetails.days} day{bookingDetails.days > 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                    <p className="text-sm text-gray-600">Renter details and contact information</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{customer?.customerName}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{customer?.phoneNumber}</span>
                      </div>
                    </div>
                    {customer?.email && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 text-sm">{customer.email}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm leading-relaxed">{customer?.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <PaymentSummary booking={booking} />
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <PaymentListOfBooking booking={booking} />
            </div>
          </div>

          {/* Right Column - Activity & Summary */}
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Activity Timeline
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {bookingActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${activity.color.replace('text-', 'bg-').replace('-600', '-100')} border border-gray-200`}>
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                  ))}

                  {bookingActivity.length === 0 && (
                    <div className="text-center py-4">
                      <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No activity recorded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Booking Summary
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Booking ID</span>
                    <span className="text-sm font-mono text-gray-900">#{booking.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="text-sm text-gray-900">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {new Date(booking.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {bookingDetails && (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm text-gray-900">{bookingDetails.days} days</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Total Amount</span>
                        <span className="text-sm font-semibold text-gray-900">₹{bookingDetails.total.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
          </div>
        </div>

        {/* Modals */}
        {showPaymentModal && (
          <AddPaymentModal
            bookingId={booking.id}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={fetchBooking}
          />
        )}

        {showPickupModal && (
          <PickupProductModal
            bookingId={booking.id}
            onClose={() => setShowPickupModal(false)}
            onSuccess={fetchBooking}
          />
        )}

        {showReturnModal && (
          <ReturnProductModal
            bookingId={booking.id}
            onClose={() => setShowReturnModal(false)}
            onSuccess={fetchBooking}
          />
        )}
      </div>
    </div>
  );
}

export default BookingDetails;
