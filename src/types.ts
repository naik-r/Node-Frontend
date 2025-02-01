export interface Organization {
  id: string;
  name: string;
  website_url: string;
  description: string;
  user_id: string;
  created_at: string;
}

export interface WebPage {
  id: string;
  url: string;
  status: 'scraped' | 'in_progress' | 'pending';
  meta_description: string;
  org_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}