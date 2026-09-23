import { useEffect, useState } from "react";
import { useAdmin } from "../../hooks/useAdminHook";
import { User } from "../../services/adminApi";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  UserCheck,
  UserX,
  Trash2,
  Loader2,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";

export default function UserManagement() {
  const { loading, error, fetchUsers, udpateUserRole, udpateUserStatus, deleteUser } =
    useAdmin();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRole] = useState<string>("");
  const [statusFilter, setStatus] = useState<string>("");

  // Track which user is currently being deleted
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search,400)

  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      const res = await fetchUsers({
        page,
        limit: 10,
        search:debouncedSearch,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      });

      if (!isCancelled && res?.success) {
        setUsers(res.users);
        setTotalPages(res.pagination.totalPages);
        setTotalUsers(res.pagination.total);
      }
    };
    executeFetch();
    return () => {
      isCancelled = true;
    };
  }, [page, debouncedSearch, roleFilter, statusFilter, fetchUsers]);

  const loadUsers = async () => {
    const res = await fetchUsers({
      page,
      limit: 10,
      search,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    });

    if (res?.success) {
      setUsers(res.users);
      setTotalPages(res.pagination.totalPages);
      setTotalUsers(res.pagination.total);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const res = await udpateUserStatus(userId, newStatus);
    if (res?.success) {
      loadUsers();
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "CANDIDATE" | "COMPANY" | "ADMIN"
  ) => {
    console.log("role changeReq to :", newRole);
    const res = await udpateUserRole(userId, newRole);
    if (res?.success) {
      loadUsers();
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName || "this user"}? This action cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(userId);
      const res = await deleteUser(userId);
      if (res?.success || res) {
        // If the deleted user was the last user on the current page, go back 1 page if possible
        if (users.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          loadUsers();
        }
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 bg-[#0B0F19] min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-xs text-slate-400">Total accounts: {totalUsers}</p>
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#111625] p-4 border border-slate-800 rounded-xl">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="CANDIDATE">Candidate</option>
            <option value="COMPANY">Company</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#111625] border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#182032] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-medium text-white">
                        {user.name || "Unnamed User"}
                      </div>
                      <div className="text-slate-400 text-[11px]">{user.email}</div>
                    </td>

                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value as "CANDIDATE" | "COMPANY" | "ADMIN"
                          )
                        }
                        className="bg-[#0B0F19] border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="CANDIDATE">CANDIDATE</option>
                        <option value="COMPANY">COMPANY</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : user.status === "SUSPENDED"
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Suspend / Activate Button */}
                        <button
                          onClick={() => handleStatusChange(user.id, user.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition inline-flex items-center gap-1 ${
                            user.status === "ACTIVE"
                              ? "bg-amber-600/10 border-amber-700/50 text-amber-400 hover:bg-amber-600/20"
                              : "bg-emerald-600/10 border-emerald-700/50 text-emerald-400 hover:bg-emerald-600/20"
                          }`}
                        >
                          {user.status === "ACTIVE" ? (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              Activate
                            </>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name||"")}
                          disabled={deletingId === user.id}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-700/50 bg-red-600/10 text-red-400 hover:bg-red-600/20 transition inline-flex items-center gap-1 disabled:opacity-50"
                          title="Delete User"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t border-slate-800 bg-[#141A29]">
            <span className="text-xs text-slate-400">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages || loading}
                className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg disabled:opacity-40 hover:bg-slate-700 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}