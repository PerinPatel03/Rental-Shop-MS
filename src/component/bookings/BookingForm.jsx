import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import bookingService from "../../api/bookingService";
import productService from "../../api/productService";
import customerService from "../../api/customerService";
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  DollarSign,
  Percent,
  Shield,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calculator,
  Receipt,
  Clock,
  TrendingUp
} from "lucide-react";

function BookingForm({ booking = null }) {
  const navigate = useNavigate();
  const isEdit = Boolean(booking);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});

  const [form, setForm] = useState({
    productId: booking?.productId || "",
    customerId: booking?.customerId || "",
    startDate: booking?.startDate || "",
    endDate: booking?.endDate || "",
    discount: booking?.discount || 0,
    securityDeposit: booking?.securityDeposit || 0,
  });

  useEffect(() => {
    if (!isEdit) {
      fetchData();
    } else {
      // For edit mode, load current product and customer details
      loadCurrentData();
    }

    // Store initial form data for change tracking
    setInitialFormData({
      productId: booking?.productId || "",
      customerId: booking?.customerId || "",
      startDate: booking?.startDate || "",
      endDate: booking?.endDate || "",
      discount: booking?.discount || 0,
      securityDeposit: booking?.securityDeposit || 0,
    });
  }, [isEdit, booking]);

  const fetchData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        productService.getActiveProducts(),
        customerService.getCustomers()
      ]);
      setProducts(productsRes || []);
      setCustomers(customersRes || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadCurrentData = async () => {
    try {
      setLoading(true);
      
      // Fetch product and customer data in parallel
      const promises = [];
      
      if (booking?.productId) {
        promises.push(productService.getProductById(booking.productId));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      if (booking?.customerId) {
        promises.push(customerService.getCustomerById(booking.customerId));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      const [productData, customerData] = await Promise.all(promises);
      
      if (productData) {
        setSelectedProduct(productData);
      }
      
      if (customerData) {
        setSelectedCustomer(customerData);
      }
      
      // Also fetch the full lists for dropdowns (in case user needs to see them)
      await fetchData();
    } catch (error) {
      console.error("Failed to load current data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }

    // Check if form has changed from initial state
    const updatedForm = { ...form, [name]: value };
    const hasChanges = JSON.stringify(updatedForm) !== JSON.stringify(initialFormData);
    setIsFormDirty(hasChanges);

    // Update selected product/customer when selection changes
    if (name === 'productId' && value) {
      const product = products.find(p => p.id.toString() === value.toString());
      setSelectedProduct(product);
    }
    if (name === 'customerId' && value) {
      const customer = customers.find(c => c.id.toString() === value.toString());
      setSelectedCustomer(customer);
    }
  };

  // Calculate pricing
  const calculatePricing = () => {
    if (!selectedProduct || !form.startDate || !form.endDate) return null;

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (days <= 0) return null;

    const basePrice = selectedProduct.pricePerDay * days;
    const discountAmount = (basePrice * form.discount) / 100;
    const subtotal = basePrice - discountAmount;
    const securityDeposit = parseFloat(form.securityDeposit) || 0;
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

  const pricing = calculatePricing();

  // Validation
  const validateForm = () => {
    const errors = {};

    if (!form.productId) errors.productId = "Please select a product";
    if (!form.customerId) errors.customerId = "Please select a customer";
    if (!form.startDate) errors.startDate = "Start date is required";
    if (!form.endDate) errors.endDate = "End date is required";

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);
      if (end < start) {
        errors.endDate = "End date can't be before start date";
      }
    }

    if (form.discount < 0 || form.discount > 100) {
      errors.discount = "Discount must be between 0 and 100";
    }

    if (form.securityDeposit < 0) {
      errors.securityDeposit = "Security deposit cannot be negative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSaving(true);

    try {
      let res;
      if (isEdit) {
        res = await bookingService.updateBooking(booking.id, {
          startDate: form.startDate,
          endDate: form.endDate,
          discount: form.discount,
          securityDeposit: form.securityDeposit,
        });
      } else {
        res = await bookingService.addBooking(form);
      }

      setSuccess(true);
      setIsFormDirty(false);
      setTimeout(() => {
        navigate(`/bookings/${res.id}`);
      }, 1500);
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.message || "Booking failed" });
    } finally {
      setLoading(false);
      setSaving(false);
    }
  };
  const handleCancel = () => {
    if (isFormDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }

    // Reset form to initial state
    setForm(initialFormData);
    setFormErrors({});
    setIsFormDirty(false);
    setSelectedProduct(null);
    setSelectedCustomer(null);
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
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
            <span className="text-gray-900 font-medium">
              {isEdit ? 'Edit Booking' : 'Create New Booking'}
            </span>
          </nav>

          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? 'Edit Booking' : 'Create New Booking'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEdit
                  ? 'Update booking details and rental information'
                  : 'Set up a new rental booking for your customers'
                }
              </p>
            </div>

            {isEdit && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Booking ID</div>
                  <div className="font-mono text-sm font-semibold text-gray-900">#{booking.id}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">
                Booking {isEdit ? 'updated' : 'created'} successfully!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to booking details...
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Booking failed</p>
              <p className="text-red-600 text-sm mt-1">{formErrors.submit}</p>
            </div>
          </div>
        )}

        <form onSubmit={submitBooking} className="space-y-8">
          <div className="">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Selection */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Product Selection</h3>
                        <p className="text-sm text-gray-600">Choose the product for this booking</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Package className="w-4 h-4" />
                        <span>Select Product</span>
                        <span className="text-red-500">*</span>
                      </label>

                      {isEdit ? (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {selectedProduct?.name || `Product #${form.productId}`}
                              </div>
                              <div className="text-sm text-gray-600">
                                Product cannot be changed for existing bookings
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <select
                          name="productId"
                          value={form.productId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.productId
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                            } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                        >
                          <option value="">Choose a product...</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ₹{product.pricePerDay}/day ({product.productCode})
                            </option>
                          ))}
                        </select>
                      )}

                      {formErrors.productId && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.productId}</span>
                        </p>
                      )}

                      {/* Product Preview */}
                      {selectedProduct && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-blue-900">{selectedProduct.name}</div>
                                <div className="text-sm text-blue-700">#{selectedProduct.productCode}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-900">₹{selectedProduct.pricePerDay}</div>
                              <div className="text-xs text-blue-600">per day</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                        <p className="text-sm text-gray-600">Select the customer for this booking</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        <span>Select Customer</span>
                        <span className="text-red-500">*</span>
                      </label>

                      {isEdit ? (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {selectedCustomer?.name || `Customer #${form.customerId}`}
                              </div>
                              <div className="text-sm text-gray-600">
                                Customer cannot be changed for existing bookings
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <select
                          name="customerId"
                          value={form.customerId}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.customerId
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                            } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                        >
                          <option value="">Choose a customer...</option>
                          {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.customerName} - {customer.phoneNumber}
                            </option>
                          ))}
                        </select>
                      )}

                      {formErrors.customerId && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.customerId}</span>
                        </p>
                      )}

                      {/* Customer Preview */}
                      {selectedCustomer && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <User className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-green-900">{selectedCustomer.customerName}</div>
                              <div className="text-sm text-green-700">{selectedCustomer.phoneNumber}</div>
                              {selectedCustomer.email && (
                                <div className="text-sm text-green-600">{selectedCustomer.email}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Booking Dates */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Booking Period</h3>
                      <p className="text-sm text-gray-600">Set the rental start and end dates</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Start Date</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.startDate
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                          } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                      />
                      {formErrors.startDate && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.startDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>End Date</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        min={form.startDate || new Date().toISOString().split('T')[0]}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.endDate
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-purple-500 focus:ring-purple-200'
                          } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                      />
                      {formErrors.endDate && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.endDate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {pricing && (
                    <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center space-x-2 text-sm text-purple-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Duration: {pricing.days} day{pricing.days > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
                      <p className="text-sm text-gray-600">Configure pricing and payment terms</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Percent className="w-4 h-4" />
                        <span>Discount (%)</span>
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={form.discount}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.discount
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                          } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                      />
                      {formErrors.discount && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.discount}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Shield className="w-4 h-4" />
                        <span>Security Deposit</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          name="securityDeposit"
                          value={form.securityDeposit}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all duration-200 ${formErrors.securityDeposit
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                            } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                        />
                      </div>
                      {formErrors.securityDeposit && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{formErrors.securityDeposit}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Pricing Summary */}
            <div className="space-y-6">
              {/* Pricing Calculator */}
              {pricing && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500 rounded-lg">
                        <Calculator className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pricing Summary</h3>
                        <p className="text-sm text-gray-600">Booking cost breakdown</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Duration</span>
                        <span className="text-sm font-medium">{pricing.days} day{pricing.days > 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Base Price</span>
                        <span className="text-sm font-medium">₹{pricing.basePrice.toLocaleString()}</span>
                      </div>

                      {pricing.discountAmount > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100 text-green-600">
                          <span className="text-sm">Discount ({form.discount}%)</span>
                          <span className="text-sm font-medium">-₹{pricing.discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Security Deposit</span>
                        <span className="text-sm font-medium">₹{pricing.securityDeposit.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between items-center py-3 border-t-2 border-gray-200 pt-4">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-xl font-bold text-emerald-600">₹{pricing.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="text-sm text-gray-600">
                {Object.keys(formErrors).length > 0 ? (
                  <span className="flex items-center text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Please fix the errors above
                  </span>
                ) : (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready to {isEdit ? 'update' : 'create'} booking
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  <X className="w-4 h-4 mr-2 inline" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || Object.keys(formErrors).length > 0}
                  className="px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {saving ? 'Saving...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEdit ? 'Update Booking' : 'Create Booking'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
