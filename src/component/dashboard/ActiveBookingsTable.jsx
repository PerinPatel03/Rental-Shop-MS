import React from 'react'

function ActiveBookingsTable({ bookings }) {

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4">Active Rentals</h3>

      <table className="w-full text-sm">
        <thead className="text-left text-gray-500 border-b">
          <tr>
            <th className="pb-2">Booking</th>
            <th className="pb-2">Product</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Period</th>
            <th className="pb-2">Booking Status</th>
            <th className="pb-2">Payment Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingId} className="border-b last:border-none">
              <td className="py-2">#{b.bookingId}</td>
              <td>{b.productId}</td>
              <td>{b.customerId}</td>
              <td>
                {b.startDate} → {b.endDate}
              </td>
              <td>{b.bookingStatus}</td>
              <td>{b.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ActiveBookingsTable
