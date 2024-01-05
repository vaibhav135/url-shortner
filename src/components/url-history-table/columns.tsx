'use client';

import CustomClipboard from '../ui/clipboard';
import { ComponentSize, ComponentIntent } from '@/common';
import { ArrowUpDown, QrCode } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { ShortendUrlResponseData } from './types';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui';

export const CustomColumns = (
    mouseHoverId: string,
    setShortUrl: (url: string) => void
): ColumnDef<ShortendUrlResponseData>[] => {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'shortUrl',
            header: 'Short Url',
            cell: ({ row }) => (
                <div className="flex flex-row items-center w-2/4">
                    <span className="w-48">{row.getValue('shortUrl')}</span>
                    <div className="row-center gap-2 w-16">
                        {mouseHoverId == row.id && (
                            <>
                                <CustomClipboard
                                    data={row.getValue('shortUrl')}
                                    customStyle={{
                                        intent: ComponentIntent.PRIMARY,
                                        size: ComponentSize.SMALL,
                                    }}
                                />
                                <QrCode
                                    onClick={() =>
                                        setShortUrl(row.getValue('shortUrl'))
                                    }
                                    className="w-5 h-5 rounded hover:bg-gray-600 hover:rounded hover:cursor-pointer"
                                />
                            </>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'longUrl',
            header: () => <div> Long Url </div>,
            cell: ({ row }) => (
                <div className="lowercase">{row.getValue('longUrl')}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => {
                return (
                    <div className="text-right">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                            className="right"
                        >
                            Created At
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                );
            },
            cell: ({ row }) => {
                const createdAt: string = new Date(
                    row.getValue('createdAt')
                ).toLocaleDateString();

                return (
                    <div className="text-right font-medium">{createdAt}</div>
                );
            },
        },
    ];
};
