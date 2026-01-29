import { flexRender, getCoreRowModel, useReactTable, type PaginationState, } from "@tanstack/react-table";
import { Plus, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useCustomers, useDeleteCustomer } from "../../hooks/useCustomers";
import { useUIStore } from "../../store/useUIStore";
import CustomerCard from "../cards/CustomerCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow, } from "../ui/table";
import { columns } from "./columns";
import Swal from "sweetalert2";


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

    const handleDelete = useCallback(async () => {
        const ids = table.getSelectedRowModel().rows.map((r) => r.original.id)
        if (!ids.length) return

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to delete this payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2264E5",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it",
        })

        if (!result.isConfirmed) return

        deleteMutation.mutate(ids, {
            onSuccess: () => {
                setRowSelection({})
                setSelectedRows([])
                toast.success("Customer(s) deleted")
            },
            onError: () => toast.error("Failed to delete customer(s)"),
        })
    }, [deleteMutation, setSelectedRows, table])

    // const handleDelete = useCallback(() => {
    //     const ids = table.getSelectedRowModel().rows.map((r) => r.original.id);
    //     if (!ids.length) return;

    //     deleteMutation.mutate(ids, {
    //         onSuccess: () => {
    //             setRowSelection({});
    //             setSelectedRows([]);
    //             toast.success("Customer(s) deleted");
    //         },
    //         onError: () => {
    //             toast.error("Failed to delete customer(s)");
    //         },
    //     });
    // }, [deleteMutation, setSelectedRows, table]);

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
            <div className="hidden md:flex bg-white rounded-xl shadow-sm flex-col h-[calc(100vh-5rem)] overflow-hidden">

                <Table className="w-full h-full table-fixed grid grid-rows-[auto_1fr_auto]">

                    {/* Header */}
                    <TableHeader className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b">
                        <TableRow className="table w-full h-[56px]">
                            <TableHead colSpan={columns.length}>
                                <div className="flex items-center justify-between gap-4 py-3">
                                    <div className="flex-1 flex items-center gap-3">
                                        {hasSelection ? (
                                            <>
                                                <span className="text-sm text-slate-700">
                                                    {table.getSelectedRowModel().rows.length} {table.getSelectedRowModel().rows.length > 1 ? 'Rows' : 'Row'} Selected
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-9 w-9 text-[#2264E5]"
                                                    onClick={handleDelete}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <Input
                                                placeholder="Search..."
                                                className="w-[260px]"
                                                value={searchInput}
                                                onChange={(e) => onSearchChange(e.target.value)}
                                            />
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => {
                                            setEditing(null)
                                            openModal()
                                        }}
                                        size="sm"
                                        className="bg-[#2264E5] text-white hover:bg-[#1b53bc]"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Customer
                                    </Button>
                                </div>
                            </TableHead>
                        </TableRow>

                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="table w-full h-[44px]">
                                {hg.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="text-xs text-start lg:text-sm font-semibold"
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    {/* Scrollable Body */}
                    <TableBody className="block overflow-y-auto">
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow className="table w-full">
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-full text-center text-muted-foreground"
                                >
                                    No data to display
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="table w-full table-fixed h-[48px]"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className="truncate text-start"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>

                    {/* Footer */}
                    <TableFooter className="sticky bottom-0 z-20 bg-white/90 backdrop-blur-md border-t">
                        <TableRow className="table w-full h-[56px]">
                            <TableCell colSpan={columns.length}>
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
                            </TableCell>
                        </TableRow>
                    </TableFooter>

                </Table>

            </div>

            {/* Mobile card layout */}
            {/* <div className="md:hidden mt-2 space-y-4"> */}
            <div className="md:hidden mt-1 flex flex-col h-[calc(100vh-64px)]">

                {/* Toolbar */}
                {/* <div className="mb-2 flex items-center justify-between gap-3"> */}
                <div className="sticky top-0 z-20 bg-slate-50 pb-2 flex items-center justify-between gap-3">
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
                    // <div className="space-y-3 mt-2 overflow-y-auto">
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">

                        {customers.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onEdit={() => {
                                    setEditing(customer);
                                    openModal();
                                }}
                                onDelete={async () => {
                                    const result = await Swal.fire({
                                        title: "Are you sure?",
                                        text: "You want to delete this payment?",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#2264E5",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Yes, delete it",
                                    })

                                    if (!result.isConfirmed) return

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
