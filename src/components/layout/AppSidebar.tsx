// Healthcare RCM Platform Sidebar Navigation

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  CreditCard,
  BarChart3,
  Settings,
  Stethoscope,
  Shield,
  Globe,
  UserCheck,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/store';
import { countryInfo } from '@/data/mockData';

const mainMenuItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    description: 'Overview & Analytics',
  },
  {
    title: 'Patients',
    url: '/patients',
    icon: Users,
    description: 'Patient Registry',
  },
  {
    title: 'Claims',
    url: '/claims',
    icon: FileText,
    description: 'Claims Management',
  },
  {
    title: 'Pre-Authorization',
    url: '/pre-auth',
    icon: CheckCircle,
    description: 'AI-Powered Approvals',
  },
  {
    title: 'Financial',
    url: '/financial',
    icon: CreditCard,
    description: 'Revenue & Payments',
  },
];

const reportsMenuItems = [
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
    description: 'Performance Insights',
  },
  {
    title: 'Compliance',
    url: '/compliance',
    icon: Shield,
    description: 'Regulatory Reports',
  },
  {
    title: 'Trends',
    url: '/trends',
    icon: TrendingUp,
    description: 'Market Analysis',
  },
];

const quickActions = [
  {
    title: 'Verify Eligibility',
    url: '/patients/verify',
    icon: UserCheck,
    count: 23,
  },
  {
    title: 'Review Denials',
    url: '/claims/denials',
    icon: AlertTriangle,
    count: 8,
  },
];

export const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const currentCountry = useAppSelector(state => state.ui.currentCountry);
  
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-primary text-primary-foreground shadow-healthcare-sm`;
    }
    return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-accent`;
  };

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-72'} border-r border-border/50 bg-gradient-card`}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="font-bold text-foreground">GCC Healthcare</h1>
              <p className="text-xs text-muted-foreground">Revenue Cycle Management</p>
            </div>
          )}
        </div>
        
        {/* Country Indicator */}
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2 px-2 py-1 rounded-md bg-secondary-light/50">
            <Globe className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">
              {countryInfo[currentCountry].flag} {countryInfo[currentCountry].name}
            </span>
          </div>
        )}
      </div>

      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {collapsed ? 'MAIN' : 'MAIN NAVIGATION'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Reports & Analytics */}
        <SidebarGroup className="mt-8">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {collapsed ? 'RPT' : 'REPORTS & INSIGHTS'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {reportsMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        {!collapsed && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              QUICK ACTIONS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary-light/20 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-warning text-warning-foreground text-xs font-bold flex items-center justify-center">
                          {item.count}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/settings" className={getNavClasses('/settings')}>
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border/50">
        <SidebarTrigger className="w-full justify-center" />
      </div>
    </Sidebar>
  );
};