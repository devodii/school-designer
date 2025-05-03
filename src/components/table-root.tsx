"use client"

import { ComponentProps } from "react"

import { MixinProps, splitProps } from "@/lib/mixin"
import { cn } from "@/lib/tw-merge"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

interface TableRootProps<T>
  extends MixinProps<"container", Omit<ComponentProps<"div">, "children">>,
    MixinProps<"table", Omit<ComponentProps<"table">, "children">>,
    MixinProps<"thead", Omit<ComponentProps<"thead">, "children">>,
    MixinProps<"tbody", Omit<ComponentProps<"tbody">, "children">>,
    MixinProps<"tr", Omit<ComponentProps<"tr">, "children">>,
    MixinProps<"td", Omit<ComponentProps<"td">, "children">>,
    MixinProps<"th", Omit<ComponentProps<"th">, "children">> {
  data: T[]
  columns: ColumnDef<NoInfer<T>>[]
}

export const TableRoot = <T,>({ data, columns, ...mixinProps }: TableRootProps<T>) => {
  const { container, table, thead, tbody, tr, td, th } = splitProps(
    mixinProps,
    "container",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
  )

  const reactTable = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Calculate equal column width based on number of columns
  const columnCount = columns.length
  const columnWidthPercentage = columnCount > 0 ? 100 / columnCount : 100

  return (
    <div
      {...container}
      className={cn("w-full overflow-x-auto rounded-lg border border-gray-200 bg-white shadow", container.className)}
    >
      <table {...table} className={cn("w-full min-w-full table-fixed divide-y divide-gray-200", table.className)}>
        <colgroup>
          {columns.map((_, index) => (
            <col key={index} style={{ width: `${columnWidthPercentage}%` }} />
          ))}
        </colgroup>
        <thead {...thead} className={cn("bg-gray-50", thead.className)}>
          {reactTable.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} {...tr}>
              {headerGroup.headers.map(header => (
                <th
                  {...th}
                  key={header.id}
                  className={cn(
                    "truncate overflow-hidden px-6 py-3 text-left text-xs font-medium tracking-wider text-ellipsis whitespace-nowrap text-gray-500 uppercase",
                    th.className,
                  )}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...tbody} className={cn("divide-y divide-gray-100 bg-white", tbody.className)}>
          {reactTable.getRowModel().rows.map(row => (
            <tr {...tr} key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  {...td}
                  key={cell.id}
                  className={cn(
                    "truncate overflow-hidden px-6 py-4 text-sm text-ellipsis whitespace-nowrap text-gray-700",
                    td.className,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
