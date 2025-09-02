import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, BarChart3, Globe, Brain, Calendar } from 'lucide-react';
import { mockAnalytics } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function Trends() {
  // Simulated market trend data
  const marketTrends = [
    { period: 'Q1 2023', gcc: 2.1, global: 1.8, digital: 15.2 },
    { period: 'Q2 2023', gcc: 2.8, global: 2.1, digital: 18.7 },
    { period: 'Q3 2023', gcc: 3.4, global: 2.6, digital: 22.1 },
    { period: 'Q4 2023', gcc: 4.1, global: 3.2, digital: 25.8 },
    { period: 'Q1 2024', gcc: 4.8, global: 3.9, digital: 29.4 },
  ];

  const industryBenchmarks = [
    { metric: 'Claim Approval Rate', yourValue: 87.3, industryAvg: 82.1, trend: 'up' },
    { metric: 'Processing Time', yourValue: 4.2, industryAvg: 5.8, trend: 'up', unit: 'days' },
    { metric: 'Collection Rate', yourValue: 94.2, industryAvg: 89.7, trend: 'up' },
    { metric: 'Digital Adoption', yourValue: 78.5, industryAvg: 65.2, trend: 'up' },
    { metric: 'Patient Satisfaction', yourValue: 4.6, industryAvg: 4.2, trend: 'up', unit: '/5' },
  ];

  const predictiveInsights = [
    {
      title: 'Peak Season Forecast',
      description: 'Claims volume expected to increase by 25% during Hajj season (June-July)',
      impact: 'high',
      timeframe: 'Q2 2024',
      confidence: 89,
    },
    {
      title: 'Digital Health Growth',
      description: 'Telemedicine claims projected to grow 40% year-over-year',
      impact: 'medium',
      timeframe: '2024',
      confidence: 76,
    },
    {
      title: 'Regulatory Changes',
      description: 'New NPHIES requirements may affect approval rates in SA',
      impact: 'medium',
      timeframe: 'Q3 2024',
      confidence: 82,
    },
    {
      title: 'AI Automation Impact',
      description: 'Pre-authorization processing time could decrease by 60%',
      impact: 'high',
      timeframe: 'Q4 2024',
      confidence: 94,
    },
  ];

  const emergingTechnologies = [
    { tech: 'AI-Powered Diagnostics', adoption: 34, growth: '+125%', impact: 'Reduced claim denials' },
    { tech: 'Blockchain for Records', adoption: 12, growth: '+89%', impact: 'Enhanced security' },
    { tech: 'IoT Health Monitoring', adoption: 28, growth: '+67%', impact: 'Preventive care' },
    { tech: 'Robotic Process Automation', adoption: 45, growth: '+156%', impact: 'Faster processing' },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-primary text-primary-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Analysis & Trends</h1>
          <p className="text-muted-foreground">Industry insights and predictive analytics for healthcare revenue cycle</p>
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="gcc">
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gcc">GCC Region</SelectItem>
              <SelectItem value="mena">MENA</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+4.8%</div>
            <p className="text-xs text-muted-foreground">GCC healthcare market YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Adoption</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">29.4%</div>
            <p className="text-xs text-muted-foreground">Digital health solutions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Rank</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Top 15%</div>
            <p className="text-xs text-muted-foreground">Performance benchmark</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Future Outlook</CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Positive</div>
            <p className="text-xs text-muted-foreground">Next 18 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList>
          <TabsTrigger value="market">Market Trends</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Insights</TabsTrigger>
          <TabsTrigger value="technology">Emerging Tech</TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Healthcare Market Growth Trends</CardTitle>
              <CardDescription>Comparative growth analysis: GCC vs Global vs Digital Health</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}%`, name === 'gcc' ? 'GCC Growth' : name === 'global' ? 'Global Growth' : 'Digital Health Growth']} />
                  <Line 
                    type="monotone" 
                    dataKey="gcc" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="global" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="digital" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regional Market Share</CardTitle>
                <CardDescription>Healthcare spending by GCC country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(mockAnalytics.countryBreakdown)
                    .sort(([,a], [,b]) => b.revenue - a.revenue)
                    .map(([country, data]) => {
                      const total = Object.values(mockAnalytics.countryBreakdown).reduce((sum, c) => sum + c.revenue, 0);
                      const percentage = (data.revenue / total * 100).toFixed(1);
                      return (
                        <div key={country} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{country}</span>
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Market Drivers</CardTitle>
                <CardDescription>Factors influencing market growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Population Growth</span>
                  <Badge variant="default">High Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Digital Transformation</span>
                  <Badge variant="default">High Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Government Initiatives</span>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Medical Tourism</span>
                  <Badge variant="secondary">Medium Impact</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Industry Benchmarks</CardTitle>
              <CardDescription>How your organization compares to industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryBenchmarks.map((benchmark, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{benchmark.metric}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Your: {benchmark.yourValue}{benchmark.unit || '%'}</span>
                        <span>Industry: {benchmark.industryAvg}{benchmark.unit || '%'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(benchmark.trend)}
                      <Badge className={benchmark.yourValue > benchmark.industryAvg ? 'bg-success text-success-foreground' : 'bg-secondary text-secondary-foreground'}>
                        {benchmark.yourValue > benchmark.industryAvg ? 'Above Average' : 'Below Average'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Predictive Insights</CardTitle>
              <CardDescription>Data-driven predictions for strategic planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Timeline: {insight.timeframe}</span>
                      <div className="flex items-center space-x-2">
                        <Brain className="h-3 w-3 text-primary" />
                        <span className="font-medium">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Healthcare Technologies</CardTitle>
              <CardDescription>Technology adoption rates and growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergingTechnologies.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold">{tech.tech}</h4>
                      <p className="text-sm text-muted-foreground">{tech.impact}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Adoption: {tech.adoption}%</span>
                        <span className="text-sm text-success font-medium">{tech.growth}</span>
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all" 
                          style={{ width: `${tech.adoption}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}