import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ActivityItem from "@/components/molecules/ActivityItem";
import EmailComposer from "@/components/organisms/EmailComposer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";

const Activities = () => {
  const { onMenuClick } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [selectedEmailContact, setSelectedEmailContact] = useState(null);
  const [selectedEmailDeal, setSelectedEmailDeal] = useState(null);

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, typeFilter]);

  const loadActivities = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      console.error("Error loading activities:", err);
      setError("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredActivities(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === parseInt(contactId));
  };

  const getDealForActivity = (dealId) => {
    return deals.find(deal => deal.Id === parseInt(dealId));
  };

const handleComposeEmail = (contact = null, deal = null) => {
    setSelectedEmailContact(contact);
    setSelectedEmailDeal(deal);
    setIsEmailComposerOpen(true);
  };

  const handleEmailSent = (emailData) => {
    // Log email activity
    console.log("Email sent:", emailData);
    toast.success(`Email sent to ${emailData.to}`);
    // Refresh activities to show the new email activity
    loadActivities();
  };

  const activityTypes = [
    { value: "call", label: "Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" },
    { value: "task", label: "Task" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Activities"
          subtitle="Track interactions and tasks"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Loading type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Activities"
          subtitle="Track interactions and tasks"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadActivities} />
        </div>
      </div>
    );
  }

  const hasFilters = searchTerm || typeFilter;

  return (
    <div className="flex flex-col h-full">
<Header
        title="Activities"
        subtitle="Track interactions and tasks"
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onMenuClick={onMenuClick}
        actions={
          <Button
            variant="primary"
            icon="Mail"
            onClick={() => handleComposeEmail()}
          >
            Compose Email
          </Button>
        }
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Select
              placeholder="Filter by type"
              value={typeFilter}
              onChange={handleTypeFilterChange}
              options={activityTypes}
              className="w-48"
            />
            
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                icon="X"
                className="text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Activities List */}
          {filteredActivities.length === 0 ? (
            <Empty
              icon="Activity"
              title="No activities found"
              description={hasFilters 
                ? "Try adjusting your search or filters."
                : "Activities will appear here as you interact with contacts and deals."
              }
            />
          ) : (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredActivities.map((activity, index) => (
                <motion.div
                  key={activity.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ActivityItem
                    activity={activity}
                    contact={getContactForActivity(activity.contactId)}
                    deal={getDealForActivity(activity.dealId)}
                    showContact={true}
                    showDeal={true}
                  />
                </motion.div>
              ))}
            </motion.div>
)}
        </div>
      </div>

      {/* Email Composer */}
      <EmailComposer
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        contact={selectedEmailContact}
        deal={selectedEmailDeal}
        onSent={handleEmailSent}
      />
    </div>
  );
};

export default Activities;