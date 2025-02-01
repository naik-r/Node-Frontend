import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthForm } from './components/AuthForm';
import { OrganizationSetup } from './components/OrganizationSetup';
import { ChatbotIntegration } from './components/ChatbotIntegration';
import { supabase } from './lib/supabaseClient';
import type { Organization, User } from './types';

function App() {
  const [step, setStep] = useState<'auth' | 'org' | 'integration'>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
        setStep('org');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Check if user profile exists, if not create it (for OAuth users)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select()
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          await supabase.from('user_profiles').insert([
            {
              id: session.user.id,
              email: session.user.email,
              auth_provider: session.user.app_metadata.provider || 'email',
            },
          ]);
        }

        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
        setStep('org');
      } else {
        setUser(null);
        setStep('auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setStep('org');
  };

  const handleOrgSuccess = (org: Organization) => {
    setOrganization(org);
    setStep('integration');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          {/* Progress Steps */}
          <div className="w-full max-w-3xl mb-8">
            <div className="flex items-center justify-between relative">
              <div className="w-full absolute top-1/2 transform -translate-y-1/2">
                <div className="h-0.5 bg-gray-200">
                  <div
                    className="h-0.5 bg-blue-600 transition-all duration-500"
                    style={{
                      width: step === 'auth' ? '0%' : step === 'org' ? '50%' : '100%',
                    }}
                  />
                </div>
              </div>
              {['auth', 'org', 'integration'].map((s, index) => (
                <div
                  key={s}
                  className={`relative flex flex-col items-center ${
                    index <= ['auth', 'org', 'integration'].indexOf(step)
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= ['auth', 'org', 'integration'].indexOf(step)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="mt-2 text-sm font-medium">
                    {s === 'auth'
                      ? 'Authentication'
                      : s === 'org'
                      ? 'Organization'
                      : 'Integration'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {step === 'auth' && <AuthForm onSuccess={handleAuthSuccess} />}
          {step === 'org' && user && (
            <OrganizationSetup onSuccess={handleOrgSuccess} userId={user.id} />
          )}
          {step === 'integration' && organization && (
            <ChatbotIntegration organizationId={organization.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App