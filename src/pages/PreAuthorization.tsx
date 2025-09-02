import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, CheckCircle2, AlertTriangle, Clock, Zap, TrendingUp, Shield } from 'lucide-react';
import { mockPreAuthorizations, mockPatients, countryInfo } from '@/data/mockData';

export default function PreAuthorization() {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('all');

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'auto-approve': return 'bg-success text-success-foreground';
      case 'manual-review': return 'bg-warning text-warning-foreground';
      case 'high-risk': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'auto-approve': return <CheckCircle2 className="h-4 w-4" />;
      case 'manual-review': return <AlertTriangle className="h-4 w-4" />;
      case 'high-risk': return <Shield className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Pre-Authorization</h1>
          <p className="text-muted-foreground">Intelligent approval recommendations with risk assessment</p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          New Pre-Auth Request
        </Button>
      </div>

      {/* AI Insights Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <Progress value={94.2} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Average accuracy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Approvals</CardTitle>
            <Zap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Processed instantly</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1s</div>
            <p className="text-xs text-muted-foreground">Avg AI analysis</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="auto-approve">Auto-Approve</TabsTrigger>
          <TabsTrigger value="manual-review">Manual Review</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {mockPreAuthorizations.map((preAuth) => {
            const patient = mockPatients.find(p => p.id === preAuth.patientId);
            return (
              <Card key={preAuth.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header with AI Recommendation */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getRecommendationColor(preAuth.aiRecommendation)}>
                            {getRecommendationIcon(preAuth.aiRecommendation)}
                            {preAuth.aiRecommendation.replace('-', ' ')}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className={`font-semibold ${getConfidenceColor(preAuth.confidenceScore)}`}>
                              {preAuth.confidenceScore}% confidence
                            </span>
                          </div>
                        </div>
                        <Badge variant={preAuth.status === 'approved' ? 'default' : 'secondary'}>
                          {preAuth.status}
                        </Badge>
                      </div>

                      {/* Patient & Request Info */}
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {patient?.name.split(' ').map(n => n[0]).join('') || 'UK'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <div>
                            <h3 className="text-lg font-semibold">{patient?.name || 'Unknown Patient'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {countryInfo[patient?.country || 'SA'].flag} {patient?.insuranceType} • ID: {preAuth.id}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{preAuth.requestType}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {preAuth.treatmentCategory} • {preAuth.requestedAmount.toLocaleString()} {preAuth.currency}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Medical Justification */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Medical Justification</h5>
                        <p className="text-sm text-muted-foreground">{preAuth.medicalJustification}</p>
                      </div>

                      {/* Risk Factors */}
                      {preAuth.riskFactors && preAuth.riskFactors.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">AI Risk Assessment</h5>
                          <div className="flex flex-wrap gap-2">
                            {preAuth.riskFactors.map((risk, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs border-warning text-warning"
                              >
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Document Status */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2">Required Documents</h5>
                          <div className="space-y-1">
                            {preAuth.requiredDocuments.map((doc, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                {preAuth.submittedDocuments.includes(doc) ? (
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                ) : (
                                  <Clock className="h-3 w-3 text-warning" />
                                )}
                                <span className={preAuth.submittedDocuments.includes(doc) ? 'text-success' : 'text-warning'}>
                                  {doc}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Expected Approval:</span>
                            <p className="font-medium">
                              {new Date(preAuth.expectedApprovalDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Valid Until:</span>
                            <p className="font-medium">
                              {new Date(preAuth.validUntil).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {preAuth.status === 'pending' && (
                        <>
                          {preAuth.aiRecommendation === 'auto-approve' && (
                            <Button size="sm" className="bg-success hover:bg-success/90">
                              Quick Approve
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Review Details
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Deny Request
                          </Button>
                        </>
                      )}
                      {preAuth.status === 'approved' && (
                        <Button variant="ghost" size="sm">
                          View Approval
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Filtered tabs content */}
        <TabsContent value="auto-approve">
          <div className="text-center py-12">
            <Zap className="mx-auto h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">Auto-Approval Candidates</h3>
            <p className="text-muted-foreground">High-confidence requests ready for instant processing</p>
          </div>
        </TabsContent>

        <TabsContent value="manual-review">
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-warning mb-4" />
            <h3 className="text-lg font-semibold mb-2">Manual Review Required</h3>
            <p className="text-muted-foreground">Requests flagged for human oversight</p>
          </div>
        </TabsContent>

        <TabsContent value="high-risk">
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">High-Risk Requests</h3>
            <p className="text-muted-foreground">Requests requiring careful evaluation</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}