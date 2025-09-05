// Main Dashboard Page for Healthcare RCM Platform

import React, { useEffect } from 'react';
import { RefreshCw, Activity, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICards } from '@/components/dashboard/KPICards';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchAnalytics, refreshAnalytics } from '@/store/slices/analyticsSlice';
import toast from 'react-hot-toast';
import { fetchClaims } from '@/store/slices/visitSlice';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: analytics, loading: analyticsLoading, lastUpdated } = useAppSelector(state => state.analytics);
  const { currentCountry, language } = useAppSelector(state => state.ui);
  const claimsLoading = useAppSelector(state => state.visit.loading);

  const isLoading = analyticsLoading || claimsLoading;

  useEffect(() => {
    // Initial data fetch
    const loadDashboardData = async () => {
      try {
        const results = await Promise.all([
          dispatch(fetchAnalytics(undefined)),
          dispatch(fetchClaims()),
        ]);
        console.log('Dashboard data loaded successfully');
        toast.success('Dashboard data loaded successfully');
      } catch (error) {
        toast.error('Failed to load dashboard data');
      }
    };

    loadDashboardData();
  }, [dispatch, currentCountry]);

  const handleRefresh = async () => {
    try {
      await dispatch(refreshAnalytics()).unwrap();
      toast.success('Dashboard refreshed');
    } catch (error) {
      toast.error('Failed to refresh dashboard');
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'لوحة التحكم' : 'Healthcare Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'ar' 
              ? 'نظرة عامة على العمليات المالية للرعاية الصحية' 
              : 'Overview of your healthcare revenue cycle operations'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Updated {formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
          
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className="bg-gradient-to-r from-success-light/20 to-primary-light/20 border-success/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-success text-success-foreground">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-foreground">System Status: Operational</p>
                <p className="text-sm text-muted-foreground">
                  All services running normally • Claims processing active
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success text-success-foreground">
              Live
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <KPICards analytics={analytics} loading={analyticsLoading} />

      {/* Charts and Additional Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueChart analytics={analytics} loading={analyticsLoading} />
        </div>

        {/* Side Panel - Takes 1 column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-success mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Claim CLM-4567 Approved</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago • SAR 15,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Pre-Auth Review Needed</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago • PRE-8901</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">New Patient Registered</p>
                  <p className="text-xs text-muted-foreground">12 minutes ago • Ahmed Al-Rashid</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Payment Delayed</p>
                  <p className="text-xs text-muted-foreground">1 hour ago • CLM-3456</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-warning-light border border-warning/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">High Denial Rate</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Denial rate increased to 15.2% this week. Review common rejection reasons.
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-error-light border border-error/20">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-error" />
                  <span className="font-medium text-sm">Payment Overdue</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  8 claims have payments overdue by more than 30 days.
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-info-light border border-info/20">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-info" />
                  <span className="font-medium text-sm">System Maintenance</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scheduled maintenance window: Tonight 2:00-4:00 AM GMT+3
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};