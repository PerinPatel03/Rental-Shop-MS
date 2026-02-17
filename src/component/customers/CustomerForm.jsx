import React, { useState, useEffect } from 'react'
import customerService from '../../api/customerService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button, Input } from '../index'
import {
    ArrowLeft,
    User,
    Phone,
    MapPin,
    Mail,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    UserPlus,
    Edit3
} from 'lucide-react'

function CustomerForm({ customer }) {
    const { register, handleSubmit, reset, watch, formState: { errors, isDirty } } = useForm({
        defaultValues: {
            customerName: customer?.customerName || "",
            phoneNumber: customer?.phoneNumber || "",
            email: customer?.email || "",
            address: customer?.address || ""
        },
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [isFormDirty, setIsFormDirty] = useState(false);

    const watchedFields = watch();

    useEffect(() => {
        const subscription = watch(() => setIsFormDirty(true));
        return () => subscription.unsubscribe();
    }, [watch]);

    const handleCancel = () => {
        if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
            return;
        }
        reset();
        setFormErrors({});
        setIsFormDirty(false);
    }

    const submit = async (data) => {
        try {
            setLoading(true);
            setSuccess(false);

            let customerResponse;

            if (customer) {    // Edit Customer
                customerResponse = await customerService.editCustomer(customer.id, {
                    customerName: data.customerName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    address: data.address
                });
            } else {    // Add Customer
                customerResponse = await customerService.addCustomer({
                    customerName: data.customerName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    address: data.address
                });
            }

            if (customerResponse) {
                setSuccess(true);
                setIsFormDirty(false);
                setTimeout(() => {
                    navigate("/customers");
                }, 1500);
            }

        } catch (errors) {
            setFormErrors(errors);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate('/customers')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Customers</span>
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </span>
          </nav>

          {/* Title and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {customer ? 'Edit Customer' : 'Add New Customer'}
              </h1>
              <p className="text-gray-600 mt-1">
                {customer
                  ? 'Update customer information and contact details'
                  : 'Create a new customer profile for your rental business'
                }
              </p>
            </div>

            {customer && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Customer ID</div>
                  <div className="font-mono text-sm font-semibold text-gray-900">#{customer.id}</div>
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
                Customer {customer ? 'updated' : 'created'} successfully!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Redirecting to customers list...
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <p className="text-sm text-gray-600">Basic customer details and identification</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    <span>Full Name</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer's full name"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      errors.customerName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                    {...register("customerName", {
                      required: "Customer name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                      pattern: { value: /^[a-zA-Z\s]+$/, message: "Name can only contain letters and spaces" }
                    })}
                  />
                  {errors.customerName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.customerName.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Number</span>
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number (e.g., +91 9876543210)"
                    className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                      errors.phoneNumber
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                    } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[\+]?[1-9][\d]{0,15}$/,
                        message: "Please enter a valid phone number"
                      }
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phoneNumber.message}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Address</span>
                  <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter email address (e.g., customer@example.com)"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                  } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  <p className="text-sm text-gray-600">Customer's residential or contact address</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Full Address</span>
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter complete address including street, city, state, and postal code"
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 resize-none ${
                    errors.address
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                  } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 10, message: "Address must be at least 10 characters" }
                  })}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address.message}</span>
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Provide detailed address for delivery and communication purposes
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="text-sm text-gray-600">
                {isFormDirty ? (
                  <span className="flex items-center text-orange-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    You have unsaved changes
                  </span>
                ) : (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    All changes saved
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
                  disabled={loading}
                  className="px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {customer ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      {customer ? <Edit3 className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                      {customer ? 'Update Customer' : 'Create Customer'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm
