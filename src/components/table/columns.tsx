import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Pencil } from "lucide-react";
import type { Customer } from "@/types/customer";
import { useUIStore } from "@/store/useUIStore";
import { CellWithTooltip } from "./CellWithTooltip";

export const columns: ColumnDef<Customer>[] = [
    {
        id: "select",
        size: 40,
        header: ({ table }) => {
            const isAll = table.getIsAllPageRowsSelected();
            const isSome = table.getIsSomePageRowsSelected();

            return (
                <button
                    type="button"
                    onClick={() => {
                        if (isAll || isSome) {
                            table.resetRowSelection(); 
                        } else {
                            table.toggleAllPageRowsSelected(true); 
                        }
                    }}
                    className={`
                  h-4 w-4 rounded-[4px] border flex items-center justify-center cursor-pointer
                  transition-colors
                  ${isAll || isSome ? "bg-[#2264E5] border-[#2264E5]" : "bg-white border-slate-300"}
                `}
                >
                    {isAll && (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}

                    {isSome && !isAll && (
                        <Minus className="block h-[2px] w-[10px] bg-white rounded" />
                    )}
                </button>
            );
        },

        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                className="cursor-pointer"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        accessorKey: "name",
        header: "NAME",
        size: 150,
        cell: ({ row }) => (
            <CellWithTooltip> {row.getValue('name')} </CellWithTooltip>
        ),
    },
    {
        accessorKey: "description",
        header: "DESCRIPTION",
        size: 280,
        cell: ({ row }) => (
            <CellWithTooltip> {row.getValue('description')} </CellWithTooltip>
        ),
    },
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
        size: 80,
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
