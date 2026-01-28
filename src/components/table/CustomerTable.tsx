import { useCallback, useEffect, useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type PaginationState,
} from "@tanstack/react-table";
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers";
import { Button } from "../ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Trash2, Plus, User, UserPlus } from "lucide-react";
import { useUIStore } from "../../store/useUIStore";
import { columns } from "./columns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import CustomerCard from "../cards/CustomerCard";
import { toast } from "react-toastify";

const DEBOUNCE_MS = 400;

export default function CustomerTable() {
    const { openModal, setEditing, setSelectedRows } = useUIStore();
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
        const handle = window.setTimeout(
            () => setSearch(searchInput),
            DEBOUNCE_MS
        );
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
                toast.success("Customer(s) deleted");
            },
            onError: () => {
                toast.error("Failed to delete customer(s)");
            },
        });
    }, [deleteMutation, setSelectedRows, table]);

    const pageStart =
        total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
    const pageEnd =
        total === 0
            ? 0
            : Math.min(
                  (pagination.pageIndex + 1) * pagination.pageSize,
                  total
              );
    const totalPages =
        total === 0 ? 1 : Math.ceil(total / pagination.pageSize);

    const onSearchChange = (value: string) => {
        setSearchInput(value);
        setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
        }));
    };

    return (
        <>
            {/* Desktop table layout */}
            <div className="hidden md:flex bg-white rounded-xl shadow-sm flex-col h-[calc(100vh-4rem)]">
                <div className="relative flex-1 overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
                            <TableRow>
                                <TableHead colSpan={columns.length}>
                                    <div className="flex items-center justify-between gap-4 py-3">
                                        <div className="flex-1 flex items-center gap-3">
                                            {hasSelection ? (
                                                <>
                                                    <span className="text-sm text-slate-700">
                                                        {
                                                            table
                                                                .getSelectedRowModel()
                                                                .rows.length
                                                        } selected
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="outline"
                                                        className="h-9 w-9 text-[#2264E5]"
                                                        disabled={
                                                            deleteMutation.isPending
                                                        }
                                                        onClick={() => {
                                                            const ok =
                                                                window.confirm(
                                                                    "Are you sure you want to delete this payment?"
                                                                );
                                                            if (ok) {
                                                                handleDelete();
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Input
                                                    placeholder="Search..."
                                                    className="w-[260px]"
                                                    value={searchInput}
                                                    onChange={(e) =>
                                                        onSearchChange(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => {
                                                setEditing(null);
                                                openModal();
                                            }}
                                            size="sm"
                                            className="text-white bg-[#2264E5] hover:bg-[#1b53bc]"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            <span className="text-sm">
                                                Add Customer
                                            </span>
                                        </Button>
                                    </div>
                                </TableHead>
                            </TableRow>
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
                                                    cell.column
                                                        .columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-md border-t">
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
                                            {[10, 20, 30, 40, 50].map(
                                                (size) => (
                                                    <SelectItem
                                                        key={size}
                                                        value={String(size)}
                                                    >
                                                        {size}
                                                    </SelectItem>
                                                )
                                            )}
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
                                        {pagination.pageIndex + 1} of{" "}
                                        {totalPages}
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

            {/* Mobile card layout */}
            <div className="md:hidden mt-2 space-y-4">
                {/* Toolbar */}
                <div className="mb-2 flex items-center justify-between gap-3">
                    <Button
                        type="button"
                        size="icon"
                        className="h-9 w-9 text-white bg-[#2264E5] hover:bg-[#1b53bc]"
                        onClick={() => {
                            setEditing(null);
                            openModal();
                        }}
                    >
                        <UserPlus w-4 h-4 />
                    </Button>

                    <Input
                        placeholder="Search customers..."
                        className="flex-1 h-9 text-sm"
                        value={searchInput}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {customers.length === 0 ? (
                    <div className="flex h-screen items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-sm text-muted-foreground">
                        No data to display
                    </div>
                ) : (
                    <div className="space-y-3">
                        {customers.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onEdit={() => {
                                    setEditing(customer);
                                    openModal();
                                }}
                                onDelete={() => {
                                    deleteMutation.mutate([customer.id], {
                                        onSuccess: () =>
                                            toast.success("Customer deleted"),
                                        onError: () =>
                                            toast.error(
                                                "Failed to delete customer"
                                            ),
                                    });
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
