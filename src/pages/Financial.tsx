import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, TrendingUp, CreditCard, AlertCircle, Banknote, Clock, CheckCircle } from 'lucide-react';
import { mockAnalytics, countryInfo, exchangeRates } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Financial() {
  const revenueData = mockAnalytics.monthlyTrends.map(month => ({
    month: new Date(month.month).toLocaleDateString('en', { month: 'short' }),
    revenue: month.revenue / 1000, // Convert to thousands
    collections: (month.revenue * 0.942) / 1000, // 94.2% collection rate
  }));

  const countryRevenueData = Object.entries(mockAnalytics.countryBreakdown).map(([code, data]) => ({
    country: countryInfo[code as keyof typeof countryInfo].name,
    revenue: data.revenue / 1000,
    flag: countryInfo[code as keyof typeof countryInfo].flag,
    currency: countryInfo[code as keyof typeof countryInfo].currency,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const outstandingByAge = [
    { age: '0-30 days', amount: 45000, count: 234 },
    { age: '31-60 days', amount: 32000, count: 156 },
    { age: '61-90 days', amount: 28000, count: 98 },
    { age: '90+ days', amount: 20000, count: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue & Payments</h1>
          <p className="text-muted-foreground">Financial performance and payment management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Export Report</Button>
          <Button>
            <Banknote className="mr-2 h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.monthlyRevenue.toLocaleString()} 
              <span className="text-sm text-muted-foreground ml-1">{mockAnalytics.currency}</span>
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.collectionRate}%</div>
            <Progress value={mockAnalytics.collectionRate} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.outstandingBalance.toLocaleString()}
              <span className="text-sm text-muted-foreground ml-1">SAR</span>
            </div>
            <p className="text-xs text-muted-foreground">Across all countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.averageProcessingTime} days</div>
            <p className="text-xs text-muted-foreground">Payment to collection</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue and collection performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}k SAR`, '']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" />
                <Bar dataKey="collections" fill="hsl(var(--success))" name="Collections" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Country</CardTitle>
            <CardDescription>Geographic distribution of earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={countryRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ flag, revenue }) => `${flag} ${revenue}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {countryRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}k SAR`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Management Tabs */}
      <Tabs defaultValue="outstanding" className="space-y-6">
        <TabsList>
          <TabsTrigger value="outstanding">Outstanding Payments</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="currency">Multi-Currency</TabsTrigger>
        </TabsList>

        <TabsContent value="outstanding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Balance by Aging</CardTitle>
              <CardDescription>Payment collection priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outstandingByAge.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{item.age}</p>
                      <p className="text-sm text-muted-foreground">{item.count} invoices</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{item.amount.toLocaleString()} SAR</p>
                      <Badge variant={index > 1 ? 'destructive' : index > 0 ? 'secondary' : 'default'}>
                        {index > 1 ? 'Overdue' : index > 0 ? 'Due Soon' : 'Current'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed">
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processed Payments</h3>
            <p className="text-muted-foreground">Successfully collected and reconciled payments</p>
          </div>
        </TabsContent>

        <TabsContent value="reconciliation">
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Reconciliation</h3>
            <p className="text-muted-foreground">Match payments with outstanding invoices</p>
          </div>
        </TabsContent>

        <TabsContent value="currency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Current GCC currency exchange rates (SAR base)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(exchangeRates).map(([currency, rate]) => {
                  const countryEntry = Object.entries(countryInfo).find(([, info]) => info.currency === currency);
                  const flag = countryEntry ? countryEntry[1].flag : '💰';
                  
                  return (
                    <div key={currency} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{flag}</span>
                        <span className="font-medium">{currency}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{rate.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}