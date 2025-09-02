import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, FileCheck, AlertTriangle, Download, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { countryInfo } from '@/data/mockData';

export default function Compliance() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const complianceMetrics = [
    { metric: 'NPHIES Compliance', score: 98.5, status: 'excellent', country: 'SA' },
    { metric: 'CCHI Reporting', score: 96.2, status: 'good', country: 'SA' },
    { metric: 'UAE DHA Standards', score: 94.8, status: 'good', country: 'UAE' },
    { metric: 'Qatar MOPH Rules', score: 92.1, status: 'acceptable', country: 'QA' },
    { metric: 'Kuwait MOH Guidelines', score: 89.7, status: 'acceptable', country: 'KW' },
    { metric: 'Bahrain NHRA Compliance', score: 95.3, status: 'good', country: 'BH' },
  ];

  const auditTrail = [
    { id: 'aud-001', action: 'Patient Data Export', user: 'Sarah Al-Ahmad', timestamp: '2024-01-25T14:30:00Z', status: 'completed', regulation: 'GDPR/Data Privacy' },
    { id: 'aud-002', action: 'Claims Submission Report', user: 'Ahmed Al-Rashid', timestamp: '2024-01-25T10:15:00Z', status: 'completed', regulation: 'NPHIES Reporting' },
    { id: 'aud-003', action: 'Pre-Auth Documentation', user: 'Fatima Al-Zahra', timestamp: '2024-01-24T16:45:00Z', status: 'pending', regulation: 'CCHI Requirements' },
    { id: 'aud-004', action: 'Financial Reconciliation', user: 'Mohammed Al-Kuwari', timestamp: '2024-01-24T09:20:00Z', status: 'completed', regulation: 'Central Bank Reporting' },
  ];

  const regulatoryReports = [
    { name: 'NPHIES Monthly Submission', dueDate: '2024-02-01', status: 'ready', country: 'SA', description: 'Monthly claims and eligibility data' },
    { name: 'CCHI Quarterly Report', dueDate: '2024-01-31', status: 'in-progress', country: 'SA', description: 'Insurance performance metrics' },
    { name: 'DHA Annual Compliance', dueDate: '2024-03-15', status: 'pending', country: 'UAE', description: 'Healthcare facility compliance report' },
    { name: 'MOPH Data Submission', dueDate: '2024-02-10', status: 'ready', country: 'QA', description: 'Patient outcome statistics' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success text-success-foreground';
      case 'good': return 'bg-primary text-primary-foreground';
      case 'acceptable': return 'bg-warning text-warning-foreground';
      case 'ready': return 'bg-success text-success-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'pending': return 'bg-secondary text-secondary-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'ready':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'in-progress':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Regulatory Compliance</h1>
          <p className="text-muted-foreground">Monitor compliance across GCC healthcare regulations</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {Object.entries(countryInfo).map(([code, info]) => (
                <SelectItem key={code} value={code}>
                  {info.flag} {info.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <FileCheck className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.8%</div>
            <Progress value={94.8} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Across all regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Audits</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Regulatory reviews in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Reports</CardTitle>
            <Calendar className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Reports due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Low</div>
            <p className="text-xs text-muted-foreground">Compliance risk level</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Dashboard */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="metrics">Compliance Metrics</TabsTrigger>
          <TabsTrigger value="reports">Regulatory Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="policies">Policies & Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Score by Regulation</CardTitle>
              <CardDescription>Current compliance status across different regulatory frameworks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceMetrics
                  .filter(metric => selectedCountry === 'all' || metric.country === selectedCountry)
                  .map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{metric.metric}</h4>
                        <span className="text-lg">{countryInfo[metric.country as keyof typeof countryInfo].flag}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {countryInfo[metric.country as keyof typeof countryInfo].name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold">{metric.score}%</div>
                        <Progress value={metric.score} className="w-24" />
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Regulatory Reports</CardTitle>
              <CardDescription>Scheduled submissions and compliance deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regulatoryReports
                  .filter(report => selectedCountry === 'all' || report.country === selectedCountry)
                  .map((report, index) => (
                  <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{report.name}</h4>
                        <span className="text-lg">{countryInfo[report.country as keyof typeof countryInfo].flag}</span>
                        <Badge className={getStatusColor(report.status)}>
                          {getStatusIcon(report.status)}
                          {report.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">Due:</span>
                        <span className="font-medium">
                          {new Date(report.dueDate).toLocaleDateString('en', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      {report.status === 'ready' && (
                        <Button size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Submit
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Audit Trail</CardTitle>
              <CardDescription>Complete log of compliance-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditTrail.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium">{entry.action}</h5>
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusIcon(entry.status)}
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{entry.user}</span>
                        <span>•</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        <span>•</span>
                        <span>{entry.regulation}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Log
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Policies & Procedures</h3>
            <p className="text-muted-foreground">Organizational compliance policies and standard operating procedures</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}