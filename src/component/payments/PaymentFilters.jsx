import React from 'react'

function PaymentFilters({ filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white p-4 rounded shadow grid grid-cols-5 gap-4">

      {/* Flow */}
      <select
        name="flow"
        value={filters.flow}
        onChange={handleChange}
        className="input"
      >
        <option value="">All Flow</option>
        <option value="CREDIT">Credit</option>
        <option value="DEBIT">Debit</option>
      </select>

      {/* Type */}
      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="input"
      >
        <option value="">All Type</option>
        <option value="RENTAL">Rental</option>
        <option value="DEPOSIT">Deposit</option>
        <option value="REFUND">Refund</option>
      </select>

      {/* From Date */}
      <input
        type="date"
        name="fromDate"
        value={filters.fromDate}
        onChange={handleChange}
        className="input"
      />

      {/* To Date */}
      <input
        type="date"
        name="toDate"
        value={filters.toDate}
        onChange={handleChange}
        className="input"
      />

      <button
        onClick={onSearch}
        className="btn-primary"
      >
        Search
      </button>

    </div>
  );
}

export default PaymentFilters;
