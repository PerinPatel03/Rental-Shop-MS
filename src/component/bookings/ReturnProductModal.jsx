import { useState } from "react";
import bookingService from "../../api/bookingService";

function ReturnProductModal({ bookingId, onClose, onSuccess }) {
  const [keepDeposit, setKeepDeposit] = useState(false);
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");

  const submit = async () => {
    try {
        await bookingService.returnBookedProduct(bookingId, {
            keptSecurityDeposit: keepDeposit ? amount : 0,
            keptDepositReason: keepDeposit ? reason : "Not required"
        });
        onSuccess();
        onClose();
        
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3 className="font-semibold mb-3">Return Product</h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={keepDeposit}
            onChange={e => setKeepDeposit(e.target.checked)}
          />
          Keep Security Deposit
        </label>

        {keepDeposit && (
          <>
            <input
              type="number"
              className="input mt-2"
              placeholder="Kept Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <textarea
              className="input mt-2"
              placeholder="Reason"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} className="btn-warning">
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnProductModal;
