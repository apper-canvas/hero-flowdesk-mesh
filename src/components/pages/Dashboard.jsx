import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Button from '@/components/atoms/Button'
import Empty from '@/components/ui/Empty'
import Error from '@/components/ui/Error'
import Loading from '@/components/ui/Loading'
import Activities from '@/components/pages/Activities'
import MetricCard from '@/components/molecules/MetricCard'
import ActivityItem from "@/components/molecules/ActivityItem";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";
import { setActivities } from '@/store/activitySlice'
const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  const dispatch = useDispatch();
  const { activities } = useSelector((state) => state.activity);
const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [conversionMetrics, setConversionMetrics] = useState({ totalDeals: 0, wonDeals: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Auto-refresh interval
  const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

useEffect(() => {
    loadDashboardData();
    
    // Listen for data change events from other components
    const handleDataChange = () => {
      loadDashboardData(true); // Silent refresh
    };
    
    // Listen for activity creation events for immediate updates
    const handleActivityCreated = (event) => {
      // Refresh activities immediately when new activity is created
      loadActivitiesData();
    };
    
    window.addEventListener('dataChanged', handleDataChange);
    window.addEventListener('activityCreated', handleActivityCreated);
    
    // Set up auto-refresh interval
    const intervalId = setInterval(() => {
      loadDashboardData(true); // Silent background refresh
    }, AUTO_REFRESH_INTERVAL);
    
    return () => {
      window.removeEventListener('dataChanged', handleDataChange);
      window.removeEventListener('activityCreated', handleActivityCreated);
      clearInterval(intervalId);
    };
  }, []);
const loadDashboardData = async (silent = false) => {
    // Use refreshing state for manual refresh, loading for initial load
    if (!silent) {
      if (contacts.length > 0) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
    }
    setError("");
try {
      const [contactsData, dealsData, activitiesData, revenueData, conversionData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        dealService.getRevenue(),
        dealService.getConversionMetrics()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setRevenue(revenueData);
      setConversionMetrics(conversionData);
      dispatch(setActivities(activitiesData));
      
      if (!silent && refreshing) {
        toast.success("Dashboard data refreshed");
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
      if (!silent) {
        toast.error("Failed to refresh dashboard data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadActivitiesData = async () => {
    try {
      const activitiesData = await activityService.getAll();
      dispatch(setActivities(activitiesData));
    } catch (err) {
      console.error("Error loading activities:", err);
    }
  };

  const handleManualRefresh = () => {
    loadDashboardData(false); // Manual refresh with user feedback
  };

const getMetrics = () => {
    const totalContacts = contacts.length;
    const activeDeals = deals.filter(deal => deal.stage !== "won" && deal.stage !== "lost").length;
    
    // Use dynamic aggregated data for revenue and conversion rate
    return {
      totalContacts,
      activeDeals,
      conversionRate: conversionMetrics.conversionRate,
      totalRevenue: revenue
    };
  };

const getRecentActivities = () => {
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === parseInt(contactId));
  };

  const getDealForActivity = (dealId) => {
    return deals.find(deal => deal.Id === parseInt(dealId));
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your CRM overview"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Loading type="grid" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Dashboard"
          subtitle="Welcome back! Here's your CRM overview"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  const metrics = getMetrics();
  const recentActivities = getRecentActivities();

return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's your CRM overview"
        onMenuClick={onMenuClick}
        actions={
          <Button
            variant="secondary"
            icon="RefreshCw"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className={refreshing ? "animate-spin" : ""}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        }
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Metrics Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MetricCard
              title="Total Contacts"
              value={metrics.totalContacts}
              icon="Users"
              change="+12% from last month"
              changeType="positive"
            />
            <MetricCard
              title="Active Deals"
              value={metrics.activeDeals}
              icon="DollarSign"
              change="+8% from last month"
              changeType="positive"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              icon="TrendingUp"
              change="+2.5% from last month"
              changeType="positive"
            />
            <MetricCard
              title="Total Revenue"
              value={`$${metrics.totalRevenue.toLocaleString()}`}
              icon="Target"
              change="+15% from last month"
              changeType="positive"
            />
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            className="bg-white rounded-lg shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="gradient-header rounded-t-lg p-6">
              <h2 className="text-xl font-bold font-display">Recent Activities</h2>
            </div>
            
            <div className="p-6">
              {recentActivities.length === 0 ? (
                <Empty
                  icon="Activity"
                  title="No recent activities"
                  description="Activities will appear here as you interact with contacts and deals."
                />
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <ActivityItem
                      key={activity.Id}
                      activity={activity}
                      contact={getContactForActivity(activity.contactId)}
                      deal={getDealForActivity(activity.dealId)}
                      showContact={true}
                      showDeal={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;