"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./UserActions";
import { format } from "date-fns";
import { TUser } from "@/types/user.type";
import Image from "next/image";

export const columns = (onUpdate: () => void): ColumnDef<TUser>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600/10 flex items-center justify-center text-violet-600 font-bold border border-violet-600/20">
            {user.profileImg ? (
              <Image
                src={user.profileImg}
                alt={user.name}
                width={40}
                height={40}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div>
            <p className="font-bold text-foreground leading-none">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize rounded-full font-semibold px-3 border-border/40 ${
            role === "admin"
              ? "bg-red-500/10 text-red-600 border-red-500/20"
              : role === "manager"
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize rounded-full font-semibold px-3 border-border/40 ${
            status === "active"
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : "bg-red-500/10 text-red-600 border-red-500/20"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      return (
        <p className="text-sm text-muted-foreground">
          {date ? format(new Date(date as string), "PPP") : "N/A"}
        </p>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActions user={row.original} onUpdate={onUpdate} />,
  },
];
