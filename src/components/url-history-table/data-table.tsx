import * as React from 'react';
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ShortendUrlResponseData } from './types';
import clsx from 'clsx';
import { useMutation } from '@/common/hooks';
import { CustomColumns } from './columns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { isEmpty } from 'lodash';
import QRCode from 'react-qr-code';

const ShortUrlQRPopUp = (props: {
    url: string;
    setUrl: (url: string) => void;
}) => {
    if (isEmpty(props.url)) {
        return <> </>;
    }

    return (
        <Dialog
            open={!isEmpty(props.url)}
            onOpenChange={(isOpen) => {
                !isOpen && props.setUrl(null);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Scan the QR to redirect from Shorty URL to original{' '}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-5 m-3 justify-center items-center">
                    <div className="bg-white p-2 rounded-md w-22">
                        <QRCode className="h-14 w-14" value={props.url} />
                    </div>
                    {props.url}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export const DataTable = ({
    data,
    refetchTableData,
}: {
    data: ShortendUrlResponseData[];
    refetchTableData: () => void;
}) => {
    // States.
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [mouseHoverRowId, setMouseHoverRowId] = React.useState('');
    const [shortUrl, setShortUrl] = React.useState('');

    // Hooks.
    const { isSuccess, request, reset } = useMutation();

    const columns = CustomColumns(mouseHoverRowId, setShortUrl);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    // useEffect.
    React.useEffect(() => {
        if (isSuccess) {
            reset();
            setRowSelection({});
            refetchTableData();
        }
    }, [isSuccess]);

    // Custom classname.
    const deletebuttonClass = clsx([
        'mx-2  hover:cursor-pointer',
        Object.keys(rowSelection).length
            ? 'stroke-red-400 hover:stroke-red-300'
            : 'stroke-gray-600 hover:cursor-not-allowed',
    ]);

    // Handlers.
    const handleDeleteUrl = () => {
        const selectedRowModel = table.getSelectedRowModel();
        const shortendUrlIds = selectedRowModel.rows.map(
            (row) => row.original['id']
        );
        const userId = selectedRowModel.rows[0].original['userId'];

        request('/api/shortend-urls', {
            method: 'POST',
            body: JSON.stringify({
                userId,
                shortendUrlIds,
            }),
        });
    };

    return (
        <div className="w-full">
            <ShortUrlQRPopUp url={shortUrl} setUrl={setShortUrl} />
            <div className="flex items-center py-4 m-3">
                <Input
                    placeholder="Filter long urls..."
                    value={
                        (table
                            .getColumn('longUrl')
                            ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                        table
                            .getColumn('longUrl')
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Trash2
                    className={deletebuttonClass}
                    onClick={handleDeleteUrl}
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border m-3 relative">
                <Table containerClassName="h-[33rem]">
                    <TableHeader className="sticky top-0 backdrop-blur-xl">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                    onMouseEnter={() =>
                                        setMouseHoverRowId(row.id)
                                    }
                                    onMouseLeave={() => setMouseHoverRowId('')}
                                >
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
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4 m-3">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};
