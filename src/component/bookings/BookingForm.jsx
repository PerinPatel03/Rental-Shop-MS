import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import bookingService from "../../api/bookingService";
import productService from "../../api/productService";
import customerService from "../../api/customerService";

function BookingForm({ booking = null }) {
  const navigate = useNavigate();
  const isEdit = Boolean(booking);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    productId: booking?.productId || "",
    customerId: booking?.customerId || "",
    startDate: booking?.startDate || "",
    endDate: booking?.endDate || "",
    discount: booking?.discount || 0,
    securityDeposit: booking?.securityDeposit || 0,
  });

  useEffect(() => {
    if (!isEdit) {
      productService.getActiveProducts().then(setProducts).catch(console.log);
      customerService.getCustomers().then(setCustomers).catch(console.log);
    }
  }, [isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (isEdit) {
        res = await bookingService.updateBooking(booking.id, {
          startDate: form.startDate,
          endDate: form.endDate,
          discount: form.discount,
          securityDeposit: form.securityDeposit,
        });
      } else {
        res = await bookingService.addBooking(form);
      }

      navigate(`/bookings/${res.id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? "Edit Booking" : "Create Booking"}
      </h2>

      <form onSubmit={submitBooking} className="space-y-5">
        {/* Product */}
        <div>
          <label className="label">Product</label>
          {isEdit ? (
            <input 
              value={`Product #${form.productId}`}
              disabled
              className="input bg-gray-100"
            />
          ) : (
            <select
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.productCode})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Customer */}
        <div>
          <label className="label">Customer</label>
          {isEdit ? (
            <input 
              value={`Customer #${form.customerId}`}
              disabled
              className="input bg-gray-100"
            />
          ) : (
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Select customer</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.customerName} ({c.phoneNumber})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Discount (%)</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Security Deposit</label>
            <input
              type="number"
              name="securityDeposit"
              value={form.securityDeposit}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Edit Booking" : "Create Booking"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/bookings")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookingForm;
