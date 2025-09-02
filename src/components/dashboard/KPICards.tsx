// KPI Cards Component for Healthcare Dashboard

import React from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Analytics } from '@/types/healthcare';
import { countryInfo } from '@/data/mockData';

interface KPICardsProps {
  analytics: Analytics | null;
  loading?: boolean;
}

interface KPICardData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down' | 'neutral';
  color: 'primary' | 'success' | 'warning' | 'error';
}

export const KPICards: React.FC<KPICardsProps> = ({ analytics, loading }) => {
  if (!analytics) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiData: KPICardData[] = [
    {
      title: 'Total Patients',
      value: analytics.totalPatients.toLocaleString(),
      change: 5.2,
      changeLabel: 'vs last month',
      icon: Users,
      trend: 'up',
      color: 'primary',
    },
    {
      title: 'Active Claims',
      value: analytics.activeClaims.toLocaleString(),
      change: -2.1,
      changeLabel: 'vs last week',
      icon: FileText,
      trend: 'down',
      color: 'warning',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(analytics.monthlyRevenue, analytics.currency),
      change: 8.7,
      changeLabel: 'vs last month',
      icon: DollarSign,
      trend: 'up',
      color: 'success',
    },
    {
      title: 'Approval Rate',
      value: `${analytics.claimApprovalRate}%`,
      change: 1.3,
      changeLabel: 'vs last month',
      icon: CheckCircle,
      trend: 'up',
      color: 'success',
    },
  ];

  const secondaryKpis = [
    {
      title: 'Avg Processing Time',
      value: `${analytics.averageProcessingTime} days`,
      icon: Clock,
      color: 'primary' as const,
    },
    {
      title: 'Pending Pre-Auth',
      value: analytics.pendingAuthorizations.toLocaleString(),
      icon: AlertTriangle,
      color: 'warning' as const,
    },
    {
      title: 'Collection Rate',
      value: `${analytics.collectionRate}%`,
      icon: TrendingUp,
      color: 'success' as const,
    },
    {
      title: 'Outstanding Balance',
      value: formatCurrency(analytics.outstandingBalance, analytics.currency),
      icon: DollarSign,
      color: 'error' as const,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary bg-primary-light';
      case 'success':
        return 'text-success bg-success-light';
      case 'warning':
        return 'text-warning bg-warning-light';
      case 'error':
        return 'text-error bg-error-light';
      default:
        return 'text-primary bg-primary-light';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3 text-success" />;
      case 'down':
        return <TrendingDown className="w-3 h-3 text-error" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card 
            key={kpi.title} 
            className="bg-gradient-card border-border/50 shadow-healthcare-sm hover:shadow-healthcare-md transition-all duration-200"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                {kpi.title}
                <div className={`p-2 rounded-lg ${getColorClasses(kpi.color)}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {kpi.value}
              </div>
              <div className="flex items-center gap-1 text-sm">
                {getTrendIcon(kpi.trend)}
                <span className={kpi.trend === 'up' ? 'text-success' : 'text-error'}>
                  {kpi.change > 0 ? '+' : ''}{kpi.change}%
                </span>
                <span className="text-muted-foreground">{kpi.changeLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {secondaryKpis.map((kpi) => (
          <Card 
            key={kpi.title}
            className="bg-background/50 border-border/30 shadow-healthcare-sm"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {kpi.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${getColorClasses(kpi.color)}`}>
                  <kpi.icon className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Country Breakdown */}
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Regional Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(analytics.countryBreakdown).map(([countryCode, data]) => {
              const country = countryInfo[countryCode as keyof typeof countryInfo];
              if (!country) return null;

              return (
                <div
                  key={countryCode}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium text-foreground">{country.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.patients.toLocaleString()} patients
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {formatCurrency(data.revenue, country.currency)}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {data.claims} claims
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};