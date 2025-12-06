import React from "react";

interface Column<T> {
  label: string;
  key: keyof T | string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  items: T[];
  columns: Column<T>[];
}

export default function Table<T>({ items, columns }: TableProps<T>) {
  return (
    <table className="w-full table-auto border border-gray-300 divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className="px-4 py-2 text-left text-sm font-medium text-gray-700"
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50 transition cursor-pointer">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="px-4 py-2">
                {col.render ? col.render(row, rowIndex) : (row as any)[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
