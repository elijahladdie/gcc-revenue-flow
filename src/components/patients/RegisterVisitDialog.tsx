import { useEffect, useState } from "react";
import { AppDispatch, RootState, useAppDispatch, useAppSelector } from "@/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createVisit, fetchVisits } from "@/store/slices/visitSlice";
import { fetchPatients } from "@/store/slices/patientsSlice";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegisterVisitDialog({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();
  const { visits } = useAppSelector((state: RootState) => state.visit);
  const { patients } = useAppSelector((state: RootState) => state.patients);

  const [formData, setFormData] = useState({
    patient_id: "",
    reason: "",
    notes: "",
    estimated_cost: 0,
    currency: "SAR",
    treatment_category: "",
    vitals: {
      blood_pressure: "",
      heart_rate: 0,
      temperature: 0,
      weight_kg: 0,
    },
  });

  useEffect(() => {
    dispatch(fetchPatients({}));
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.vitals) {
      setFormData({ ...formData, vitals: { ...formData.vitals, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!formData.patient_id) return alert("Please select a patient");
    await dispatch(createVisit(formData));
    dispatch(fetchVisits());
    onOpenChange(false);
    setFormData({
      patient_id: "",
      reason: "",
      notes: "",
      estimated_cost: 0,
      currency: "SAR",
      treatment_category: "",
      vitals: { blood_pressure: "", heart_rate: 0, temperature: 0, weight_kg: 0 },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Register New Visit</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Patient Select */}
          <div>
            <Label>Patient</Label>
            <Select
              value={formData.patient_id}
              onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.phone_number || "No phone"})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reason</Label>
            <Input name="reason" value={formData.reason} onChange={handleChange} required />
          </div>

          <div>
            <Label>Notes</Label>
            <Input name="notes" value={formData.notes} onChange={handleChange} />
          </div>

          <div>
            <Label>Estimated Cost</Label>
            <Input
              type="number"
              name="estimated_cost"
              value={formData.estimated_cost}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Currency</Label>
            <Select
              name="currency"
              value={formData.currency}
              onValueChange={(val) => setFormData({ ...formData, currency: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAR">SAR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Treatment Category</Label>
            <Input
              name="treatment_category"
              value={formData.treatment_category}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Blood Pressure</Label>
            <Input name="blood_pressure" value={formData.vitals.blood_pressure} onChange={handleChange} />
          </div>

          <div>
            <Label>Heart Rate</Label>
            <Input
              type="number"
              name="heart_rate"
              value={formData.vitals.heart_rate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Temperature</Label>
            <Input
              type="number"
              name="temperature"
              value={formData.vitals.temperature}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              name="weight_kg"
              value={formData.vitals.weight_kg}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Register Visit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
