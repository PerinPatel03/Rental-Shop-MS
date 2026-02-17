import { useState } from "react";
import bookingService from "../../api/bookingService";

function PickupProductModal({ bookingId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});

  const handlePickup = async () => {
    try {
      setLoading(true);
      setFormError({});

      await bookingService.pickupBookedProduct(bookingId);

      onSuccess();
      onClose();
    } catch (error) {
      setFormError(error);
      console.error(error);
    //   setFormError("Failed to pickup product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000c7] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h3 className="text-xl font-semibold">Confirm Product Pickup</h3>

        <p className="text-gray-600">
          Are you sure you want to mark this product as <b>picked up</b>?
        </p>

        {formError.message && <p className="text-red-500 text-sm">{formError.message}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handlePickup}
            className="btn-success"
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Pickup"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PickupProductModal;
