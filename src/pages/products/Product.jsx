import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import productService from "../../api/productService";
import conf from "../../conf/conf";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await productService.getProductById(id);
      if (res) 
        setProduct(res);
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      await productService.softDeleteProduct(product.id);
      navigate("/products");
      
    } catch (error) {
      console.log(error);
    }
  }

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold">Product Details</h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="h-64 border rounded overflow-hidden">
          {product.imageUrl ? (
            <img
              src={`${conf.baseUrl}${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-gray-500">Product Code</p>
          <p className="font-semibold mb-2">{product.productCode}</p>

          <p className="text-sm text-gray-500">Name</p>
          <p className="font-semibold mb-2">{product.name}</p>

          <p className="text-sm text-gray-500">Price Per Day</p>
          <p className="font-semibold mb-2">₹ {product.pricePerDay}</p>

          {/* <p className="text-sm text-gray-500">Status</p>
          <span
            className={`inline-block px-3 py-1 rounded text-sm ${
              product.active
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {product.active ? "Active" : "Inactive"}
          </span> */}
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">Description</p>
        <p className="mt-1 text-gray-700">{product.description}</p>
      </div>

      {/* Dates */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Created At: {product.createdAt}</p>
        <p>Updated At: {product.updatedAt}</p>
      </div>
    </div>
  );
}
