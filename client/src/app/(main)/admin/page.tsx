"use client";

import { useEffect, useState } from "react";
import { fetchSystemStats, SystemStats } from "@/lib/api/admin";
import { Users, CheckSquare, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StatCard } from "@/components/ui/profile/statCard";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchSystemStats();
      setStats(data);
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 w-full  p-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your users, tasks, and view system statistics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Total Users"
            value={loading ? "..." : stats?.total_users ?? 0}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Tasks"
            value={loading ? "..." : stats?.total_tasks ?? 0}
            icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Completed Tasks"
            value={loading ? "..." : stats?.total_completed_tasks ?? 0}
            icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 bg-card rounded-xl border flex flex-col gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Search and remove users from the platform.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/users">Manage Users</Link>
            </Button>
          </div>

          <div className="p-6 bg-card rounded-xl border flex flex-col gap-4 items-start">
            <div className="bg-primary/10 p-3 rounded-full">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Task Management</h3>
              <p className="text-sm text-muted-foreground">
                Filter, view and delete learning tasks.
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/tasks">Manage Tasks</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
