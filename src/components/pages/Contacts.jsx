import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Header from "@/components/organisms/Header";
import ContactCard from "@/components/molecules/ContactCard";
import ContactModal from "@/components/organisms/ContactModal";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { contactService } from "@/services/api/contactService";

const Contacts = () => {
  const { onMenuClick } = useOutletContext();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    lastContacted: "",
    dealStage: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, filters]);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      console.error("Error loading contacts:", err);
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(contact => contact.status === filters.status);
    }

    // Last contacted filter
    if (filters.lastContacted) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(contact => {
        if (!contact.lastContacted) return filters.lastContacted === "older";
        
        const contactDate = new Date(contact.lastContacted);
        
        switch (filters.lastContacted) {
          case "today":
            return contactDate >= today;
          case "week":
            return contactDate >= weekAgo;
          case "month":
            return contactDate >= monthAgo;
          case "older":
            return contactDate < monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredContacts(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: "",
      lastContacted: "",
      dealStage: ""
    });
    setSearchTerm("");
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (contact) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contact.Id);
        setContacts(prev => prev.filter(c => c.Id !== contact.Id));
        toast.success("Contact deleted successfully!");
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  const handleContactClick = (contact) => {
    // Handle contact click (could open detail modal)
    console.log("Contact clicked:", contact);
  };

  const handleSaveContact = (savedContact) => {
    if (selectedContact) {
      // Update existing contact
      setContacts(prev => prev.map(c => 
        c.Id === savedContact.Id ? savedContact : c
      ));
    } else {
      // Add new contact
      setContacts(prev => [...prev, savedContact]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Header
          title="Contacts"
          subtitle="Manage your customer relationships"
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
          title="Contacts"
          subtitle="Manage your customer relationships"
          onMenuClick={onMenuClick}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadContacts} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Contacts"
        subtitle="Manage your customer relationships"
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onMenuClick={onMenuClick}
        actions={
          <Button
            variant="primary"
            icon="Plus"
            onClick={handleAddContact}
          >
            Add Contact
          </Button>
        }
      />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Filters */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          {/* Contacts List */}
          {filteredContacts.length === 0 ? (
            <Empty
              icon="Users"
              title="No contacts found"
              description={searchTerm || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters."
                : "Get started by adding your first contact."
              }
              actionLabel="Add Contact"
              onAction={handleAddContact}
            />
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ContactCard
                    contact={contact}
                    onClick={handleContactClick}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default Contacts;