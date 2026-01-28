import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Customer } from "@/types/customer";
import { useUIStore } from "@/store/useUIStore";

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
            />
        ),
    },
    { accessorKey: "name", header: "NAME" },
    { accessorKey: "description", header: "DESCRIPTION", },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            const map: Record<string, string> = {
                Open: "bg-blue-100 text-blue-600",
                Paid: "bg-green-100 text-green-600",
                Due: "bg-red-100 text-red-600",
                Inactive: "bg-slate-200 text-slate-600",
            };

            return <Badge className={map[status]}>{status}</Badge>;
        },
    },
    { accessorKey: "rate", header: "RATE" },
    { accessorKey: "balance", header: "BALANCE" },
    { accessorKey: "deposit", header: "DEPOSIT" },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
            const { openModal, setEditing } = useUIStore();

            return (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-700 cursor-pointer hover:text-[#2264E5]"
                    onClick={() => {
                        setEditing(row.original);
                        openModal();
                    }}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            );
        },
    },
];
