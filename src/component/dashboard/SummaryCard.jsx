import React from 'react'

function SummaryCard({ title, value }) {

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">
        ₹ {Number(value || 0).toLocaleString()}
      </h3>
    </div>
  );
}

export default SummaryCard
