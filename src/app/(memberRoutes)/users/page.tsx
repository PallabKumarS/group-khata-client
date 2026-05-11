"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { PageLoader } from "@/components/shared/Loaders";
import Container from "@/components/shared/Container";
import { getAllUsers } from "@/services/userService";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { ShieldCheck } from "lucide-react";
import { TUser } from "@/types/user.type";

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<TUser[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers({ limit: 100 }); // Getting a large batch for client-side pagination
      if (res?.success) {
        setUsers(res.data);
      } else {
        toast.error(res?.message || "Failed to load users");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    fetchUsers();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  const columns = useMemo(() => getColumns(fetchUsers), []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Container className="py-12 text-left min-h-[calc(100vh-8rem)]">
      <div className="mb-10 relative">
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-3xl" />
        <h1 className="text-4xl font-extrabold text-foreground relative z-10 tracking-tight flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-rose-500" />
          Manage{" "}
          <span className="bg-linear-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
            Users
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 text-lg relative z-10 max-w-xl">
          Admin portal. Manage user roles, statuses, and monitor registered
          accounts.
        </p>
      </div>

      <div className="w-full">
        <DataTable columns={columns} data={users} />
      </div>
    </Container>
  );
}
