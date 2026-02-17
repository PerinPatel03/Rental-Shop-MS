import React, { useEffect, useState } from 'react'
import paymentService from '../../api/paymentService';
import { PaymentFilters, PaymentTable } from '../../component/index'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  Receipt,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    flow: "",
    type: "",
    fromDate: "",
    toDate: "",
    page: 0,
    size: 20
  });

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await paymentService.searchPayments(filters);
      setPayments(res.content || res); // supports paged or non paged
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Calculate payment statistics
  const stats = {
    totalPayments: payments.length,
    totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
    incomingAmount: payments
      .filter(p => p.paymentFlow?.toLowerCase() === 'incoming' || p.paymentFlow?.toLowerCase() === 'credit')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
    outgoingAmount: payments
      .filter(p => p.paymentFlow?.toLowerCase() === 'outgoing' || p.paymentFlow?.toLowerCase() === 'debit')
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0),
    recentPayments: payments.filter(p => {
      const paymentDate = new Date(p.paidAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return paymentDate >= weekAgo;
    }).length
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = !searchTerm ||
      payment.id?.toString().includes(searchTerm) ||
      payment.bookingId?.toString().includes(searchTerm) ||
      payment.paymentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.paymentFlow?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amount?.toString().includes(searchTerm);

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Management</h1>
              <p className="text-gray-600">Track and manage all payment transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchPayments}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh payments"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Total Payments</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalPayments}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900">₹{stats.totalAmount.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">This Week</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.recentPayments}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Net Flow</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ₹{(stats.incomingAmount - stats.outgoingAmount).toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-[35%] w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by payment ID, booking ID, type, or amount..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFilters(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }))}
                className={`p-3 border rounded-xl transition-colors ${
                  filters.showAdvanced ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                title="Advanced Filters"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {filters.showAdvanced && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Flow</label>
                  <select
                    name="flow"
                    value={filters.flow}
                    onChange={(e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Flows</option>
                    <option value="CREDIT">Credit (Incoming)</option>
                    <option value="DEBIT">Debit (Outgoing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="RENTAL">🏠 Rental Payment</option>
                    <option value="DEPOSIT">🛡️ Security Deposit</option>
                    <option value="REFUND">💰 Refund</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={(e) => setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={fetchPayments}
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <PaymentTable payments={filteredPayments} />
        )}

      </div>
    </div>
  );
}

export default PaymentsList;
