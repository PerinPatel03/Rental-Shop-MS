import React, { useEffect, useState } from 'react'
import paymentService from '../../api/paymentService';
import { PaymentFilters, PaymentTable } from '../../component/index'

function PaymentsList() {

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-2xl font-semibold">Payments</h2>

      <PaymentFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchPayments}
      />

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <PaymentTable payments={payments} />
      )}

    </div>
  );
}

export default PaymentsList;
