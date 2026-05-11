/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use client";

import {
  MoreHorizontal,
  Trash2,
  ShieldCheck,
  Ban,
  UserCog,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  deleteUser,
  toggleUserStatus,
  updateUserRole,
} from "@/services/userService";
import ConfirmationBox from "@/components/shared/ConfirmationBox";
import { TUser } from "@/types/user.type";

interface UserActionsProps {
  user: TUser;
  onUpdate: () => void;
}

export function UserActions({ user, onUpdate }: UserActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleToggleStatus = async () => {
    setLoading("status");
    try {
      const res = await toggleUserStatus(user._id);
      if (res.success) {
        toast.success(
          `User ${user.status === "active" ? "blocked" : "activated"} successfully`,
        );
        onUpdate();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error updating user status");
    } finally {
      setLoading(null);
    }
  };

  const handleChangeRole = async (newRole: string) => {
    setLoading("role");
    try {
      const res = await updateUserRole(user._id, newRole);
      if (res.success) {
        toast.success(`Role updated to ${newRole}`);
        onUpdate();
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error updating role");
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    setLoading("delete");
    try {
      const res = await deleteUser(user._id);
      if (res.success) {
        toast.success("User deleted successfully");
        onUpdate();
      } else {
        toast.error(res.message || "Failed to delete user");
      }
    } catch (error: any) {
      toast.error(error?.message || "Error deleting user");
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full hover:bg-violet-600/10"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 p-1 rounded-xl border-border/40 bg-card/95 backdrop-blur-xl shadow-xl"
        >
          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Manage User
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/40" />

          <DropdownMenuItem
            onClick={handleToggleStatus}
            disabled={!!loading}
            className="rounded-lg gap-2 cursor-pointer focus:bg-violet-600/10 focus:text-violet-600"
          >
            {user.status === "active" ? (
              <Ban className="w-4 h-4 text-orange-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            {user.status === "active" ? "Block User" : "Activate User"}
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/40" />

          <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Change Role
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => handleChangeRole("manager")}
            disabled={!!loading || user.role === "manager"}
            className="rounded-lg gap-2 cursor-pointer focus:bg-violet-600/10 focus:text-violet-600"
          >
            <ShieldCheck className="w-4 h-4" /> Make Manager
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleChangeRole("user")}
            disabled={!!loading || user.role === "member"}
            className="rounded-lg gap-2 cursor-pointer focus:bg-violet-600/10 focus:text-violet-600"
          >
            <UserCog className="w-4 h-4" /> Make User
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-border/40" />

          <ConfirmationBox
            description={`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`}
            title="Delete User"
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="rounded-lg gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" /> Delete User
              </DropdownMenuItem>
            }
            onConfirm={handleDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
