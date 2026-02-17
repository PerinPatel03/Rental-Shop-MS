import { useState } from "react";
import bookingService from "../../api/bookingService";
import { X, Package, Shield, DollarSign, Save, AlertCircle } from "lucide-react";

function ReturnProductModal({ bookingId, onClose, onSuccess }) {
  const [keepDeposit, setKeepDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const submit = async () => {
    try {
      setLoading(true);
      setFormError(null);

      await bookingService.returnBookedProduct(bookingId, {
        keptSecurityDeposit: keepDeposit ? amount : 0,
        keptDepositReason: keepDeposit ? reason : "Not required",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      setFormError(error?.message || "Failed to return product");
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
              <div className="p-2 bg-orange-500 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Return Product</h3>
                <p className="text-sm text-gray-600">Confirm product return for this booking</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label="Close"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={keepDeposit}
                onChange={(e) => setKeepDeposit(e.target.checked)}
                disabled={loading}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Keep Security Deposit</span>
              </div>
            </label>

            {keepDeposit && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kept Amount (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3 text-gray-500 font-medium">₹</div>
                    <input
                      type="number"
                      className="w-full pl-8 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-3 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all duration-200 min-h-[96px]"
                    placeholder="Why are you keeping the deposit?"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{formError}</p>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Confirm Return
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnProductModal;
