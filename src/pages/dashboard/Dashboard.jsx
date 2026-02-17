import React, { useEffect, useState } from 'react'
import {
  DollarSign,
  Shield,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Calendar,
  CreditCard,
  Package,
  Users,
  BarChart3,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import dashboardService from '../../api/dashboardService';
import { ActiveBookingsTable, RecentPaymentsTable } from '../../component/index'

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const [summaryRes, paymentsRes, bookingsRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getRecentPayments(5),
        dashboardService.getActiveBookings(),
      ]);

      setSummary(summaryRes);
      setRecentPayments(paymentsRes);
      setActiveBookings(bookingsRes);
      setLastUpdated(new Date());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Enhanced Summary Card Component
  const EnhancedSummaryCard = ({ title, value, icon: Icon, trend, color, bgColor }) => {
    const isPositive = trend > 0;
    const isNegative = trend < 0;

    return (
      <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : isNegative ? <TrendingDown className="w-4 h-4" /> : null}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">
            ₹ {Number(value || 0).toLocaleString()}
          </h3>
        </div>
      </div>
    );
  };

  // Quick Action Button Component
  const QuickActionButton = ({ icon: Icon, title, description, onClick, color, bgColor }) => (
    <button
      onClick={onClick}
      className={`${bgColor} ${color} rounded-xl p-4 text-left hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <p className="text-xs opacity-80">{description}</p>
    </button>
  );

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-2xl p-6 mb-6">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-2xl p-6">
            <div className="h-12 w-12 bg-gray-300 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Recent Activity Component
  // const RecentActivity = () => {
  //   const activities = [
  //     { id: 1, type: 'payment', message: 'Payment received for Booking #1234', time: '2 minutes ago', status: 'success' },
  //     { id: 2, type: 'booking', message: 'New booking created for DSLR Camera', time: '15 minutes ago', status: 'info' },
  //     { id: 3, type: 'return', message: 'Product returned: Gaming Laptop', time: '1 hour ago', status: 'warning' },
  //     { id: 4, type: 'payment', message: 'Overdue payment reminder sent', time: '2 hours ago', status: 'error' },
  //   ];

  //   const getActivityIcon = (type, status) => {
  //     const iconProps = { className: "w-4 h-4" };
  //     switch (status) {
  //       case 'success': return <CheckCircle {...iconProps} className="text-green-500" />;
  //       case 'error': return <XCircle {...iconProps} className="text-red-500" />;
  //       case 'warning': return <AlertTriangle {...iconProps} className="text-yellow-500" />;
  //       default: return <AlertCircle {...iconProps} className="text-blue-500" />;
  //     }
  //   };

  //   return (
  //     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
  //       <div className="flex items-center justify-between mb-6">
  //         <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
  //         <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
  //           View All
  //         </button>
  //       </div>
  //       <div className="space-y-4">
  //         {activities.map((activity) => (
  //           <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
  //             <div className="flex-shrink-0 mt-0.5">
  //               {getActivityIcon(activity.type, activity.status)}
  //             </div>
  //             <div className="flex-1 min-w-0">
  //               <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
  //               <p className="text-xs text-gray-500 flex items-center mt-1">
  //                 <Clock className="w-3 h-3 mr-1" />
  //                 {activity.time}
  //               </p>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  if (isLoading) {
    return (
      <div className="min-h-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Admin! 👋</h1>
              <p className="text-orange-100 mb-4">
                Here's what's happening with your rental business today.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
                <button
                  onClick={loadDashboard}
                  className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">{summary?.activeRentals || 0}</div>
                  <div className="text-sm text-orange-100">Active Rentals Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EnhancedSummaryCard
            title="Total Revenue"
            value={summary.totalRevenue}
            icon={DollarSign}
            trend={12.5}
            color="bg-green-500"
            bgColor="bg-green-50"
          />
          <EnhancedSummaryCard
            title="Held Deposits"
            value={summary.totalSecurityDepositHeld}
            icon={Shield}
            trend={-2.1}
            color="bg-blue-500"
            bgColor="bg-blue-50"
          />
          <EnhancedSummaryCard
            title="Total Due"
            value={summary.totalDue}
            icon={AlertTriangle}
            trend={8.3}
            color="bg-yellow-500"
            bgColor="bg-yellow-50"
          />
          <EnhancedSummaryCard
            title="Active Rentals"
            value={summary.activeRentals}
            icon={Activity}
            trend={5.7}
            color="bg-purple-500"
            bgColor="bg-purple-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={Plus}
              title="Add Product"
              description="Add new rental item"
              onClick={() => window.location.href = '/products/add'}
              color="text-blue-600"
              bgColor="bg-blue-50 hover:bg-blue-100"
            />
            <QuickActionButton
              icon={Calendar}
              title="New Booking"
              description="Create rental booking"
              onClick={() => window.location.href = '/bookings/add'}
              color="text-green-600"
              bgColor="bg-green-50 hover:bg-green-100"
            />
            <QuickActionButton
              icon={Users}
              title="Add Customer"
              description="Register new customer"
              onClick={() => window.location.href = '/customers/add'}
              color="text-purple-600"
              bgColor="bg-purple-50 hover:bg-purple-100"
            />
            <QuickActionButton
              icon={BarChart3}
              title="View Reports"
              description="Analytics & insights"
              onClick={() => window.location.href = '/analytics'}
              color="text-orange-600"
              bgColor="bg-orange-50 hover:bg-orange-100"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div>
          {/* Recent Activity - Takes up 1 column on large screens */}
          {/* Tables - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Payments */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Recent Payments
                  </h3>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RecentPaymentsTable payments={recentPayments} />
              </div>
            </div>

            {/* Active Bookings */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Active Rentals
                  </h3>
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <ActiveBookingsTable bookings={activeBookings} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard
