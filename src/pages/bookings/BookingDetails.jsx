import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import bookingService from "../../api/bookingService";
import productService from "../../api/productService";
import customerService from "../../api/customerService";
import { AddPaymentModal, PaymentListOfBooking, PaymentSummary, PickupProductModal, ReturnProductModal } from "../../component/index";

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [product, setProduct] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchBooking = async () => {
    try {
        const bookingRes = await bookingService.getBookingById(id);
        if (bookingRes) setBooking(bookingRes);

        const productRes = await productService.getProductById(bookingRes.productId);
        if (productRes) setProduct(productRes);

        const customerRes = await customerService.getCustomerById(bookingRes.customerId);
        if (customerRes) setCustomer(customerRes);

    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Booking #{booking.id}</h2>

        <div className="flex gap-3">
          {(booking.bookingStatus === "RESERVED" || booking.bookingStatus === "PICKED_UP") && (
            <button
              onClick={() => navigate(`/bookings/${booking.id}/edit`)}
              className="btn-secondary"
            >
              Edit Booking
            </button>
          )}

          {booking.bookingStatus === "RESERVED" && (
            <>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary"
              >
                Add Payment
              </button>

              <button
                onClick={() => setShowPickupModal(true)}
                className="btn-success"
              >
                Pickup Product
              </button>
            </>
          )}

          {booking.bookingStatus === "PICKED_UP" && (
            <>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary"
              >
                Add Payment
              </button>
              <button
                onClick={() => setShowReturnModal(true)}
                className="btn-warning"
              >
                Return Product
              </button>
            </>
          )}

          {booking.bookingStatus === "RETURNED" && (
            <button
              onClick={() => setShowPaymentModal(true)}
              className="btn-primary"
            >
              Add Payment
            </button>
          )}
        </div>
      </div>

      {/* Product & Customer Info */}
      <div className="grid grid-cols-2 gap-6 bg-white p-4 rounded shadow">
        <div>
          <h4 className="font-semibold mb-2">Product</h4>
          <p>Name: {product?.name}</p>
          <p>Code: {product?.productCode}</p>
          <p>Price/Day: ₹{product?.pricePerDay}</p>
          <p>
            Duration: {booking.startDate} → {booking.endDate}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Customer</h4>
          <p>{customer?.customerName}</p>
          <p>{customer?.phoneNumber}</p>
          <p>{customer?.address}</p>
        </div>
      </div>

      {/* Payment Summary */}
      <PaymentSummary booking={booking} />

      {/* Payments */}
      <PaymentListOfBooking booking={booking} />

      {/* Modals */}
      {showPaymentModal && (
        <AddPaymentModal
          bookingId={booking.id}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={fetchBooking}
        />
      )}

      {showPickupModal && (
        <PickupProductModal
          bookingId={booking.id}
          onClose={() => setShowPickupModal(false)}
          onSuccess={fetchBooking}
        />
      )}

      {showReturnModal && (
        <ReturnProductModal
          bookingId={booking.id}
          onClose={() => setShowReturnModal(false)}
          onSuccess={fetchBooking}
        />
      )}
    </div>
  );
}

export default BookingDetails;
