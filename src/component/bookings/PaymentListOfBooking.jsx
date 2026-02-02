import React, { useEffect, useState } from 'react'
import paymentService from '../../api/paymentService';

function PaymentListOfBooking({ booking }) {
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Payments</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Date</th>
            <th>Payment Type</th>
            <th>Payment Flow</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b text-center">
              <td>{p.paidAt}</td>
              <td>{p.paymentType}</td>
              <td>{p.paymentFlow}</td>
              <td>₹{p.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentListOfBooking
