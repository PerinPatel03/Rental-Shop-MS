import React, { useEffect, useState } from 'react'
import productService from '../../api/productService'
import { ProductForm } from '../../component/index'
import { useNavigate, useParams } from 'react-router'

function EditProduct() {
    const [product, setProduct] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            productService.getProductById(id)
            .then((prod) => {
                if (prod) 
                    setProduct(prod);
                 else 
                    navigate("/");
            })
            .catch((error) => {
                console.log(error);
            });

        } else 
            navigate("/");
        
    }, [id, navigate]);

  return product ? (
    <div>
        <ProductForm product={product} />
    </div>
  ) : null
}

export default EditProduct
