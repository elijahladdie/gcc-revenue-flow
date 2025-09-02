import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Clock, CheckCircle, XCircle, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockClaims, mockPatients, countryInfo } from '@/data/mockData';

export default function Claims() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'denied': return 'bg-destructive text-destructive-foreground';
      case 'under-review': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'denied': return <XCircle className="h-4 w-4" />;
      case 'under-review': return <Clock className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredClaims = selectedStatus === 'all' 
    ? mockClaims 
    : mockClaims.filter(claim => claim.status === selectedStatus);

  const totalValue = mockClaims.reduce((sum, claim) => sum + claim.amount, 0);
  const approvedValue = mockClaims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Claims Management</h1>
          <p className="text-muted-foreground">Process and track healthcare claims across GCC countries</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Submit New Claim
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClaims.length}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <Progress value={87.3} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString()} <span className="text-sm text-muted-foreground">SAR</span>
            </div>
            <p className="text-xs text-muted-foreground">Multi-currency normalized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 days</div>
            <p className="text-xs text-muted-foreground">Average turnaround</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Processing Pipeline */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Claims</TabsTrigger>
            <TabsTrigger value="submitted">Submitted</TabsTrigger>
            <TabsTrigger value="under-review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
          </TabsList>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredClaims.map((claim) => {
            const patient = mockPatients.find(p => p.id === claim.patientId);
            return (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(claim.status)}>
                          {getStatusIcon(claim.status)}
                          {claim.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Claim ID: {claim.id}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">
                          {patient?.name || 'Unknown Patient'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {countryInfo[patient?.country || 'SA'].flag} {claim.providerName}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p className="font-medium">
                            {claim.amount.toLocaleString()} {claim.currency}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Submitted:</span>
                          <p className="font-medium">
                            {new Date(claim.submissionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Urgency:</span>
                          <p className="font-medium capitalize">{claim.urgencyLevel}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected:</span>
                          <p className="font-medium">{claim.estimatedProcessingDays} days</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Diagnosis:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {claim.diagnosis.map((dx, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {dx}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Procedures:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {claim.procedures.map((proc, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {proc}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {claim.denialReason && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-medium text-destructive">Denial Reason:</span>
                          </div>
                          <p className="text-sm mt-1">{claim.denialReason}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Button variant="ghost" size="sm">View Details</Button>
                      {claim.status === 'denied' && (
                        <Button variant="outline" size="sm" className="text-warning border-warning">
                          Appeal
                        </Button>
                      )}
                      {claim.status === 'under-review' && (
                        <Button variant="outline" size="sm">
                          Track Progress
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Other tab contents would be similar with filtered data */}
        <TabsContent value="submitted">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Submitted Claims</h3>
            <p className="text-muted-foreground">Claims awaiting initial review</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
