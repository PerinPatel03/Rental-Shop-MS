import React, { useEffect, useState } from 'react'
import dashboardService from '../../api/dashboardService';
import { ActiveBookingsTable, RecentPaymentsTable, SummaryCard } from '../../component/index'

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);

  const loadDashboard = async () => {
    try {
      const [summaryRes, paymentsRes, bookingsRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecentPayments(5),
        dashboardService.getActiveBookings(),
      ]);

      setSummary(summaryRes);
      setRecentPayments(paymentsRes);
      setActiveBookings(bookingsRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!summary) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <SummaryCard title="Total Revenue" value={summary.totalRevenue} />
        <SummaryCard title="Held Deposits" value={summary.totalSecurityDepositHeld} />
        <SummaryCard title="Total Due" value={summary.totalDue} />
        <SummaryCard title="Active Rentals" value={summary.activeRentals} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-2 gap-6">
        <RecentPaymentsTable payments={recentPayments} />
        <ActiveBookingsTable bookings={activeBookings} />
      </div>
    </div>
  );
}

export default Dashboard
