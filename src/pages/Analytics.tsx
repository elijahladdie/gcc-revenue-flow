import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Activity, Download, Calendar, Target } from 'lucide-react';
import { mockAnalytics, countryInfo } from '@/data/mockData';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Analytics() {
  const approvalTrends = mockAnalytics.monthlyTrends.map(month => ({
    month: new Date(month.month).toLocaleDateString('en', { month: 'short' }),
    approvalRate: ((month.approvals / month.claims) * 100).toFixed(1),
    denialRate: ((month.denials / month.claims) * 100).toFixed(1),
    totalClaims: month.claims,
  }));

  const insurancePerformance = Object.entries(mockAnalytics.insuranceBreakdown).map(([type, data]) => ({
    type,
    approvalRate: data.approvalRate,
    claims: data.claims,
    avgAmount: data.averageAmount,
  }));

  const countryMetrics = Object.entries(mockAnalytics.countryBreakdown).map(([code, data]) => ({
    country: countryInfo[code as keyof typeof countryInfo].name,
    flag: countryInfo[code as keyof typeof countryInfo].flag,
    patients: data.patients,
    claims: data.claims,
    revenue: data.revenue / 1000, // Convert to thousands
    efficiency: ((data.claims / data.patients) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into revenue cycle performance</p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Success Rate</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.claimApprovalRate}%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">-0.8 days improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appeal Success</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.appealSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Above industry avg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across GCC region</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Approval Trends</TabsTrigger>
          <TabsTrigger value="insurance">Insurance Analysis</TabsTrigger>
          <TabsTrigger value="geographic">Geographic Performance</TabsTrigger>
          <TabsTrigger value="operational">Operational Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim Approval Trends</CardTitle>
              <CardDescription>Monthly approval and denial rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={approvalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}%`, name === 'approvalRate' ? 'Approval Rate' : 'Denial Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="approvalRate" 
                    stackId="1"
                    stroke="hsl(var(--success))" 
                    fill="hsl(var(--success))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="denialRate" 
                    stackId="1"
                    stroke="hsl(var(--destructive))" 
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Claims Volume</CardTitle>
                <CardDescription>Total claims processed per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={approvalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Claims']} />
                    <Bar dataKey="totalClaims" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key operational indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Denial Rate</span>
                  <Badge variant="destructive">{mockAnalytics.denialRate}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Collection Rate</span>
                  <Badge variant="default">{mockAnalytics.collectionRate}%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Avg Processing</span>
                  <Badge variant="secondary">{mockAnalytics.averageProcessingTime} days</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Type Performance</CardTitle>
              <CardDescription>Approval rates and claim volumes by insurance type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insurancePerformance.map((insurance) => (
                  <div key={insurance.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{insurance.type}</h4>
                      <p className="text-sm text-muted-foreground">
                        {insurance.claims} claims • Avg: {insurance.avgAmount.toLocaleString()} SAR
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-lg font-bold">{insurance.approvalRate}%</div>
                      <Badge variant={insurance.approvalRate > 90 ? 'default' : insurance.approvalRate > 80 ? 'secondary' : 'destructive'}>
                        {insurance.approvalRate > 90 ? 'Excellent' : insurance.approvalRate > 80 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Country Performance Overview</CardTitle>
              <CardDescription>Revenue cycle metrics by GCC country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {countryMetrics.map((country) => (
                  <div key={country.country} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <h4 className="font-semibold">{country.country}</h4>
                        <p className="text-sm text-muted-foreground">
                          {country.patients.toLocaleString()} patients • {country.claims} claims
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div>
                        <div className="font-semibold">{country.revenue}k SAR</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div>
                        <div className="font-semibold">{country.efficiency}%</div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational">
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Operational Metrics</h3>
            <p className="text-muted-foreground">Detailed operational performance analysis</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}