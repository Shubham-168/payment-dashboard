import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Customer } from "@/types/customer"

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
    { accessorKey: "description", header: "DESCRIPTION" },
    {
        accessorKey: "status",
        header: "STATUS",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            const map: Record<string, string> = {
                Open: "bg-blue-100 text-blue-600",
                Paid: "bg-green-100 text-green-600",
                Due: "bg-red-100 text-red-600",
                Inactive: "bg-slate-200 text-slate-600",
            }

            return <Badge className={map[status]}>{status}</Badge>
        },
    },
    { accessorKey: "rate", header: "RATE" },
    { accessorKey: "balance", header: "BALANCE" },
    { accessorKey: "deposit", header: "DEPOSIT" },
]
