'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchVisits, fetchClaims, fetchPreAuths, createVisit, updateVisit } from '@/store/slices/visitSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, CheckCircle, XCircle, Clock, AlertTriangle, Plus, Eye, Shield, Receipt } from 'lucide-react';
import RegisterVisitDialog from '@/components/patients/RegisterVisitDialog';
import { Input } from '@/components/ui/input';

export default function VisitsManager() {
  const dispatch = useAppDispatch();
  const { visits, claims, preauths } = useAppSelector((state) => state.visit);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState<typeof visits[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVisits());
    dispatch(fetchClaims());
    dispatch(fetchPreAuths());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'denied': return 'bg-destructive text-destructive-foreground';
      case 'under-review': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-primary text-primary-foreground';
      case 'open': return 'bg-info text-info-foreground';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'denied': return <XCircle className="h-4 w-4" />;
      case 'under-review': return <Clock className="h-4 w-4" />;
      case 'submitted': return <FileText className="h-4 w-4" />;
      case 'open': return <AlertTriangle className="h-4 w-4" />;
      case 'closed': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };


  const handleViewDetails = (visit: typeof visits[0]) => {
    setSelectedVisit(visit);
    setDialogOpen(true);
  };

  const filteredVisits = selectedStatus === 'all'
    ? visits
    : visits.filter(v => v.status === selectedStatus);

  const renderVisitsTable = (visitsToRender: typeof visits) => {
    if (!visitsToRender.length) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Visits Found</h3>
          <p className="text-muted-foreground">Try adjusting the filters</p>
        </div>
      );
    }

    return (
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit No</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>PreAuth Required</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitsToRender.slice() // create a shallow copy to avoid mutating original state
                .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
                .map((visit, index) => (
                  <TableRow key={visit.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{visit.patient_name}</TableCell>
                    <TableCell>{visit.reason}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(visit.status)} gap-2`}>
                        {getStatusIcon(visit.status)}
                        {visit?.status?.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{visit.charges} {visit.currency}</TableCell>
                    <TableCell>
                      <Badge variant={visit.ai_pre_auth_required ? "default" : "secondary"}>
                        {visit.ai_pre_auth_required ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(visit)}
                          className="hover:bg-info-light hover:text-info"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  // Visit Details Dialog Component
  const VisitDetailsDialog = () => {
    if (!selectedVisit) return null;
    const [editMode, setEditMode] = useState(false);
    const [editableVisit, setEditableVisit] = useState({ ...selectedVisit });



    const visitClaims = claims.filter(c => c.visit_id === selectedVisit.id);
    const visitPreAuth = preauths.find(p => p.visit_id === selectedVisit.id);
    useEffect(() => {
      if (selectedVisit) setEditableVisit({ ...selectedVisit });
    }, []);

    const handleSaveChanges = async (e) => {
      e.preventDefault();
      setDialogOpen(false);

      try {
        await dispatch(updateVisit({
          visitId: editableVisit.id,
          updateData: {
            reason: editableVisit.reason,
            notes: editableVisit.notes,
            charges: editableVisit.charges,
            status: editableVisit.status
          }
        }));
        dispatch(fetchVisits());
        setEditMode(false);
        setDialogOpen(false);
      } catch (err) {
        console.error("Failed to update visit:", err);
      }
    };

    const handleFieldChange = (field: string, value: any) => {
      setEditableVisit((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Visit Details - {selectedVisit.id}
            </DialogTitle>
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="secondary" onClick={() => {
                    setEditableVisit({ ...selectedVisit });
                    setEditMode(false);

                  }}>Cancel</Button>
                  <Button variant="default" onClick={handleSaveChanges}>Save</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditMode(true)}>Edit</Button>
              )}
            </div>
          </DialogHeader>

          <Tabs defaultValue="visit" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="visit" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Visit Info
              </TabsTrigger>
              <TabsTrigger value="preauth" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                PreAuth Info
              </TabsTrigger>
              <TabsTrigger value="claims" className="flex items-center gap-2">
                <Receipt className="w-4 h-4" />
                Claims Info
              </TabsTrigger>
            </TabsList>

            {/* Visit Info Tab */}
            <TabsContent value="visit" className="space-y-4 mt-6">
              <Card className="bg-info-light border border-info/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-info">
                    <FileText className="w-5 h-5" />
                    Visit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Visit ID</label>
                      <p className="font-semibold">{selectedVisit.id}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Patient</label>
                      <p className="font-semibold">{selectedVisit.patient_name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Reason</label>
                      {editMode ? (
                        <Input
                          value={editableVisit.reason}
                          onChange={(e) => handleFieldChange('reason', e.target.value)}
                        />
                      ) : (
                        <p className="font-semibold">{editableVisit.reason}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      {editMode ? (
                        <Select value={editableVisit.status} onValueChange={(val) => handleFieldChange('status', val)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="under-review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="denied">Denied</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getStatusColor(editableVisit.status)} gap-2 w-fit`}>
                          {getStatusIcon(editableVisit.status)}
                          {editableVisit?.status?.replace('-', ' ')}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Charges</label>
                      {editMode ? (
                        <Input
                          type="number"
                          value={editableVisit.charges}
                          onChange={(e) => handleFieldChange('charges', parseFloat(e.target.value))}
                        />
                      ) : (
                        <p className="font-semibold">{editableVisit.charges} {editableVisit.currency}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">PreAuth Required</label>
                      <Badge variant={selectedVisit.ai_pre_auth_required ? "default" : "secondary"} className="w-fit">
                        {selectedVisit.ai_pre_auth_required ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    {editMode ? (
                      <textarea
                        className="w-full border rounded-md p-2"
                        value={editableVisit.notes}
                        onChange={(e) => handleFieldChange('notes', e.target.value)}
                      />
                    ) : (
                      <p className="font-medium bg-background/50 p-3 rounded-lg">{editableVisit.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PreAuth and Claims Tabs remain unchanged */}
            <TabsContent value="preauth" className="space-y-4 mt-6">
              {visitPreAuth ? (
                <Card className="bg-warning-light border border-warning/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <Shield className="w-5 h-5" />
                      PreAuthorization Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Requested Amount</label>
                        <p className="font-semibold text-lg">{visitPreAuth.requested_amount} {visitPreAuth.currency}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <Badge className={`${getStatusColor(visitPreAuth.status)} gap-2 w-fit`}>
                          {getStatusIcon(visitPreAuth.status)}
                          {visitPreAuth.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">AI Recommendation</label>
                      <p className="font-medium bg-background/50 p-3 rounded-lg">{visitPreAuth.ai_recommendation}</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/20 border border-muted">
                  <CardContent className="text-center py-8">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No PreAuthorization</h3>
                    <p className="text-muted-foreground">This visit does not require pre-authorization</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="claims" className="space-y-4 mt-6">
              {visitClaims.length > 0 ? (
                <div className="space-y-4">
                  <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-primary" />
                        Claims ({visitClaims.length})
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  {visitClaims.map((claim) => (
                    <Card key={claim.id} className="bg-success-light border border-success/20">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Claim ID</label>
                            <p className="font-semibold">{claim.id}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Patient Name</label>
                            <p className="font-semibold">{claim.patient_name}</p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Amount</label>
                            <p className="font-semibold text-lg text-success">{claim.total_claim_charges} </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <Badge className={`${getStatusColor(claim.status)} gap-2 w-fit`}>
                              {getStatusIcon(claim.status)}
                              {claim.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/20 border border-muted">
                  <CardContent className="text-center py-8">
                    <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Claims</h3>
                    <p className="text-muted-foreground">No claims have been submitted for this visit</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visits Management</h1>
          <p className="text-muted-foreground">Manage and track visits, claims, and pre-authorizations</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Patient
        </Button>

        <RegisterVisitDialog open={openDialog} onOpenChange={setOpenDialog} />
      </div>

      <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Visits</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="under-review">Under Review</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="denied">Denied</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="all" className="space-y-4">
          {renderVisitsTable(filteredVisits)}
        </TabsContent>
        <TabsContent value="open" className="space-y-4">
          {renderVisitsTable(filteredVisits.filter(v => v.status === 'open'))}
        </TabsContent>
        <TabsContent value="under-review" className="space-y-4">
          {renderVisitsTable(filteredVisits.filter(v => v.status === 'under-review'))}
        </TabsContent>
        <TabsContent value="approved" className="space-y-4">
          {renderVisitsTable(filteredVisits.filter(v => v.status === 'approved'))}
        </TabsContent>
        <TabsContent value="denied" className="space-y-4">
          {renderVisitsTable(filteredVisits.filter(v => v.status === 'denied'))}
        </TabsContent>
        <TabsContent value="closed" className="space-y-4">
          {renderVisitsTable(filteredVisits.filter(v => v.status === 'closed'))}
        </TabsContent>
      </Tabs>

      <VisitDetailsDialog />
    </div>
  );
}