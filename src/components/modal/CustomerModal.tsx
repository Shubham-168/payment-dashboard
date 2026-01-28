import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"

import { useUIStore } from "../../store/useUIStore"
import { useCreateCustomer } from "../../hooks/useCustomers"
import { v4 as uuid } from "uuid"
import { useState } from "react"
import type { Status } from "../../types/customer"

export default function CustomerModal() {
    const { modalOpen, closeModal } = useUIStore()
    const createMutation = useCreateCustomer()

    const [form, setForm] = useState({
        name: "",
        description: "",
        status: "Open" as Status,
        rate: "",
        balance: "",
        deposit: "",
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.name.trim() || !form.rate) return

        createMutation.mutate(
            {
                id: uuid(),
                name: form.name.trim(),
                description: form.description.trim(),
                status: form.status,
                rate: Number(form.rate),
                balance: form.balance ? Number(form.balance) : 0,
                deposit: form.deposit ? Number(form.deposit) : 0,
            },
            {
                onSuccess: () => {
                    closeModal()
                    setForm({
                        name: "",
                        description: "",
                        status: "Open",
                        rate: "",
                        balance: "",
                        deposit: "",
                    })
                },
            }
        )
    }

    return (
        <Dialog open={modalOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add Customer</DialogTitle>
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
                                setForm({ ...form, description: e.target.value })
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
                                <SelectItem value="Inactive">Inactive</SelectItem>
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
                                    setForm({ ...form, balance: e.target.value })
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
                                    setForm({ ...form, deposit: e.target.value })
                                }
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-[#2264E5]"
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Saving..." : "Save Customer"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
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