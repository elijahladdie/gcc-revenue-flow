// Main Application Layout for Healthcare RCM Platform

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAppSelector } from '@/store';

export const AppLayout: React.FC = () => {
  const sidebarCollapsed = useAppSelector(state => state.ui.sidebarCollapsed);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-primary-light/10">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'bg-card text-card-foreground border shadow-healthcare-md',
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))',
                secondary: 'hsl(var(--success-foreground))',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--error))',
                secondary: 'hsl(var(--error-foreground))',
              },
            },
          }}
        />
      </div>
    </SidebarProvider>
  );
};