import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityItem from "@/components/molecules/ActivityItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const { onMenuClick } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getMetrics = () => {
    const totalContacts = contacts.length;
    const activeDeals = deals.filter(deal => deal.stage !== "won" && deal.stage !== "lost").length;
    const wonDeals = deals.filter(deal => deal.stage === "won").length;
    const totalDeals = deals.length;
    const conversionRate = totalDeals > 0 ? ((wonDeals / totalDeals) * 100).toFixed(1) : 0;
    const totalRevenue = deals
      .filter(deal => deal.stage === "won")
      .reduce((sum, deal) => sum + (deal.value || 0), 0);

    return {
      totalContacts,
      activeDeals,
      conversionRate,
      totalRevenue
    };
  };

  const getRecentActivities = () => {
    return activities
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