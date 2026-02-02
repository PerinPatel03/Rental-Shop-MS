import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import productService from '../../api/productService'
import productImageService from '../../api/productImageService'
import conf from '../../conf/conf'
import { Button, Input } from '../index'
import { useNavigate } from 'react-router'

function ProductForm({ product }) {
  const {register, handleSubmit, reset} = useForm({
    defaultValues: {
      productCode: product?.productCode || "",
      name: product?.name || "",
      description: product?.description || "",
      pricePerDay: product?.pricePerDay || ""
    },
  });
  const [imagePreview, setImagePreview] = useState(product ? `${conf.baseUrl}${product?.imageUrl}` : null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCancel = () => {
      reset();
      setFormErrors({});
      setImagePreview(product ? `${conf.baseUrl}${product?.imageUrl}` : null);
  }

  const submit = async (data) => {
    if (product) {  // Edit Product
      try {
        setLoading(true);

        const productResponse = await productService.editProduct(product.id, {
          productCode: data.productCode,
          name: data.name,
          description: data.description,
          pricePerDay: data.pricePerDay
        });

        if (data.image && data.image.length > 0) {
          await productImageService.updateImage(productResponse.id, data.image[0]);
        }

        alert("Product edited successfully.");
        navigate(`/products/${productResponse.id}`);
        
      } catch (errors) {
        setFormErrors(errors);
        alert("Something went wrong.");
        
      } finally {
        setLoading(false);

      }

    } else {  // Add Product
        try {
          setLoading(true);

          const productResponse = await productService.addProduct({
            productCode: data.productCode,
            name: data.name,
            description: data.description,
            pricePerDay: data.pricePerDay
          });

          if(data.image && data.image.length > 0) {
            await productImageService.uploadImage(productResponse.id, data.image[0]);
          }

          alert("Product added successfully.");
          navigate(`/products/${productResponse.id}`);

        } catch(errors) {
          setFormErrors(errors);
          alert("Something went wrong.");

        } finally {
          setLoading(false);

        }
    }
  }

  return (
    <div className='max-w-3xl mx-auto bg-white p-6 rounded-lg shadow'>
      <h2 className='text-2xl font-semibold mb-6'>
        {product ? "Edit Product" : "Add Product"}
      </h2>

      <form onSubmit={handleSubmit(submit)} className='space-y-6'>
        {/* Product Details */}
        <div className='space-y-4'>
          <div>
            <Input 
              label="Product code" 
              type="number" 
              placeholder="Enter product code" 
              className="" 
              {...register("productCode", { required: true })}
            />
            {formErrors.productCode && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.productCode}
              </p>
            )}
          </div>

          <div>
            <Input 
              label="Product Name" 
              type="text"
              placeholder="Enter Product name" 
              className="" 
              {...register("name", { required: true })}
            />
            {formErrors.name && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200" 
              {...register("description", { required: true })}
            />
            {formErrors.description && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.description}
              </p>
            )}
          </div>

          <div>
            <Input 
              label="Price Per Day(₹)" 
              type="number" 
              placeholder="Enter price per day" 
              className="" 
              {...register("pricePerDay", { required: true })}
            />
            {formErrors.pricePerDay && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.pricePerDay}
              </p>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-medium mb-2">Product Image</h4>

          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />

          <div className="mt-3 text-sm text-gray-500">
            {imagePreview && (
              <img 
                src={imagePreview}
                alt='Product Preview'
                className='mt-3 h-32 w-32 object-cover rounded border'
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button 
          type='submit' 
          disabled={loading} 
          bgColor='bg-blue-600' 
          textColor='text-white' 
          className='hover:bg-blue-700 disabled:opacity-60' 
          >
            {product ? (loading ? "Saving" : "Edit Product") : (loading ? "Saving" : "Add Product")}
          </Button>

          <Button 
          type='button' 
          bgColor='bg-gray-200' 
          textColor='text-gray-800' 
          className='hover:bg-gray-300' 
          onClick={handleCancel}
          >Cancel</Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
