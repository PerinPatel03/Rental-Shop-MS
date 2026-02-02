import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import bookingService from "../../api/bookingService";

function BookingList() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchBookingList = async () => {
    try {
      const res = await bookingService.getBookingList();
      setBookings(res || []);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBookingList();
  }, []);

  const filteredBookings = bookings.filter(b => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      b.productName?.toLowerCase().includes(searchText) ||
      String(b.productCode).includes(search) ||
      b.customerName?.toLowerCase().includes(searchText) ||
      b.phoneNumber?.includes(search);

    const matchesStatus =
      !statusFilter || b.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Bookings</h2>
        <button
          onClick={() => navigate("/bookings/add")}
          className="btn-primary"
        >
          + Create Booking
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search product / customer / phone"
          className="input w-80"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="input w-48"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="RESERVED">RESERVED</option>
          <option value="PICKED_UP">PICKED_UP</option>
          <option value="RETURNED">RETURNED</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Period</th>
              <th className="p-3 text-center">Booking Status</th>
              <th className="p-3 text-center">Payment Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map(b => (
              <tr
                key={b.id}
                className="border-t hover:bg-orange-50 cursor-pointer"
                onClick={() => navigate(`/bookings/${b.id}`)}
              >
                <td className="p-3">{b.id}</td>

                <td className="p-3">
                  <div className="font-medium">{b.productName}</div>
                  <div className="text-xs text-gray-500">
                    {b.productCode}
                  </div>
                </td>

                <td className="p-3">
                  <div>{b.customerName}</div>
                  <div className="text-xs text-gray-500">
                    {b.phoneNumber}
                  </div>
                </td>

                <td className="p-3">
                  {b.startDate} → {b.endDate}
                </td>
                
                <td className="p-3 text-center">
                  <span className="badge">{b.bookingStatus}</span>
                </td>

                <td className="p-3 text-center">
                  <span className="badge-secondary">
                    {b.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingList;
