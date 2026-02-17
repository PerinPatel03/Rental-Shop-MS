import React, { useEffect, useState } from 'react'
import paymentService from '../../api/paymentService';
import { Receipt, Calendar, CreditCard, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';

function PaymentListOfBooking({ booking }) {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            setIsLoading(true);
            const res = await paymentService.findPaymentsByBookingId(booking.id);
            if (res)
                setPayments(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPayments();
    }, [booking]);

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
            case 'incoming': return 'bg-green-100 text-green-800 border-green-200';
            case 'outgoing': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const totalAmount = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Receipt className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
                            <p className="text-sm text-gray-600">Transaction records for this booking</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Total Paid</div>
                            <div className="text-lg font-bold text-blue-900">₹{totalAmount.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={fetchPayments}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Refresh payments"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Payment Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Direction
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse">
                                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                                            <div className="h-3 bg-gray-200 rounded w-16 mt-1"></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse h-6 bg-gray-200 rounded w-20"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse h-6 bg-gray-200 rounded w-16"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse h-6 bg-gray-200 rounded w-18"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="animate-pulse h-6 bg-gray-200 rounded w-14"></div>
                                    </td>
                                </tr>
                            ))
                        ) : payments.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <Receipt className="w-12 h-12 text-gray-300 mb-3" />
                                        <p className="text-gray-500 text-sm">No payments recorded yet</p>
                                        <p className="text-gray-400 text-xs mt-1">Payment history will appear here</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            payments.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-1.5 bg-gray-100 rounded-lg">
                                                <Calendar className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {formatDate(payment.paidAt).split(',')[0]}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(payment.paidAt).split(',')[1]?.trim()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentTypeColor(payment.paymentType)}`}>
                                            <CreditCard className="w-3 h-3 mr-1" />
                                            {payment.paymentType || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentFlowColor(payment.paymentFlow)}`}>
                                            {payment.paymentFlow === 'incoming' ? (
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                                <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                                            )}
                                            {payment.paymentFlow || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <DollarSign className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                ₹{parseFloat(payment.amount || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                                            Completed
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with summary */}
            {payments.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                            {payments.length} payment{payments.length > 1 ? 's' : ''} recorded
                        </span>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentListOfBooking
