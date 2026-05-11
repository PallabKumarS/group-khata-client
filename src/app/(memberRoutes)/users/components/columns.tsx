"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Shield, ShieldAlert, User, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TUser } from "@/types/user.type";
import { updateUserRole, updateUserStatus, deleteUser } from "@/services/userService";
import { toast } from "sonner";
import { useState } from "react";

// Wrapper component to handle state for actions
const UserActions = ({ user, onUpdate }: { user: TUser, onUpdate: () => void }) => {
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (role: string) => {
    if (!user._id) return;
    setLoading(true);
    const res = await updateUserRole(user._id, role);
    if (res?.success) {
      toast.success("Role updated");
      onUpdate();
    } else {
      toast.error(res?.message || "Failed to update role");
    }
    setLoading(false);
  };

  const handleStatusChange = async (status: string) => {
    if (!user._id) return;
    setLoading(true);
    const res = await updateUserStatus(user._id, status);
    if (res?.success) {
      toast.success("Status updated");
      onUpdate();
    } else {
      toast.error(res?.message || "Failed to update status");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!user._id) return;
    if (!confirm("Are you sure you want to delete this user?")) return;
    setLoading(true);
    const res = await deleteUser(user._id);
    if (res?.success) {
      toast.success("User deleted");
      onUpdate();
    } else {
      toast.error(res?.message || "Failed to delete user");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={user.role}
        onValueChange={handleRoleChange}
        disabled={loading || user.role === "admin"} // Prevent demoting other admins from table easily
      >
        <SelectTrigger className="w-[110px] h-8 text-xs bg-background/50">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="member">Member</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue={user.status}
        onValueChange={handleStatusChange}
        disabled={loading}
      >
        <SelectTrigger className="w-[110px] h-8 text-xs bg-background/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={loading}
        className="w-8 h-8 hover:bg-destructive/10 hover:text-destructive rounded-full"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export const getColumns = (onUpdate: () => void): ColumnDef<TUser>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.getValue("name")}</span>
          <span className="text-xs text-muted-foreground">{row.original.email}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className="flex items-center gap-2">
          {role === "admin" ? (
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          ) : role === "manager" ? (
            <Shield className="w-4 h-4 text-violet-500" />
          ) : (
            <User className="w-4 h-4 text-muted-foreground" />
          )}
          <span className="capitalize font-medium">{role}</span>
        </div>
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
          className={
            status === "active"
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.getValue("createdAt") || new Date()), "PP")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <UserActions user={row.original} onUpdate={onUpdate} />,
  },
];
