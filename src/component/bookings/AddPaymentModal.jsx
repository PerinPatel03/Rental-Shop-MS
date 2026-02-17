import { useState } from "react";
import paymentService from "../../api/paymentService";
import { X, CreditCard, DollarSign, Save } from "lucide-react";

function AddPaymentModal({ bookingId, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("RENTAL");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await paymentService.savePayment({
        bookingId: bookingId,
        paymentType: paymentType,
        amount: parseFloat(amount)
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to add payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#000000c7] flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add Payment</h3>
                <p className="text-sm text-gray-600">Record a new payment for this booking</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-6">
            {/* Payment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
              >
                <option value="RENTAL">🏠 Rental Payment</option>
                <option value="DEPOSIT">🛡️ Security Deposit</option>
                <option value="REFUND">💰 Refund</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-3 text-gray-500 font-medium">₹</div>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                />
                <div className="absolute right-4 top-3 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              {amount && (
                <p className="mt-2 text-sm text-gray-600">
                  Amount: ₹{parseFloat(amount || 0).toLocaleString()}
                </p>
              )}
            </div>

            {/* Payment Summary */}
            {amount && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-800">
                    {paymentType === 'RENTAL' && 'Rental Payment'}
                    {paymentType === 'DEPOSIT' && 'Security Deposit'}
                    {paymentType === 'REFUND' && 'Refund Payment'}
                  </span>
                </div>
                <div className="mt-2 text-lg font-bold text-green-900">
                  ₹{parseFloat(amount || 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading || !amount}
              className="flex-1 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Add Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddPaymentModal;
