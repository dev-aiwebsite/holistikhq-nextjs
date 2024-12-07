"use client"

import * as React from "react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { Copy, MoreHorizontal, Trash, Trash2 } from "lucide-react"

import { Button } from "@app/components/ui/button"
import { Checkbox } from "@app/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import { useAppStateContext } from "@app/context/AppStatusContext"
import { DataTable } from "./DataTable"
import { User } from "prisma/prisma-client"
import { DialogAddUser } from "./dialogs/DialogAddUser"


export function UsersDataTable() {
    const {appState} = useAppStateContext()
    
    const data = appState.users
    
const hasSorting = ['createdAt','role','clinic']
const excludeItem = ['createdAt','updatedAt','id','isAdmin','isDeleted','readNotifications','isLogin','lastLogin','password','profileImage']
const columns = generateColumns({
    data:data[0],
    excluded: excludeItem
})


    return <>
        <DialogAddUser />
        <DataTable data={data} columns={columns} />
    </>
    
}


const generateColumns = ({data,excluded}:{data: Record<string, any>, excluded?:string[]}): ColumnDef<any>[] => {
    // Fixed Checkbox Column

    const selectColumn: ColumnDef<User> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    };
  
    // Fixed Actions Column
    const actionsColumn: ColumnDef<User> = {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original; // Access the row data
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                <Copy /> <span>Copy ID</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash /> <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    };
  
    const dateColumn:ColumnDef<User> = {
        accessorKey: "createdAt",
      header: "CreatedAt", // Capitalize the key for the header
      cell: ({ row }) => {
        const value = row.getValue("createdAt");
  
        if(value && !!value.getDate){
            const formatted = value.toLocaleString()
            return <div>{formatted}</div>;
        }
  
        return <div>{value}</div>;
      },
    }
    // Dynamically create columns based on data keys
    const keys = excluded 
    ? Object.keys(data).filter((key) => !excluded.includes(key)) 
    : Object.keys(data);
    const dynamicColumns: ColumnDef<User>[] = keys.map((key) => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the key for the header
      cell: ({ row }) => {
        const value = row.getValue(key);
  
        // Custom rendering for specific keys (optional)
        if (key === "amount") {
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(parseFloat(value));
          return <div className="text-right font-medium">{formatted}</div>;
        }
        if(value && !!value.getDate){
            const formatted = value.toLocaleString()
            return <div>{formatted}</div>;
        }
  
        return <div>{value}</div>;
      },
    }));
  


    // Combine: Checkbox -> Dynamic Columns -> Actions
    return [selectColumn, ...dynamicColumns, dateColumn, actionsColumn];
  };
  