import { useEffect, useState } from "react";
import productService from "../../api/productService";
import { Link, useNavigate } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
        const res = await productService.getActiveProducts();
        if (res) 
            setProducts(res);
        
    } catch (error) {
        console.log(error);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.productCode?.toString().includes(search)
  );
  
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <div className="flex justify-between items-center">
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Search product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/products/add" className="bg-orange-600 text-white px-4 py-2 rounded">
          Add Product
        </Link>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Product code</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Price per Day</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr 
            key={p.id} 
            onClick={() => navigate(`/products/${p.id}`)} 
            className="border-t cursor-pointer hover:bg-gray-100">
              <td className="p-3 text-center">{p.productCode}</td>
              <td className="p-3">{p.name}</td>
              <td className="p-3 text-center">₹{p.pricePerDay}</td>
            </tr>
          ))}

          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="3" className="p-6 text-center text-gray-500">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
