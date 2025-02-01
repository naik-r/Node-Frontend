import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building2, Globe, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Organization } from '../types';

interface OrganizationSetupProps {
  onSuccess: (org: Organization) => void;
  userId: string;
}

export function OrganizationSetup({ onSuccess, userId }: OrganizationSetupProps) {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert([
          {
            name,
            website_url: websiteUrl,
            description,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Simulate website scraping
      await supabase.from('webpages').insert([
        {
          url: `${websiteUrl}/home`,
          status: 'scraped',
          meta_description: 'Home page of the website',
          org_id: data.id,
        },
        {
          url: `${websiteUrl}/about`,
          status: 'in_progress',
          meta_description: 'About page',
          org_id: data.id,
        },
        {
          url: `${websiteUrl}/contact`,
          status: 'pending',
          meta_description: 'Contact page',
          org_id: data.id,
        },
      ]);

      toast.success('Organization created successfully!');
      onSuccess(data);
    } catch (error) {
      toast.error('Failed to create organization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8">Setup Organization</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <div className="mt-1 relative">
            <input
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Building2 className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website URL</label>
          <div className="mt-1 relative">
            <input
              type="url"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            <Globe className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <div className="mt-1 relative">
            <textarea
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FileText className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Organization'}
        </button>
      </form>
    </div>
  );
}