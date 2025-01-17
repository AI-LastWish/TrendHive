"use client";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

// Define the generic type for the table row data
interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[]; // Replaced `any` with `unknown`
}

const Table = <TData,>({ data, columns }: TableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-gray-50">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border border-gray-300 p-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="hover:bg-gray-100">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="border border-gray-300 p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
