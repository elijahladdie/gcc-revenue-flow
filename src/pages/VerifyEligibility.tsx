import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { mockPatients, countryInfo } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEligibility() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const handleVerification = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a patient ID or insurance number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const patient = mockPatients.find(p => 
        p.insuranceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (patient) {
        setVerificationResult({
          ...patient,
          eligibilityCheck: {
            status: patient.eligibilityStatus,
            lastVerified: new Date().toISOString(),
            validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            benefits: ['Inpatient Care', 'Outpatient Services', 'Emergency Care', 'Prescription Drugs'],
            copayAmount: Math.floor(Math.random() * 500) + 100,
            deductible: Math.floor(Math.random() * 2000) + 500,
            maxCoverage: 50000 + Math.floor(Math.random() * 100000),
          }
        });
        toast({
          title: "Verification Complete",
          description: `Patient eligibility verified successfully`,
        });
      } else {
        setVerificationResult(null);
        toast({
          title: "Patient Not Found",
          description: "No patient found with the provided information",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 2000);
  };

  const getEligibilityIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <UserCheck className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verify Patient Eligibility</h1>
          <p className="text-muted-foreground">Real-time insurance eligibility verification across GCC countries</p>
        </div>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Patient Eligibility Search</span>
          </CardTitle>
          <CardDescription>
            Enter patient information to verify insurance eligibility and benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Patient ID or Insurance Number</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Enter ID or insurance number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country (Optional)</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {Object.entries(countryInfo).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      {info.flag} {info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleVerification} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserCheck className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Verifying...' : 'Verify Eligibility'}
              </Button>
            </div>
          </div>

          {/* Quick Search Suggestions */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Search Examples:</Label>
            <div className="flex flex-wrap gap-2">
              {mockPatients.slice(0, 3).map((patient) => (
                <Button
                  key={patient.id}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm(patient.insuranceId)}
                >
                  {patient.insuranceId}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {verificationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getEligibilityIcon(verificationResult.eligibilityStatus)}
              <span>Eligibility Verification Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Information */}
            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {verificationResult.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{verificationResult.name}</h3>
                  <Badge className={getEligibilityColor(verificationResult.eligibilityStatus)}>
                    {getEligibilityIcon(verificationResult.eligibilityStatus)}
                    {verificationResult.eligibilityStatus.toUpperCase()}
                  </Badge>
                </div>
                {verificationResult.nameAr && (
                  <p className="text-muted-foreground">{verificationResult.nameAr}</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Country:</span>
                    <p className="font-medium">
                      {countryInfo[verificationResult.country].flag} {countryInfo[verificationResult.country].name}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Insurance:</span>
                    <p className="font-medium">{verificationResult.insuranceType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>
                    <p className="font-medium">{verificationResult.insuranceId}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nationality:</span>
                    <p className="font-medium capitalize">{verificationResult.nationality}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility Details */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coverage Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maximum Coverage:</span>
                      <span className="font-semibold">
                        {verificationResult.eligibilityCheck.maxCoverage.toLocaleString()} {countryInfo[verificationResult.country].currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deductible:</span>
                      <span className="font-semibold">
                        {verificationResult.eligibilityCheck.deductible.toLocaleString()} {countryInfo[verificationResult.country].currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Copay Amount:</span>
                      <span className="font-semibold">
                        {verificationResult.eligibilityCheck.copayAmount.toLocaleString()} {countryInfo[verificationResult.country].currency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Covered Benefits:</span>
                    <div className="flex flex-wrap gap-1">
                      {verificationResult.eligibilityCheck.benefits.map((benefit: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Verified:</span>
                      <span className="font-medium">
                        {new Date(verificationResult.eligibilityCheck.lastVerified).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="font-medium">
                        {new Date(verificationResult.eligibilityCheck.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {verificationResult.medicalHistory && verificationResult.medicalHistory.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Medical History:</span>
                      <div className="flex flex-wrap gap-1">
                        {verificationResult.medicalHistory.map((condition: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button className="w-full">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Proceed with Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Verifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
          <CardDescription>Recently verified patients for quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPatients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.insuranceId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getEligibilityColor(patient.eligibilityStatus)}>
                    {patient.eligibilityStatus}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSearchTerm(patient.insuranceId)}>
                    Re-verify
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}