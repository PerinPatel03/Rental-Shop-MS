import React from 'react'
import {
  CreditCard,
  Calendar,
  IndianRupee,
  Receipt,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

function RecentPaymentsTable({ payments }) {
  const getPaymentTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'rental': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deposit': return 'bg-green-100 text-green-800 border-green-200';
      case 'refund': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentFlowColor = (flow) => {
    switch (flow?.toLowerCase()) {
      case 'credit':
      case 'incoming': return 'bg-green-100 text-green-800 border-green-200';
      case 'debit':
      case 'outgoing': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentFlowIcon = (flow) => {
    switch (flow?.toLowerCase()) {
      case 'credit':
      case 'incoming': return <ArrowUpRight className="w-4 h-4" />;
      case 'debit':
      case 'outgoing': return <ArrowDownRight className="w-4 h-4" />;
      default: return <ArrowUpRight className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: 'N/A', time: '' };
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } catch {
      return { date: dateString, time: '' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Flow
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!payments?.length ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Receipt className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No recent payments</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map(payment => {
                const dateInfo = formatDate(payment.paidAt);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
                          <div className="text-xs text-gray-500">Payment</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">#{payment.bookingId}</div>
                      <div className="text-xs text-gray-500">Booking</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentFlowColor(payment.paymentFlow)}`}>
                        {getPaymentFlowIcon(payment.paymentFlow)}
                        <span className="ml-1 capitalize">{payment.paymentFlow}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentTypeColor(payment.paymentType)}`}>
                        <span className="capitalize">{payment.paymentType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-semibold text-gray-900">
                          {parseFloat(payment.amount || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-gray-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{dateInfo.date}</div>
                          <div className="text-xs text-gray-500">{dateInfo.time}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {payments?.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {payments.length} payment{payments.length > 1 ? 's' : ''}
            </span>
            <span className="font-bold text-gray-900">
              Total: ₹{payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentPaymentsTable;
