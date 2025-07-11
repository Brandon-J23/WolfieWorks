"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User } from "lucide-react"

// Initialize Supabase client
// Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Basic check to ensure environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
  // You might want to display an error message to the user or redirect them
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Main App component for the confirmation page
export default function App() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setMessage('Your email has been successfully verified and you are now signed in!');
          setLoading(false);
          // Optional: Automatically redirect after a short delay
          // setTimeout(() => {
          //   window.location.href = '/'; // Redirect to home page
          // }, 3000);
        } else if (event === 'SIGNED_OUT') {
          setMessage('You have been signed out. Please sign in again.');
          setLoading(false);
        } else if (event === 'INITIAL_SESSION' && !session) {
          // If there's no session on initial load, it means the confirmation link might not have signed them in
          // Or they landed here without a valid confirmation
          setMessage('Please check your email for the confirmation link. If you already clicked it, you might need to sign in.');
          setLoading(false);
        }
      }
    );

    // Initial check for session in case the listener doesn't fire immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMessage('Your email has been successfully verified and you are now signed in!');
        setLoading(false);
      } else {
        // This might happen if the user lands directly on this page without a fresh confirmation click
        // or if the session expired. The listener above will handle actual sign-in events.
        setMessage('Please check your email for the confirmation link. If you already clicked it, you might need to sign in.');
        setLoading(false);
      }
    });


    // Cleanup the listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleBackToHome = () => {
    // Redirect to the home page
    window.location.href = '/';
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-inter">
      {/* WolfieWorks Logo */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <GraduationCap className="h-8 w-8 text-red-600" />
          <span className="text-2xl font-bold text-gray-900">WolfieWorks</span>
        </div>
      </div>

      {/* Confirmation Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Sign Up Confirmation</h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-red-600 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">{message}</p>
          </div>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-6">{message}</p>
            <button
              onClick={handleBackToHome}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-md"
            >
              Back to Home Page
            </button>
          </>
        )}
      </div>

      {/* Optional: Footer or additional info */}
      <p className="mt-8 text-gray-500 text-sm">
        Thank you for joining WolfieWorks!
      </p>
    </div>
  );
}
