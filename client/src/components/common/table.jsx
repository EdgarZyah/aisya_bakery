import React from "react";

const Table = ({ columns, data, renderActions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[var(--color-primary)] text-[var(--color-background)]">
            {columns.map((col) => (
              <th key={col.accessor} className="border border-gray-300 px-4 py-2 text-left">
                {col.header}
              </th>
            ))}
            {renderActions && <th className="border border-gray-300 px-4 py-2">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={renderActions ? columns.length + 1 : columns.length} className="text-center p-4">
                Tidak ada data
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="border border-gray-300 px-4 py-2">
                    {/* Perbaikan di sini: Teruskan 'index' sebagai argumen kedua */}
                    {col.cell ? col.cell(row, index) : row[col.accessor]}
                  </td>
                ))}
                {renderActions && (
                  <td className="border border-gray-300 px-4 py-2">{renderActions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;