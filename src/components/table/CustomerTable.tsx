import { useState } from "react"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, } from "@tanstack/react-table"
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table"
import { Input } from "../ui/input"
import { Trash2, Plus } from "lucide-react"
import { useUIStore } from "../../store/useUIStore"
import { columns } from "./columns"

export default function CustomerTable() {
    const { data = [] } = useCustomers()
    const { openModal } = useUIStore()
    const deleteMutation = useDeleteCustomer()
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="bg-white rounded-xl border shadow-sm">
            <div className="flex items-center justify-between p-4 border-b">
                <Input placeholder="Search..." className="w-[260px]" />

                <div className="flex gap-2">
                    <Button onClick={openModal} size="sm" color="white" className="text-black bg-[#2264E5]" >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Add Customer</span>
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() =>
                            deleteMutation.mutate(
                                table.getSelectedRowModel().rows.map((r) => r.original.id)
                            )
                        }
                        size="sm"
                        color="white"
                        className="text-black bg-[#2264E5]"
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((hg) => (
                        <TableRow key={hg.id}>
                            {hg.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between p-4 border-t text-sm">
                <span>1–10 of {data.length}</span>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => table.previousPage()}
                    >
                        Prev
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => table.nextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
