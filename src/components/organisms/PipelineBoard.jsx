import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import DealCard from "@/components/molecules/DealCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const PipelineBoard = ({ 
  onEditDeal,
  onDeleteDeal,
  onComposeEmail,
  onDealClick,
  className = "",
  ...props 
}) => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const stages = [
    { id: "lead", name: "Lead", color: "bg-blue-500" },
    { id: "qualified", name: "Qualified", color: "bg-yellow-500" },
    { id: "proposal", name: "Proposal", color: "bg-purple-500" },
    { id: "won", name: "Won", color: "bg-green-500" },
    { id: "lost", name: "Lost", color: "bg-red-500" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading pipeline data:", err);
      setError("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

const handleDealClick = (deal) => {
    if (onDealClick) {
      onDealClick(deal);
    }
  };

  const handleEditDeal = (deal) => {
    onEditDeal(deal);
  };

  const handleDeleteDeal = async (deal) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(deal.Id);
        setDeals(prev => prev.filter(d => d.Id !== deal.Id));
        toast.success("Deal deleted successfully!");
      } catch (error) {
        console.error("Error deleting deal:", error);
        toast.error("Failed to delete deal");
      }
    }
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === parseInt(contactId));
  };

  const getStageValue = (stageId) => {
    const stageDeals = getDealsForStage(stageId);
    return stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  };

  if (loading) {
    return <Loading type="pipeline" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadData}
          className="mt-2 btn btn-primary btn-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)} {...props}>
      <div className="flex space-x-6 overflow-x-auto pb-4 h-full">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          const stageValue = getStageValue(stage.id);
          
          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <div className="pipeline-column h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={cn("w-3 h-3 rounded-full", stage.color)} />
                    <h3 className="font-medium text-gray-900">{stage.name}</h3>
                    <span className="text-sm text-gray-500">({stageDeals.length})</span>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    ${stageValue.toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-3 custom-scrollbar overflow-y-auto flex-1">
                  {stageDeals.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="Inbox" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No deals in this stage</p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <DealCard
                        key={deal.Id}
                        deal={deal}
                        contact={getContactForDeal(deal.contactId)}
                        onClick={handleDealClick}
                        onEdit={handleEditDeal}
                        onDelete={handleDeleteDeal}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineBoard;