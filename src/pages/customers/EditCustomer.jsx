import React, { useEffect, useState } from 'react'
import customerService from '../../api/customerService';
import { CustomerForm } from '../../component/index';
import { useNavigate, useParams } from 'react-router'

function EditCustomer() {
    const [customer, setCustomer] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            customerService.getCustomerById(id)
            .then((cust) => {
                if (cust) 
                    setCustomer(cust);
                 else 
                    navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });

        } else 
            navigate("/");
        
    }, [id, navigate]);

  return customer ? (
    <div className='py-8'>
        <CustomerForm customer={customer} />
    </div>
  ) : null
}

export default EditCustomer
