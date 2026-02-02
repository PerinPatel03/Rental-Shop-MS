import React, { useState } from 'react'
import customerService from '../../api/customerService';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Button, Input } from '../index'

function CustomerForm({ customer }) {
    const {register, handleSubmit, reset} = useForm({
        defaultValues: {
            customerName: customer?.customerName || "",
            phoneNumber: customer?.phoneNumber || "",
            address: customer?.address || ""
        },
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    const handleCancel = () => {
        reset();
        setFormErrors({});
    }

    const submit = async (data) => {
        if (customer) {    // Edit Customer
            try {
                setLoading(true);

                const customerResponse = await customerService.editCustomer(customer.id, {
                    customerName: data.customerName,
                    phoneNumber: data.phoneNumber,
                    address: data.address
                });

                if (customerResponse) {
                    alert("Customer edited successfully.");
                    navigate("/customers");
                }
                
            } catch (errors) {
                setFormErrors(errors);
                alert("Something went wrong.");
                
            } finally {
                setLoading(false);

            }
            
        } else {    // Add Customer:
            try {
                setLoading(true);

                const customerResponse = await customerService.addCustomer({
                    customerName: data.customerName,
                    phoneNumber: data.phoneNumber,
                    address: data.address
                });

                if (customerResponse) {
                    alert("Customer added successfully.");
                    navigate("/customers");
                }
                
            } catch (errors) {
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
        {customer ? "Edit Customer" : "Add Customer"}
      </h2>
      
      <form onSubmit={handleSubmit(submit)} className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <Input 
              label="Customer Name" 
              type="text" 
              placeholder="Enter customer's name" 
              className="" 
              {...register("customerName", { required: true })}
            />
            {formErrors.customerName && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.customerName}
              </p>
            )}
          </div>

          <div>
            <Input 
              label="Phone Number" 
              type="text"
              placeholder="" 
              className="" 
              {...register("phoneNumber", { required: true })}
            />
            {formErrors.phoneNumber && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              placeholder="Address"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200" 
              {...register("address", { required: true })}
            />
            {formErrors.address && (
              <p className='mt-1 text-xs text-red-600'>
                {formErrors.address}
              </p>
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
            {customer ? (loading ? "Saving" : "Edit Customer") : (loading ? "Saving" : "Add Customer")}
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

export default CustomerForm
