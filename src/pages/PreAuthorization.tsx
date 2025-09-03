import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, CheckCircle2, AlertTriangle, Clock, Zap, TrendingUp, Shield } from 'lucide-react';
import { countryInfo } from '@/data/mockData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { PreAuthorization } from '@/types/healthcare';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { fetchClaims, fetchPreAuths, fetchVisits } from '@/store/slices/visitSlice';
import { fetchPatients } from '@/store/slices/patientsSlice';

export default function PreAuthorization() {
  const { visits, claims, preauths: preAuthorizations } = useAppSelector((state) => state.visit);
  // const [preAuthorizations, setPreAuthorizations] = useState(preauths);
    const { patients } = useAppSelector((state: RootState) => state.patients);
  
  const dispatch = useAppDispatch();
  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'auto-approve': return 'bg-success text-success-foreground';
      case 'manual-review': return 'bg-warning text-warning-foreground';
      case 'high-risk': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  useEffect(() => {
    dispatch(fetchVisits());
    dispatch(fetchClaims());
    dispatch(fetchPreAuths());
    dispatch(fetchPatients({}));
  }, [dispatch]);
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

  const handleApprove = (id: string) => {
    // setPreAuthorizations((prev) =>
    //   prev.map((pa) => (pa.id === id ? { ...pa, status: "approved" } : pa))
    // );
  };

  const handleDeny = (id: string) => {
    // setPreAuthorizations((prev) =>
    //   prev.map((pa) => (pa.id === id ? { ...pa, status: "denied" } : pa))
    // );
  };

  const handleEdit = (id: string, field: keyof PreAuthorization, value: any) => {
    // setPreAuthorizations((prev) =>
    //   prev.map((pa) => (pa.id === id ? { ...pa, [field]: value } : pa))
    // );
  };
  // Dynamic calculations
  const totalRequests = preAuthorizations.length;

  const avgConfidence =
    totalRequests > 0
      ? (
        preAuthorizations.reduce((acc, pa) => acc + pa.confidence_score, 0) /
        totalRequests
      ).toFixed(1)
      : 0;

  const autoApprovals =
    totalRequests > 0
      ? (
        (preAuthorizations.filter((pa) => pa.ai_recommendation === "auto-approve").length /
          totalRequests) *
        100
      ).toFixed(0)
      : 0;

  const riskFlagged = preAuthorizations.filter((pa) => pa.ai_recommendation === "high-risk").length;

  const renderPreAuthCard = (preAuth: PreAuthorization, patient: any) => (
    <Card key={preAuth.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            {/* Header with AI Recommendation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span
                    className={`font-semibold ${getConfidenceColor(
                      preAuth.confidence_score
                    )}`}
                  >
                    {preAuth.confidence_score}% confidence
                  </span>
                </div>
              </div>
              <Badge variant={preAuth.status === "approved" ? "default" : "secondary"}>
                {preAuth.status}
              </Badge>
            </div>

            {/* Patient & Request Info */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {patient?.name.split(" ").map((n: string) => n[0]).join("") || "UK"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div>
                  <h3 className="text-lg font-semibold">
                    {patient?.name || "Unknown Patient"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {countryInfo[patient?.country || "SA"].flag} {patient?.insuranceType} •
                    ID: {preAuth.id}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                  <Input
                    value={preAuth.request_type}
                    onChange={(e) =>
                      handleEdit(preAuth.id, "request_type", e.target.value)
                    }
                  />
                  <Select
                    value={preAuth.treatment_category}
                    onValueChange={(val) =>
                      handleEdit(preAuth.id, "treatment_category", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="therapy">Therapy</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={preAuth.requested_amount}
                    onChange={(e) =>
                      handleEdit(preAuth.id, "requested_amount", Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Medical Justification */}
            <Textarea
              className="bg-muted/50 rounded-lg p-4"
              value={preAuth.medical_justification}
              onChange={(e) =>
                handleEdit(preAuth.id, "medical_justification", e.target.value)
              }
            />

            {/* Risk Factors */}
            {preAuth.risk_factors.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">AI Risk Assessment</h5>
                <div className="flex flex-wrap gap-2">
                  {preAuth.risk_factors.map((risk, idx) => (
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
                  {preAuth.required_documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm">
                      {preAuth.submitted_documents.includes(doc) ? (
                        <CheckCircle2 className="h-3 w-3 text-success" />
                      ) : (
                        <Clock className="h-3 w-3 text-warning" />
                      )}
                      <span
                        className={
                          preAuth.submitted_documents.includes(doc)
                            ? "text-success"
                            : "text-warning"
                        }
                      >
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
                    {new Date(preAuth.valid_until).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Valid Until:</span>
                  <p className="font-medium">
                    {new Date(preAuth.valid_until).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 ml-4">
            {preAuth.status === "pending" && (
              <>
                {preAuth.ai_recommendation === "auto-approve" && (
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90"
                    onClick={() => handleApprove(preAuth.id)}
                  >
                    Quick Approve
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(JSON.stringify(preAuth, null, 2))}
                >
                  Review Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeny(preAuth.id)}
                >
                  Deny Request
                </Button>
              </>
            )}
            {preAuth.status === "approved" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => alert(`Approved request ID: ${preAuth.id}`)}
              >
                View Approval
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Pre-Authorization</h1>
          <p className="text-muted-foreground">
            Intelligent approval recommendations with risk assessment
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Brain className="mr-2 h-4 w-4" />
              New Pre-Auth Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Pre-Authorization</DialogTitle>
              <DialogDescription>
                Fill out the details below to create a new pre-authorization request.
              </DialogDescription>
            </DialogHeader>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();

                const formData = new FormData(e.currentTarget);

                const requested_amount = Number(formData.get("requested_amount"));
                const treatment_category = formData.get("treatment_category") as PreAuthorization["treatment_category"];

                let ai_recommendation: PreAuthorization["ai_recommendation"] = "manual-review";
                let confidence_score = 70;

                // AI Recommendation Logic
                if (requested_amount < 500 && ["consultation", "therapy"].includes(treatment_category)) {
                  ai_recommendation = "auto-approve";
                  confidence_score = Math.floor(Math.random() * 15) + 80; // 80–95
                } else if (requested_amount > 5000 || treatment_category === "surgery") {
                  ai_recommendation = "high-risk";
                  confidence_score = Math.floor(Math.random() * 25) + 50; // 50–75
                } else {
                  ai_recommendation = "manual-review";
                  confidence_score = Math.floor(Math.random() * 25) + 60; // 60–85
                }

                // const newPreAuth: PreAuthorization = {
                //   id: crypto.randomUUID(),
                //   patient_id: formData.get("patient_id") as string,
                //   request_type: formData.get("request_type") as string,
                //   treatment_category,
                //   requested_amount,
                //   currency: formData.get("currency") as any,
                //   ai_recommendation,
                //   confidence_score,
                //   status: "pending",
                //   risk_factors: ai_recommendation === "high-risk" ? ["High cost", "Critical procedure"] : [],
                //   medical_justification: formData.get("medical_justification") as string,
                //   required_documents: ["Doctor Report", "Insurance Card"],
                //   submitted_documents: [],
                //   valid_until: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                //   created_at: new Date().toISOString(),
                //   updated_at: new Date().toISOString(),
                // };

                // setPreAuthorizations((prev) => [...prev, newPreAuth]);
                e.currentTarget.reset();
              }}
            >
              {/* Patient ID */}
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient</Label>
                <Select name="patient_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.insurance_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Request Type */}
              <div className="space-y-2">
                <Label htmlFor="request_type">Request Type</Label>
                <Input id="request_type" name="request_type" placeholder="e.g. MRI Scan" required />
              </div>

              {/* Treatment Category */}
              <div className="space-y-2">
                <Label htmlFor="treatment_category">Treatment Category</Label>
                <Select name="treatment_category">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="therapy">Therapy</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Requested Amount */}
              <div className="space-y-2">
                <Label htmlFor="requested_amount">Requested Amount</Label>
                <Input id="requested_amount" name="requested_amount" type="number" required />
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select name="currency">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="RWF">RWF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Medical Justification */}
              <div className="space-y-2">
                <Label htmlFor="medical_justification">Medical Justification</Label>
                <Textarea
                  id="medical_justification"
                  name="medical_justification"
                  placeholder="Provide justification"
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>


      {/* AI Insights Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Brain className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConfidence}%</div>
            <Progress value={Number(avgConfidence)} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Average accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Approvals</CardTitle>
            <Zap className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{autoApprovals}%</div>
            <p className="text-xs text-muted-foreground">Processed instantly</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Flagged</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskFlagged}</div>
            <p className="text-xs text-muted-foreground">Requiring review</p>
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
          {preAuthorizations.map((preAuth) => {
            const patient = patients.find(p => p.id === preAuth.patient_id);
            return (
              <Card key={preAuth.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Header with AI Recommendation */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-primary" />
                            <span className={`font-semibold ${getConfidenceColor(preAuth.confidence_score)}`}>
                              {preAuth.confidence_score}% confidence
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
                              {countryInfo[patient?.country || 'SA'].flag} {patient?.insurance_type} • ID: {preAuth.id}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-medium">{preAuth.request_type}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {preAuth.treatment_category} • {preAuth.requested_amount.toLocaleString()} {preAuth.currency}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Medical Justification */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h5 className="font-medium mb-2">Medical Justification</h5>
                        <p className="text-sm text-muted-foreground">{preAuth.medical_justification}</p>
                      </div>

                      {/* Risk Factors */}
                      {preAuth.risk_factors && preAuth.risk_factors.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">AI Risk Assessment</h5>
                          <div className="flex flex-wrap gap-2">
                            {preAuth.risk_factors.map((risk, idx) => (
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
                            {preAuth?.required_documents?.map((doc, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                {preAuth.submitted_documents.includes(doc) ? (
                                  <CheckCircle2 className="h-3 w-3 text-success" />
                                ) : (
                                  <Clock className="h-3 w-3 text-warning" />
                                )}
                                <span className={preAuth.submitted_documents.includes(doc) ? 'text-success' : 'text-warning'}>
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
                              {new Date(preAuth.valid_until).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Valid Until:</span>
                            <p className="font-medium">
                              {new Date(preAuth.valid_until).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      {preAuth.status === 'pending' && (
                        <>
                          {preAuth.ai_recommendation === 'auto-approve' && (
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
        <TabsContent value="auto-approve" className="space-y-4">
          {preAuthorizations.filter(preAuth => preAuth.ai_recommendation === 'auto-approve').length > 0 ? (
            preAuthorizations
              .filter(preAuth => preAuth.ai_recommendation === 'auto-approve')
              .map((preAuth) => {
                const patient = patients.find(p => p.id === preAuth.patient_id);
                return renderPreAuthCard(preAuth, patient);
              })
          ) : (
            <div className="text-center py-12">
              <Zap className="mx-auto h-12 w-12 text-success mb-4" />
              <h3 className="text-lg font-semibold mb-2">Auto-Approval Candidates</h3>
              <p className="text-muted-foreground">
                High-confidence requests ready for instant processing
              </p>
            </div>
          )}
        </TabsContent>

        {/* Manual Review */}
        <TabsContent value="manual-review" className="space-y-4">
          {preAuthorizations.filter(preAuth => preAuth.ai_recommendation === 'manual-review').length > 0 ? (
            preAuthorizations
              .filter(preAuth => preAuth.ai_recommendation === 'manual-review')
              .map((preAuth) => {
                const patient = patients.find(p => p.id === preAuth.patient_id);
                return renderPreAuthCard(preAuth, patient);
              })
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-warning mb-4" />
              <h3 className="text-lg font-semibold mb-2">Manual Review Required</h3>
              <p className="text-muted-foreground">
                Requests flagged for human oversight
              </p>
            </div>
          )}
        </TabsContent>

        {/* High Risk */}
        <TabsContent value="high-risk" className="space-y-4">
          {preAuthorizations.filter(preAuth => preAuth.ai_recommendation === 'high-risk').length > 0 ? (
            preAuthorizations
              .filter(preAuth => preAuth.ai_recommendation === 'high-risk')
              .map((preAuth) => {
                const patient = patients.find(p => p.id === preAuth.patient_id);
                return renderPreAuthCard(preAuth, patient);
              })
          ) : (
            <div className="text-center py-12">
              <Shield className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-semibold mb-2">High-Risk Requests</h3>
              <p className="text-muted-foreground">
                Requests requiring careful evaluation
              </p>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div >
  );
}