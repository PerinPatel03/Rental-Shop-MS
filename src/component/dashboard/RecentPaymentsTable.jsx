import React from 'react'

function RecentPaymentsTable({ payments }) {

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="pb-2">Booking</th>
            <th className="pb-2">Flow</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b last:border-none">
              <td className="py-2">#{p.bookingId}</td>
              <td>{p.paymentFlow}</td>
              <td>{p.paymentType}</td>
              <td>₹ {Number(p.amount).toLocaleString()}</td>
              <td>{new Date(p.paidAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentPaymentsTable
