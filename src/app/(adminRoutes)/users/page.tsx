"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAllUsers } from "@/services/userService";
import { UsersTable } from "./components/UsersTable";
import { columns } from "./components/columns";
import Container from "@/components/shared/Container";
import { TUser } from "@/types/user.type";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error(res.message || "Failed to fetch users");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-violet-600/10 text-violet-600">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            User Management
          </h1>
        </div>
        <p className="text-muted-foreground ml-14">
          View and manage all registered users, their roles, and account
          statuses.
        </p>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            <p className="text-muted-foreground font-medium animate-pulse">
              Loading users...
            </p>
          </div>
        ) : (
          <UsersTable
            columns={columns(fetchUsers)}
            data={users}
            searchKey="name"
          />
        )}
      </div>
    </Container>
  );
}
