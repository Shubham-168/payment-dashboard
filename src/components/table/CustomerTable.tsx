import { useCallback, useEffect, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable, type PaginationState, } from "@tanstack/react-table";
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "../ui/table";
import { Input } from "../ui/input";
import { Trash2, Plus } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { columns } from "./columns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";

const DEBOUNCE_MS = 400;

export default function CustomerTable() {
    const { openModal, selectedRows, setSelectedRows } = useUIStore();
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
        {}
    );
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    useEffect(() => {
        const handle = window.setTimeout(() => setSearch(searchInput), DEBOUNCE_MS);
        return () => window.clearTimeout(handle);
    }, [searchInput]);

    const { data } = useCustomers({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
    });

    const customers = useMemo(() => data?.data ?? [], [data]);
    const total = data?.total ?? 0;

    const deleteMutation = useDeleteCustomer();

    const table = useReactTable({
        data: customers,
        columns,
        state: { rowSelection, pagination },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount:
            total > 0 ? Math.ceil(total / pagination.pageSize) : undefined,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        const selected = table
            .getSelectedRowModel()
            .rows.map((r) => r.original);
        setSelectedRows(selected);
    }, [rowSelection, setSelectedRows, table]);

    const hasSelection = table.getSelectedRowModel().rows.length > 0;

    const handleDelete = useCallback(() => {
        const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
        if (!ids.length) return;

        deleteMutation.mutate(ids, {
            onSuccess: () => {
                setRowSelection({});
                setSelectedRows([]);
            },
        });
    }, [deleteMutation, setSelectedRows, table]);

    const pageStart = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
    const pageEnd =
        total === 0
            ? 0
            : Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                total
            );
    const totalPages =
        total === 0 ? 1 : Math.ceil(total / pagination.pageSize);

    return (
        <div className="bg-white rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex-1">
                    {hasSelection ? (
                        <>
                            <span> {selectedRows.length} Rows Selected </span>
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                className="h-9 w-9 text-[#2264E5]"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <Input
                            placeholder="Search..."
                            className="w-[260px]"
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setPagination((prev) => ({
                                    ...prev,
                                    pageIndex: 0,
                                }));
                            }}
                        />
                    )}
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={openModal}
                        size="sm"
                        className="text-white bg-[#2264E5] hover:bg-[#1b53bc]"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Add Customer</span>
                    </Button>
                </div>
            </div>

            <div className="relative max-h-[480px] overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
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
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-40 text-center text-muted-foreground"
                                >
                                    No data to display
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
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
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-sm border-t">
                    <div className="flex items-center justify-between p-4 text-sm">
                        <span>
                            {pageStart}–{pageEnd} of {total}
                        </span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    Rows per page
                                </span>
                                <Select
                                    value={String(pagination.pageSize)}
                                    onValueChange={(value) => {
                                        const size = Number(value);
                                        setPagination({
                                            pageIndex: 0,
                                            pageSize: size,
                                        });
                                    }}
                                >
                                    <SelectTrigger className="h-8 w-[72px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 20, 30, 40, 50].map((size) => (
                                            <SelectItem
                                                key={size}
                                                value={String(size)}
                                            >
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => table.previousPage()}
                                    disabled={
                                        !table.getCanPreviousPage() ||
                                        deleteMutation.isPending
                                    }
                                >
                                    {"<"}
                                </Button>
                                <span className="text-xs text-muted-foreground">
                                    {pagination.pageIndex + 1} of {totalPages}
                                </span>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-8 w-8"
                                    onClick={() => table.nextPage()}
                                    disabled={
                                        !table.getCanNextPage() ||
                                        deleteMutation.isPending
                                    }
                                >
                                    {">"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
