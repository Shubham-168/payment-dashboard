import { memo } from "react";
import { Pencil, Trash2, ArrowDownCircle, ArrowUpCircle, CoinsIcon, } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/customer";

interface CustomerCardProps {
    customer: Customer;
    onEdit: () => void;
    onDelete: () => void;
}

const statusStyles: Record<string, string> = {
    Open: "bg-blue-100 text-blue-600",
    Paid: "bg-green-100 text-green-600",
    Due: "bg-red-100 text-red-600",
    Inactive: "bg-slate-200 text-slate-600",
};

function CustomerCardComponent({ customer, onEdit, onDelete }: CustomerCardProps) {
    const statusClass = statusStyles[customer.status] ?? "bg-slate-100 text-slate-700";

    const deposit = customer.deposit;
    const balance = customer.balance;
    const rate = customer.rate;

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs space-y-2">
            {/* Row 1 */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                        {customer.name}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className={statusClass}>{customer.status}</Badge>

                    <button
                        type="button"
                        aria-label="Edit customer"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#2264E5]"
                        onClick={onEdit}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        aria-label="Delete customer"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-red-600 hover:bg-red-50"
                        onClick={onDelete}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Row 2 */}
            <p className="text-xs text-slate-500 line-clamp-1">
                {customer.description || "No description"}
            </p>

            {/* Row 3 */}
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center gap-1 text-yellow-600">
                    <CoinsIcon className="h-3.5 w-3.5" />
                    <span className="font-medium">Rate:</span>
                    <span className="text-[11px]">₹{rate.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                    <ArrowDownCircle className="h-3.5 w-3.5" />
                    <span className="font-medium">Deposit:</span>
                    <span className="text-[11px]">₹{deposit.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-sky-700">
                    <ArrowUpCircle className="h-3.5 w-3.5" />
                    <span className="font-medium">Balance:</span>
                    <span className="text-[11px]">₹{balance.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

const CustomerCard = memo(CustomerCardComponent);

export default CustomerCard;

