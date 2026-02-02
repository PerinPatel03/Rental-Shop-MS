import { useState } from "react";
import paymentService from "../../api/paymentService";

function AddPaymentModal({ bookingId, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [paymentType, setPaymentType] = useState("RENTAL");

  const submit = async () => {
    try {
        await paymentService.savePayment({
            bookingId: bookingId,
            paymentType: paymentType,
            amount: amount
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
        <h3 className="font-semibold mb-3">Add Payment</h3>

        <select
          className="input"
          value={paymentType}
          onChange={e => setPaymentType(e.target.value)}
        >
          <option>RENTAL</option>
          <option>DEPOSIT</option>
          <option>REFUND</option>
        </select>

        <input
          className="input mt-3"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={submit} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddPaymentModal;
