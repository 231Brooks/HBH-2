-- Performance optimizing indexes for the real estate platform

-- Property indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON "Property"(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON "Property"(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON "Property"(price);
CREATE INDEX IF NOT EXISTS idx_properties_location ON "Property"(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_beds_baths ON "Property"(beds, baths);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON "Property"(createdAt);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_transactions_status ON "Transaction"(status);
CREATE INDEX IF NOT EXISTS idx_transactions_property ON "Transaction"(propertyId);
CREATE INDEX IF NOT EXISTS idx_transactions_creator ON "Transaction"(creatorId);
CREATE INDEX IF NOT EXISTS idx_transactions_closing_date ON "Transaction"(closingDate);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);
CREATE INDEX IF NOT EXISTS idx_user_location ON "User"(location);
CREATE INDEX IF NOT EXISTS idx_user_verified ON "User"(emailVerified, phoneVerified, identityVerified);

-- Message indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON "Message"(conversationId, createdAt);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON "Message"(senderId);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON "Message"(receiverId);
CREATE INDEX IF NOT EXISTS idx_messages_read ON "Message"(read);

-- Service indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON "Service"(category);
CREATE INDEX IF NOT EXISTS idx_services_provider ON "Service"(providerId);
CREATE INDEX IF NOT EXISTS idx_services_verified ON "Service"(verified);

-- Appointment indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date ON "Appointment"(startTime);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON "Appointment"(userId);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON "Appointment"(type);

-- Review indexes
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON "Review"(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_author ON "Review"(authorId);
CREATE INDEX IF NOT EXISTS idx_reviews_receiver ON "Review"(receiverId);

-- Project indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON "Project"(status);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON "Project"(ownerId);
CREATE INDEX IF NOT EXISTS idx_projects_service ON "Project"(serviceId);

-- SavedProperty indexes
CREATE INDEX IF NOT EXISTS idx_saved_properties_user ON "SavedProperty"(userId);

-- JobListing indexes
CREATE INDEX IF NOT EXISTS idx_job_listings_category ON "JobListing"(category);
CREATE INDEX IF NOT EXISTS idx_job_listings_location ON "JobListing"(location);
CREATE INDEX IF NOT EXISTS idx_job_listings_created_at ON "JobListing"(createdAt);
