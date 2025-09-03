import { useEffect, useState } from "react";
import { AppDispatch, RootState, useAppDispatch, useAppSelector } from "@/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createPatient, fetchInsurances, fetchPatients } from "@/store/slices/patientsSlice";
import { Patient } from "@/types/healthcare";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RegisterPatientDialog({ open, onOpenChange }: Props) {
    const dispatch = useAppDispatch();
    const { insurances } = useAppSelector((state: RootState) => state.patients);
    const [formData, setFormData] = useState<Partial<Patient>>({
        name: "",
        nationality: "citizen",
        insurance_type: "Private",
        insurance_id: "",
        date_of_birth: "",
        gender: "male",
        phone_number: "",
        email: "",
    });

    useEffect(() => {
        dispatch(fetchInsurances());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleInsuranceChange = (insuranceName: string) => {
        const [insurance_id, insurance_type] = insuranceName.split("|");
        const insurance = insurances.find(ins => ins.id === insurance_id);
        if (insurance) {
            setFormData({
                ...formData,
                insurance_id: insurance.id,
                country: insurance.country,
                insurance_type: insurance.insurance_types[0], 
            });
        }
    };
    const handleSubmit = async () => {
        await dispatch(createPatient(formData));
        dispatch(fetchPatients({}));
        onOpenChange(false); 
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div>
                        <Label>Name</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <Input name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Date of Birth</Label>
                        <Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <Select name="gender" value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Nationality</Label>
                        <Select
                            name="nationality"
                            value={formData.nationality}
                            onValueChange={(val) => setFormData({ ...formData, nationality: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Nationality" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="citizen">Citizen</SelectItem>
                                <SelectItem value="expatriate">Expatriate</SelectItem>
                                <SelectItem value="visitor">Visitor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Insurance</Label>
                        <Select
                            name="insurance"
                            value={formData.insurance_type ? `${formData.insurance_id}|${formData.insurance_type}` : ""}
                            onValueChange={handleInsuranceChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Insurance" />
                            </SelectTrigger>
                            <SelectContent>
                                {insurances.map((ins) =>
                                    ins.insurance_types.map((type) => (
                                        <SelectItem key={`${ins.id}-${type}`} value={`${ins.id}|${type}`}>
                                            {ins.name} - {type}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Register</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
