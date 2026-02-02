import React, { useEffect, useState } from 'react'
import paymentService from '../../api/paymentService';

function PaymentSummary({ booking }) {
    const [payments, setPayments] = useState([]);

    const fetchPayments = async () => {
        try {
            const res = await paymentService.findPaymentsByBookingId(booking.id);
            if (res) 
                setPayments(res);
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPayments();
    }, [booking]);

  const totalPaid = payments
    .filter(p => p.paymentFlow === "CREDIT")
    .reduce((s, p) => s + Number(p.amount), 0);

  const totalRefunded = payments
    .filter(p => p.paymentFlow === "DEBIT")
    .reduce((s, p) => s + Number(p.amount), 0);

  const baseAmount =
    booking.bookingStatus === "RETURNED"
      ? booking.totalAmount + booking.keptSecurityDeposit
      : booking.totalAmount + booking.securityDeposit;

  const due = baseAmount - (totalPaid - totalRefunded);

  return (
    <div className="bg-white p-4 rounded shadow grid grid-cols-3 gap-4">
      <div>Total Rent: ₹{booking.totalAmount}</div>
      <div>Security Deposit: ₹{booking.securityDeposit}</div>
      <div>Kept Deposit: ₹{booking.keptSecurityDeposit}</div>

      <div>Total Paid: ₹{totalPaid}</div>
      <div>Total Refunded: ₹{totalRefunded}</div>
      <div className="font-semibold">
        {/* Due: ₹{Math.max(due, 0)} */}
        Due: ₹{due}
      </div>
    </div>
  );
}

export default PaymentSummary;
