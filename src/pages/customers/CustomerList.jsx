import { useEffect, useState } from "react";
import customerService from "../../api/customerService";
import { useNavigate } from "react-router";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
        const res = await customerService.getCustomers();
        if (res) 
            setCustomers(res);
        
    } catch (error) {
        console.log(error);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-semibold">Customers</h1>
      <div className="flex justify-between items-center">
        {/* Search */}
        <input
          type="text"
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => navigate("/customers/add")}
          className="bg-orange-600 text-white px-4 py-2 rounded"
        >
          Add Customer
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Address</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map(c => (
            <tr key={c.id} className="border-t">
              <td className="p-3">{c.customerName}</td>
              <td className="p-3">{c.phoneNumber}</td>
              <td className="p-3 truncate max-w-xs">{c.address}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => navigate(`/customers/${c.id}/edit`)}
                  className="text-orange-600 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}

          {filteredCustomers.length === 0 && (
            <tr>
              <td colSpan="4" className="p-6 text-center text-gray-500">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
