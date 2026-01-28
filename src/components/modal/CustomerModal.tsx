import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

import { useUIStore } from "../../store/useUIStore";
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useCustomers";
import { v4 as uuid } from "uuid";
import { useEffect, useMemo, useState } from "react";
import type { Customer, Status } from "../../types/customer";
import { toast } from "react-toastify";

interface FormState {
    name: string;
    description: string;
    status: Status;
    rate: string;
    balance: string;
    deposit: string;
}

const emptyForm: FormState = {
    name: "",
    description: "",
    status: "Open",
    rate: "",
    balance: "",
    deposit: "",
};

export default function CustomerModal() {
    const { modalOpen, closeModal, editingCustomer } = useUIStore();
    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();

    const isEditMode = useMemo(
        () => editingCustomer !== null,
        [editingCustomer]
    );

    const [form, setForm] = useState<FormState>(emptyForm);

    useEffect(() => {
        if (editingCustomer && modalOpen) {
            setForm({
                name: editingCustomer.name,
                description: editingCustomer.description,
                status: editingCustomer.status,
                rate: String(editingCustomer.rate),
                balance: String(editingCustomer.balance),
                deposit: String(editingCustomer.deposit),
            });
        } else if (!modalOpen) {
            setForm(emptyForm);
        }
    }, [editingCustomer, modalOpen]);

    const resetAndClose = () => {
        setForm(emptyForm);
        closeModal();
    };

    const buildPayload = (): Partial<Customer> | null => {
        const name = form.name.trim();
        const rate = form.rate.trim();

        if (!name || !rate) return null;

        return {
            name,
            description: form.description.trim(),
            status: form.status,
            rate: Number(rate),
            balance: form.balance ? Number(form.balance) : 0,
            deposit: form.deposit ? Number(form.deposit) : 0,
        };
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = buildPayload();
        if (!payload) return;

        if (isEditMode && editingCustomer) {
            updateMutation.mutate(
                { id: editingCustomer.id, data: payload },
                {
                    onSuccess: () => {
                        toast.success("Customer updated");
                        resetAndClose();
                    },
                    onError: () => {
                        toast.error("Failed to update customer");
                    },
                }
            );
        } else {
            const customer: Customer = {
                id: uuid(),
                name: payload.name ?? "",
                description: payload.description ?? "",
                status: payload.status ?? "Open",
                rate: payload.rate ?? 0,
                balance: payload.balance ?? 0,
                deposit: payload.deposit ?? 0,
            };

            createMutation.mutate(customer, {
                onSuccess: () => {
                    toast.success("Customer created");
                    resetAndClose();
                },
                onError: () => {
                    toast.error("Failed to create customer");
                },
            });
        }
    };

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={modalOpen} onOpenChange={resetAndClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Edit Customer" : "Add Customer"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Name *</Label>
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="Customer name"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Description</Label>
                        <Input
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Short description"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(v) =>
                                setForm({ ...form, status: v as Status })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Due">Due</SelectItem>
                                <SelectItem value="Inactive">
                                    Inactive
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label>Rate *</Label>
                            <Input
                                type="number"
                                value={form.rate}
                                onChange={(e) =>
                                    setForm({ ...form, rate: e.target.value })
                                }
                                placeholder="70"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Balance</Label>
                            <Input
                                type="number"
                                value={form.balance}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        balance: e.target.value,
                                    })
                                }
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label>Deposit</Label>
                            <Input
                                type="number"
                                value={form.deposit}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        deposit: e.target.value,
                                    })
                                }
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-[#2264E5] text-[#FFFFFF]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? isEditMode
                                ? "Updating..."
                                : "Saving..."
                            : isEditMode
                              ? "Update Customer"
                              : "Save Customer"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}





// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useUIStore } from "../../store/useUIStore";
// import { useCreateCustomer } from "../../hooks/useCustomers";
// import { v4 as uuid } from "uuid";


// export default function CustomerModal() {
//     const { modalOpen, closeModal } = useUIStore();
//     const createMutation = useCreateCustomer();


//     const submit = (e: any) => {
//         e.preventDefault();
//         const form = e.target;


//         createMutation.mutate({
//             id: uuid(),
//             name: form.name.value,
//             description: form.description.value,
//             status: form.status.value,
//             rate: +form.rate.value,
//             balance: +form.balance.value,
//             deposit: +form.deposit.value,
//         });


//         closeModal();
//     };


//     return (
//         <Dialog open={modalOpen} onOpenChange={closeModal}>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Add Customer</DialogTitle>
//                 </DialogHeader>


//                 <form onSubmit={submit} className="space-y-3">
//                     <Input name="name" placeholder="Name" required />
//                     <Input name="description" placeholder="Description" />
//                     <Input name="status" placeholder="Status" />
//                     <Input name="rate" type="number" placeholder="Rate" />
//                     <Input name="balance" type="number" placeholder="Balance" />
//                     <Input name="deposit" type="number" placeholder="Deposit" />


//                     <Button type="submit" className="w-full">
//                         Save
//                     </Button>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }