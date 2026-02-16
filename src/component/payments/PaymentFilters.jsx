import React from 'react'
import { Filter, Search, Calendar, CreditCard, TrendingUp, TrendingDown, X } from 'lucide-react'

function PaymentFilters({ filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      flow: "",
      type: "",
      fromDate: "",
      toDate: "",
      page: 0,
      size: 20,
      showAdvanced: filters.showAdvanced
    });
  };

  const hasActiveFilters = filters.flow || filters.type || filters.fromDate || filters.toDate;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Filter className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            <p className="text-sm text-gray-600">Refine your payment search</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Payment Flow */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Payment Flow
          </label>
          <select
            name="flow"
            value={filters.flow}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="">All Flows</option>
            <option value="CREDIT">📈 Credit (Incoming)</option>
            <option value="DEBIT">📉 Debit (Outgoing)</option>
          </select>
        </div>

        {/* Payment Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Payment Type
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          >
            <option value="">All Types</option>
            <option value="RENTAL">🏠 Rental Payment</option>
            <option value="DEPOSIT">🛡️ Security Deposit</option>
            <option value="REFUND">💰 Refund</option>
          </select>
        </div>

        {/* From Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* To Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 text-sm">
            <Filter className="w-4 h-4 text-orange-600" />
            <span className="text-orange-800 font-medium">Active Filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.flow && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  Flow: {filters.flow}
                </span>
              )}
              {filters.type && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  Type: {filters.type}
                </span>
              )}
              {filters.fromDate && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  From: {filters.fromDate}
                </span>
              )}
              {filters.toDate && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                  To: {filters.toDate}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {hasActiveFilters ? 'Filters applied - click search to update results' : 'No filters applied - showing all payments'}
        </div>
        <button
          onClick={onSearch}
          className="inline-flex items-center px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors font-medium"
        >
          <Search className="w-4 h-4 mr-2" />
          Apply Filters
        </button>
      </div>
    </div>
  );
}

export default PaymentFilters;
