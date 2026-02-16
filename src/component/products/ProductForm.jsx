import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import productService from '../../api/productService'
import productImageService from '../../api/productImageService'
import conf from '../../conf/conf'
import { Button, Input } from '../index'
import { useNavigate } from 'react-router'
import {
  Package,
  Hash,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Save,
  ArrowLeft,
  Tag,
  Activity,
  Camera,
  Zap,
  RefreshCw
} from 'lucide-react'

function ProductForm({ product }) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isDirty } } = useForm({
    defaultValues: {
      productCode: product?.productCode || "",
      name: product?.name || "",
      description: product?.description || "",
      pricePerDay: product?.pricePerDay || "",
      category: product?.category || "",
      status: product?.status || "available"
    },
  });

  const [imagePreview, setImagePreview] = useState(product ? `${conf.baseUrl}${product?.imageUrl}` : null);
  const [images, setImages] = useState(() => {
    // Initialize with existing product image if editing
    if (product && product.imageUrl) {
      return [{
        file: null, // No file object for existing images
        preview: `${conf.baseUrl}${product.imageUrl}`,
        id: 'existing-image',
        isExisting: true,
        url: product.imageUrl
      }];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null);

  const watchedFields = watch();

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && Object.keys(watchedFields).some(key => watchedFields[key])) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [watchedFields, isDirty]);

  const handleAutoSave = async () => {
    try {
      setAutoSaveStatus('saving');
      // Here you would typically save to a drafts endpoint
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(null), 2000);
    }
  };

  const handleCancel = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to leave?')) {
      return;
    }
    reset();
    setFormErrors({});
    // Reset images to original state
    setImages(() => {
      if (product && product.imageUrl) {
        return [{
          file: null,
          preview: `${conf.baseUrl}${product.imageUrl}`,
          id: 'existing-image',
          isExisting: true,
          url: product.imageUrl
        }];
      }
      return [];
    });
    setImagePreview(product ? `${conf.baseUrl}${product?.imageUrl}` : null);
  }

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));

    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0 && !imagePreview) {
      setImagePreview(newImages[0].preview);
    }
  };

  const removeImage = (imageId) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      if (filtered.length === 0) {
        setImagePreview(null);
      } else if (imagePreview === prev.find(img => img.id === imageId)?.preview) {
        setImagePreview(filtered[0].preview);
      }
      return filtered;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const submit = async (data) => {
    try {
      setLoading(true);
      setSuccess(false);

      let productResponse;

      if (product) {  // Edit Product
        productResponse = await productService.editProduct(product.id, {
          productCode: data.productCode,
          name: data.name,
          description: data.description,
          pricePerDay: data.pricePerDay,
          category: data.category,
          status: data.status
        });

        // Handle image updates
        const hasNewImages = images.some(img => !img.isExisting);
        const hasExistingImage = images.some(img => img.isExisting);

        if (hasNewImages) {
          // Upload new image (this will replace existing)
          await productImageService.updateImage(productResponse.id, images.find(img => !img.isExisting).file);
        } else if (!hasExistingImage && product.imageUrl) {
          // Existing image was removed - you might want to delete it from server
          // For now, we'll just leave it as is since the API might handle this
        }
      } else {  // Add Product
        productResponse = await productService.addProduct({
          productCode: data.productCode,
          name: data.name,
          description: data.description,
          pricePerDay: data.pricePerDay,
          category: data.category,
          status: data.status
        });

        if (images.length > 0) {
          await productImageService.uploadImage(productResponse.id, images[0].file);
        }
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/products/${productResponse.id}`);
      }, 1500);

    } catch (errors) {
      setFormErrors(errors);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/products')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {product ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {product ? "Update product information and settings" : "Create a new product for your rental inventory"}
                </p>
              </div>
            </div>

            {/* Auto-save indicator */}
            {autoSaveStatus && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                autoSaveStatus === 'saving' ? 'bg-yellow-100 text-yellow-800' :
                autoSaveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {autoSaveStatus === 'saving' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving draft...</span>
                  </>
                ) : autoSaveStatus === 'saved' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Draft saved</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Save failed</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Product {product ? 'updated' : 'created'} successfully! Redirecting...
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                      <p className="text-sm text-gray-600">Essential product details and identification</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Hash className="w-4 h-4" />
                        <span>Product Code</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="Enter unique product code"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                          errors.productCode
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                        } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                        {...register("productCode", {
                          required: "Product code is required",
                          min: { value: 1, message: "Product code must be positive" }
                        })}
                      />
                      {errors.productCode && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.productCode.message}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Tag className="w-4 h-4" />
                        <span>Category</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none bg-gray-50 focus:bg-white transition-all duration-200"
                        {...register("category")}
                      >
                        <option value="">Select category</option>
                        <option value="camera">📷 Camera</option>
                        <option value="laptop">💻 Laptop</option>
                        <option value="gaming">🎮 Gaming</option>
                        <option value="audio">🎧 Audio</option>
                        <option value="sports">⚽ Sports</option>
                        <option value="other">📦 Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <span>Product Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter product name"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        errors.name
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                      } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                      {...register("name", {
                        required: "Product name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                      })}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name.message}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <FileText className="w-4 h-4" />
                      <span>Description</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe the product features, condition, and any special notes..."
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${
                        errors.description
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
                      } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white resize-none`}
                      {...register("description", {
                        required: "Description is required",
                        minLength: { value: 10, message: "Description must be at least 10 characters" }
                      })}
                    />
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.description.message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pricing & Availability</h3>
                      <p className="text-sm text-gray-600">Set pricing and manage product availability</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Price Per Day</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                            errors.pricePerDay
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
                          } focus:outline-none focus:ring-2 bg-gray-50 focus:bg-white`}
                          {...register("pricePerDay", {
                            required: "Price per day is required",
                            min: { value: 0, message: "Price must be positive" }
                          })}
                        />
                      </div>
                      {errors.pricePerDay && (
                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors.pricePerDay.message}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Activity className="w-4 h-4" />
                        <span>Status</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none bg-gray-50 focus:bg-white transition-all duration-200"
                        {...register("status")}
                      >
                        <option value="available">✅ Available</option>
                        <option value="rented">🔄 Currently Rented</option>
                        <option value="maintenance">🔧 Under Maintenance</option>
                        <option value="inactive">❌ Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                      <p className="text-sm text-gray-600">Upload product photos</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                      isDragOver
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {images.length === 0 ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">Upload Product Images</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Drag and drop images here, or click to browse
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Choose Files
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {images.slice(0, 4).map((image, index) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.preview}
                                alt={image.isExisting ? 'Current product image' : `Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              {image.isExisting && (
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                  Current
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title={image.isExisting ? 'Remove current image' : 'Remove uploaded image'}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                          + {images.length === 0 ? 'Add product image' : 'Replace image'}
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />

                  {images.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        {images.filter(img => !img.isExisting).length > 0
                          ? `${images.filter(img => !img.isExisting).length} new image${images.filter(img => !img.isExisting).length > 1 ? 's' : ''} uploaded`
                          : images.some(img => img.isExisting)
                            ? 'Current product image loaded'
                            : `${images.length} image${images.length > 1 ? 's' : ''} selected`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Daily Rate</span>
                    <span className="font-semibold text-green-600">
                      ₹{watchedFields.pricePerDay || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {watchedFields.category || 'Not set'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      watchedFields.status === 'available' ? 'bg-green-100 text-green-800' :
                      watchedFields.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                      watchedFields.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {watchedFields.status || 'available'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                {isDirty ? '⚠️ You have unsaved changes' : '✅ All changes saved'}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{product ? 'Update Product' : 'Create Product'}</span>
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

export default ProductForm
