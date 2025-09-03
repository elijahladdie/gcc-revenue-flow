import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Filter, UserCheck, AlertCircle } from 'lucide-react';
import { countryInfo } from '@/data/mockData';
import type { Patient } from '@/types/healthcare';
import { createPatient, fetchInsurances, fetchPatients } from '@/store/slices/patientsSlice';
import RegisterPatientDialog from '@/components/patients/RegisterPatientDialog';

export default function Patients() {
  const dispatch = useAppDispatch();
  const { ids, entities, loading, patients, insurances } = useAppSelector((state: RootState) => state.patients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedInsurance, setSelectedInsurance] = useState<string>('all');

  const [openDialog, setOpenDialog] = useState(false);
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.insurance_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || patient.country === selectedCountry;
    const matchesInsurance = selectedInsurance === 'all' || patient.insurance_type === selectedInsurance;

    return matchesSearch && matchesCountry && matchesInsurance;
  });

  useEffect(() => {
    dispatch(fetchPatients({}));
    dispatch(fetchInsurances())
  }, [dispatch]);
  // Fetch insurance providers
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getNationalityBadge = (nationality: string) => {
    switch (nationality) {
      case 'citizen': return 'bg-primary text-primary-foreground';
      case 'expatriate': return 'bg-secondary text-secondary-foreground';
      case 'visitor': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const totalPatients = patients.length;

  const verifiedPatients = patients.filter(p => p.eligibility_status === "verified").length;

  const pendingPatients = patients.filter(p => p.eligibility_status === "pending" || p.eligibility_status === "new").length;

  const citizensCount = patients.filter(p =>
    ["Saudi", "Emirati", "citizen"].includes(p.nationality)
  ).length;

  const citizensRatio = ((citizensCount / totalPatients) * 100).toFixed(0); // rounded percentage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Registry</h1>
          <p className="text-muted-foreground">Manage patient records and eligibility verification</p>
        </div>
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Patient
        </Button>

        <RegisterPatientDialog open={openDialog} onOpenChange={setOpenDialog} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Badge variant="secondary">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedPatients}</div>
            <p className="text-xs text-muted-foreground">Real-time eligibility</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPatients}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citizens vs Expats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citizensRatio}%</div>
            <p className="text-xs text-muted-foreground">Citizens ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or insurance ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Insurance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="NPHIES">NPHIES</SelectItem>
                <SelectItem value="CCHI">CCHI</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid gap-4 grid md:grid-cols-2 grid-cols-1">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow ">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{patient.name}</h3>
                      {patient.name_ar && (
                        <span className="text-sm text-muted-foreground">({patient.name_ar})</span>
                      )}
                      <Badge className={getNationalityBadge(patient.nationality)}>
                        {patient.nationality}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{countryInfo[patient?.country]?.flag} {countryInfo[patient?.country]?.name}</span>
                      <span>•</span>
                      <span>ID: {`${patient?.insurance_id?.slice(1,10)}...`}</span>
                      <span>•</span>
                      <span>{patient.insurance_type}</span>
                    </div>
                    {patient.medical_history && patient.medical_history.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {patient.medical_history.slice(0, 3).map(({ condition, diagnosis_date
                          , notes }, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {condition || notes}
                          </Badge>
                        ))}
                        {patient.medical_history.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{patient.medical_history.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(patient.eligibility_status)}>
                    {patient.eligibility_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No patients found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}