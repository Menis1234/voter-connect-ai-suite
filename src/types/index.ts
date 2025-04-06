
// Voter model
export type Voter = {
  id: string;
  name: string;
  phone: string;
  region: string;
  ward: string;
  gender: "male" | "female" | "other";
  voterStatus: "supporter" | "undecided" | "opposed" | "unknown";
  delegateId?: string;
  sentimentScore?: number;
  lastContact?: string;
  languages?: string[];
  pollingStation?: string;
  notes?: string;
  tags?: string[];
};

// Delegate model
export type Delegate = {
  id: string;
  name: string;
  phone: string;
  region: string;
  assignedVoters: string[];
  performanceScore?: number;
  lastActivity?: string;
  role: "junior" | "senior" | "coordinator";
};

// Message model
export type Message = {
  id: string;
  type: "sms" | "whatsapp" | "telegram" | "ussd";
  content: string;
  senderId: string;
  receiverIds: string[];
  timestamp: string;
  deliveryStatus: "sent" | "delivered" | "read" | "failed";
  language?: "en" | "sw";
  sentiment?: "positive" | "neutral" | "negative";
  isTemplate?: boolean;
};

// Dashboard stats types
export type RegionEngagement = {
  region: string;
  engagementRate: number;
  voterCount: number;
  activeDelegates: number;
};

export type CampaignStats = {
  totalVoters: number;
  totalDelegates: number;
  messagesSent: number;
  supporterConversion: number;
  activeRegions: number;
};

// Sentiment Analysis
export type SentimentDistribution = {
  positive: number;
  neutral: number;
  negative: number;
};

// Activity Feed Item
export type ActivityItem = {
  id: string;
  action: string;
  timestamp: string;
  region?: string;
  type: "sms" | "whatsapp" | "telegram" | "system" | "delegate";
  status?: "success" | "pending" | "failed";
};
