import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, FileText, Clock, CheckCircle2, XCircle, MessageSquare, TrendingUp, Target } from 'lucide-react';
import { mockClaims, mockPatients, countryInfo } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function ReviewDenials() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [appealText, setAppealText] = useState('');
  const { toast } = useToast();

  // Filter denied claims
  const deniedClaims = mockClaims.filter(claim => claim.status === 'denied');
  
  // Mock additional denial data
  const denialAnalytics = [
    { reason: 'Prior Authorization Required', count: 23, trend: '+12%', recoverable: 85 },
    { reason: 'Medical Necessity Not Established', count: 18, trend: '-5%', recoverable: 62 },
    { reason: 'Procedure Not Covered', count: 12, trend: '+8%', recoverable: 45 },
    { reason: 'Duplicate Claim', count: 8, trend: '-15%', recoverable: 95 },
    { reason: 'Documentation Incomplete', count: 15, trend: '+3%', recoverable: 88 },
  ];

  const appealHistory = [
    { id: 'app-001', claimId: 'clm-003', status: 'approved', submittedDate: '2024-01-20', amount: 15000, reason: 'Additional documentation provided' },
    { id: 'app-002', claimId: 'clm-005', status: 'denied', submittedDate: '2024-01-18', amount: 8500, reason: 'Medical necessity not established' },
    { id: 'app-003', claimId: 'clm-007', status: 'pending', submittedDate: '2024-01-22', amount: 12300, reason: 'Under review' },
  ];

  const handleAppealSubmission = (claimId: string) => {
    if (!appealText.trim()) {
      toast({
        title: "Appeal Text Required",
        description: "Please provide justification for the appeal",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Appeal Submitted",
      description: "Your appeal has been submitted for review",
    });
    setAppealText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'denied': return 'bg-destructive text-destructive-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-destructive text-destructive-foreground';
      case 'urgent': return 'bg-warning text-warning-foreground';
      case 'routine': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRecoverabilityColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Denials & Appeals</h1>
          <p className="text-muted-foreground">Manage denied claims and track appeal processes</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Bulk Appeal
        </Button>
      </div>

      {/* Denial Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Denials</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deniedClaims.length}</div>
            <p className="text-xs text-muted-foreground">Active denial cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appeal Success Rate</CardTitle>
            <Target className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">Historical success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425k SAR</div>
            <p className="text-xs text-muted-foreground">Estimated recoverable amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">Appeal processing time</p>
          </CardContent>
        </Card>
      </div>

      {/* Denial Management */}
      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Denials</TabsTrigger>
            <TabsTrigger value="appeals">Appeal History</TabsTrigger>
            <TabsTrigger value="analytics">Denial Analytics</TabsTrigger>
          </TabsList>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="routine">Routine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="active" className="space-y-4">
          {deniedClaims
            .filter(claim => selectedPriority === 'all' || claim.urgencyLevel === selectedPriority)
            .map((claim) => {
            const patient = mockPatients.find(p => p.id === claim.patientId);
            return (
              <Card key={claim.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-destructive text-destructive-foreground">
                            {patient?.name.split(' ').map(n => n[0]).join('') || 'UK'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{patient?.name || 'Unknown Patient'}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>Claim ID: {claim.id}</span>
                            <span>•</span>
                            <span>{countryInfo[patient?.country || 'SA'].flag} {claim.providerName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(claim.urgencyLevel)}>
                          {claim.urgencyLevel}
                        </Badge>
                        <Badge className="bg-destructive text-destructive-foreground">
                          <XCircle className="h-3 w-3 mr-1" />
                          Denied
                        </Badge>
                      </div>
                    </div>

                    {/* Claim Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <p className="font-semibold">{claim.amount.toLocaleString()} {claim.currency}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Submitted:</span>
                        <p className="font-medium">{new Date(claim.submissionDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Days Since:</span>
                        <p className="font-medium">
                          {Math.floor((Date.now() - new Date(claim.submissionDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Insurance:</span>
                        <p className="font-medium">{patient?.insuranceType}</p>
                      </div>
                    </div>

                    {/* Denial Reason */}
                    {claim.denialReason && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-medium text-destructive">Denial Reason:</span>
                            <p className="text-sm">{claim.denialReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Procedures and Diagnosis */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">Diagnosis:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {claim.diagnosis.map((dx, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {dx}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Procedures:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {claim.procedures.map((proc, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {proc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Appeal Section */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Appeal Justification:</label>
                        <Textarea
                          placeholder="Provide detailed justification for the appeal..."
                          value={appealText}
                          onChange={(e) => setAppealText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex space-x-2">
                          <Button onClick={() => handleAppealSubmission(claim.id)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Submit Appeal
                          </Button>
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Request Documentation
                          </Button>
                          <Button variant="ghost" className="text-muted-foreground">
                            Mark as Non-Recoverable
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="appeals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appeal History</CardTitle>
              <CardDescription>Track the status of submitted appeals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appealHistory.map((appeal) => (
                  <div key={appeal.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Appeal {appeal.id}</span>
                        <Badge className={getStatusColor(appeal.status)}>
                          {appeal.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                          {appeal.status === 'denied' && <XCircle className="h-3 w-3 mr-1" />}
                          {appeal.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {appeal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Claim: {appeal.claimId} • Submitted: {new Date(appeal.submittedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">{appeal.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{appeal.amount.toLocaleString()} SAR</p>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Denial Reason Analysis</CardTitle>
              <CardDescription>Most common denial reasons and recovery potential</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {denialAnalytics.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{item.reason}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{item.count} cases</span>
                        <span className={item.trend.startsWith('+') ? 'text-destructive' : 'text-success'}>
                          {item.trend} this month
                        </span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={`font-bold ${getRecoverabilityColor(item.recoverable)}`}>
                        {item.recoverable}% recoverable
                      </div>
                      <Button variant="outline" size="sm">
                        View Cases
                      </Button>
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