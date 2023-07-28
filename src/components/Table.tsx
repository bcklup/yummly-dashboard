import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  InitialTableState,
  OnChangeFn,
  SortingState,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

import { twMerge } from "tailwind-merge";

export interface TableProps<T> {
  data: Array<T>;
  columnDef: ColumnDef<T, any>[];
  responsive?: boolean;
}

export default function Table<T>({
  data,
  columnDef,
  responsive = true,
}: TableProps<T>) {
  const tableOptions: TableOptions<T> = {
    data,
    columns: columnDef,
    enableHiding: true,
    getCoreRowModel: getCoreRowModel(),
  };

  const table = useReactTable(tableOptions);

  return (
    <div className="relative mt-3 w-full overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      {/* Mobile View */}
      {responsive && (
        <div className="w-full border-collapse sm:hidden">
          {table.getRowModel().rows.map((row) => {
            const rowAction = row
              .getVisibleCells()
              .find(
                (cellData) =>
                  cellData.column.id === "actions" ||
                  cellData.column.id === "details"
              );

            return (
              <div
                key={row.id}
                className="flex w-full flex-col border-b bg-white p-3 hover:bg-primary-100"
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <div key={headerGroup.id} className="flex flex-col">
                    {headerGroup.headers.map((header) => {
                      const visibleCells = row.getVisibleCells();
                      const cellItem = visibleCells.find((cellData) => {
                        if (
                          cellData.column.id.includes("actions") ||
                          cellData.column.id === "details"
                        ) {
                          return false;
                        }

                        return cellData.column.id === header.id;
                      });

                      return (
                        <div key={header.id} className="grid grid-cols-2 gap-1">
                          <p className="px-1 py-2 text-left text-neutral-400">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </p>

                          <span className="px-1 py-2 text-justify text-neutral-900">
                            {cellItem &&
                              flexRender(
                                cellItem?.column.columnDef.cell,
                                cellItem?.getContext()
                              )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}

                {rowAction && (
                  <div className="flex w-full items-center justify-center p-3">
                    {flexRender(
                      rowAction.column.columnDef.cell,
                      rowAction.getContext()
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop View */}
      <table
        className={twMerge(
          "w-full table-auto border-collapse ",
          responsive ? "hidden sm:table" : "table"
        )}
      >
        <thead className="bg-primary text-xs uppercase text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className={twMerge("border-b border-neutral-50")}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={twMerge(
                    "p-3",
                    header.id.includes("actions") &&
                      "border-l border-neutral-50"
                  )}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex h-full w-full items-center justify-between gap-x-3 ">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {data?.length >= 1 &&
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b bg-white hover:bg-primary-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={twMerge(
                      "p-3 text-sm text-neutral-900",
                      cell.column.id.includes("actions") &&
                        "border-l border-neutral-50"
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {(data?.length <= 0 || !data) && (
        <div className="grid grid-cols-1 items-center justify-center p-4">
          <p className="text-center text-sm font-bold text-neutral-900">
            No data available.
          </p>
        </div>
      )}
    </div>
  );
}
