import React from 'react'

function PaymentTable({ payments }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Booking</th>
            <th className="p-3 text-left">Flow</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{p.id}</td>
              <td className="p-3">#{p.bookingId}</td>
              <td className="p-3">{p.paymentFlow}</td>
              <td className="p-3">{p.paymentType}</td>
              <td className="p-3 font-semibold">₹ {p.amount}</td>
              <td className="p-3">
                {new Date(p.paidAt).toLocaleString()}
              </td>
            </tr>
          ))}

          {payments.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center p-6 text-gray-500">
                No Payments Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentTable;
