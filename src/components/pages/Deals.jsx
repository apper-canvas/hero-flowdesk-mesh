import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import EmailComposer from "@/components/organisms/EmailComposer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { dealService } from "@/services/api/dealService";

const Deals = () => {
  const { onMenuClick } = useOutletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [selectedEmailDeal, setSelectedEmailDeal] = useState(null);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = (deal) => {
    // This will be handled by PipelineBoard
    setRefreshKey(prev => prev + 1);
  };

const handleSaveDeal = (savedDeal) => {
    // Refresh the pipeline board
    setRefreshKey(prev => prev + 1);
  };

  const handleComposeEmail = (deal) => {
    setSelectedEmailDeal(deal);
    setIsEmailComposerOpen(true);
  };

  const handleEmailSent = (emailData) => {
    // Log email activity
    console.log("Email sent:", emailData);
    toast.success(`Email sent to ${emailData.to}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Deals"
          subtitle="Manage your sales pipeline"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Loading type="pipeline" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Deals"
          subtitle="Manage your sales pipeline"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={() => setRefreshKey(prev => prev + 1)} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Deals"
        subtitle="Manage your sales pipeline"
        onMenuClick={onMenuClick}
        actions={
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAddDeal}
          >
            Add Deal
          </Button>
        }
      />
      
      <div className="flex-1 p-6 overflow-hidden">
        <div className="h-full">
          <motion.div
            key={refreshKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
<PipelineBoard
              onEditDeal={handleEditDeal}
              onDeleteDeal={handleDeleteDeal}
              onComposeEmail={handleComposeEmail}
              className="h-full"
            />
          </motion.div>
        </div>
      </div>

{/* Deal Modal */}
      <DealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deal={selectedDeal}
        onSave={handleSaveDeal}
      />

      {/* Email Composer */}
      <EmailComposer
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        deal={selectedEmailDeal}
        onSent={handleEmailSent}
      />
    </div>
  );
};

export default Deals;