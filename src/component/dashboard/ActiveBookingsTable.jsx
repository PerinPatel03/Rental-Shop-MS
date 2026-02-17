import React from 'react'
import { useNavigate } from 'react-router'
import {
  Package,
  Calendar,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react'

function ActiveBookingsTable({ bookings }) {
  const navigate = useNavigate();

  const getBookingStatusColor = (status) => {
    const s = status?.toLowerCase?.();
    if (s === 'reserved') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'picked_up') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'returned') return 'bg-gray-100 text-gray-800 border-gray-200';
    if (s === 'overdue') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'cancelled') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getBookingStatusIcon = (status) => {
    const s = status?.toLowerCase?.();
    if (s === 'reserved') return <Clock className="w-4 h-4" />;
    if (s === 'picked_up') return <CheckCircle className="w-4 h-4" />;
    if (s === 'returned') return <Package className="w-4 h-4" />;
    if (s === 'overdue') return <AlertTriangle className="w-4 h-4" />;
    if (s === 'cancelled') return <XCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getPaymentStatusColor = (status) => {
    const s = status?.toLowerCase?.();
    if (s === 'paid') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (s === 'partial') return 'bg-orange-100 text-orange-800 border-orange-200';
    if (s === 'overdue') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentStatusIcon = (status) => {
    const s = status?.toLowerCase?.();
    if (s === 'paid') return <CheckCircle className="w-3 h-3" />;
    if (s === 'pending') return <Clock className="w-3 h-3" />;
    if (s === 'partial') return <AlertTriangle className="w-3 h-3" />;
    if (s === 'overdue') return <XCircle className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  const formatDate = (dateVal) => {
    if (!dateVal) return '—';
    try {
      const d = new Date(dateVal);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateVal);
    }
  };

  const list = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Booking
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Booking Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">No active rentals</p>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((b) => {
                const id = b.id ?? b.bookingId;
                const productName = b.productName ?? (b.productId != null ? `Product #${b.productId}` : '—');
                const productCode = b.productCode ?? b.productId ?? '';
                const customerName = b.customerName ?? (b.customerId != null ? `Customer #${b.customerId}` : '—');
                const phoneNumber = b.phoneNumber ?? '';
                const startDate = b.startDate != null ? formatDate(b.startDate) : '—';
                const endDate = b.endDate != null ? formatDate(b.endDate) : '—';
                const createdLabel = b.createdAt != null ? formatDate(b.createdAt) : '';

                return (
                  <tr key={id ?? b.bookingId ?? Math.random()} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">#{id}</div>
                      {createdLabel && (
                        <div className="text-sm text-gray-500">{createdLabel}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{productName}</div>
                          {productCode !== '' && (
                            <div className="text-sm text-gray-500">#{productCode}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{customerName}</div>
                      {phoneNumber && (
                        <div className="text-sm text-gray-500">{phoneNumber}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{startDate}</div>
                      <div className="text-sm text-gray-500">→ {endDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getBookingStatusColor(b.bookingStatus)}`}>
                        {getBookingStatusIcon(b.bookingStatus)}
                        <span className="ml-1 capitalize">{(b.bookingStatus ?? '—').replace(/_/g, ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(b.paymentStatus)}`}>
                        {getPaymentStatusIcon(b.paymentStatus)}
                        <span className="ml-1 capitalize">{b.paymentStatus ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => id != null && navigate(`/bookings/${id}`)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => id != null && navigate(`/bookings/${id}/edit`)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit Booking"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {list.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Showing {list.length} rental{list.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

export default ActiveBookingsTable;
