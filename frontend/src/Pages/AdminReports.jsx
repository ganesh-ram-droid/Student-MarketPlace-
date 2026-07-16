/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContextCore";
import { API_URL } from "../config/api";
import {
  Ban,
  CheckCircle2,
  ChartColumn,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
  Globe
} from "lucide-react";

const AdminReports = () => {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [domains, setDomains] = useState([]);
  const [domainForm, setDomainForm] = useState({ domain: "", label: "" });

  const loadDashboard = useCallback(async () => {
    try {
      const [analyticsRes, usersRes, domainsRes] = await Promise.all([
        fetch(`${API_URL}/admin/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/admin/domains`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const analyticsData = await analyticsRes.json();
      const usersData = await usersRes.json();
      const domainsData = await domainsRes.json();

      if (!analyticsRes.ok || !usersRes.ok || !domainsRes.ok) {
        alert(analyticsData.msg || usersData.msg || domainsData.msg || analyticsData.error || "Unable to load admin dashboard");
        return;
      }

      setAnalytics(analyticsData.stats);
      setUsers(usersData);
      setDomains(domainsData);
    } catch (error) {
      console.log(error);
      alert("Unable to load admin dashboard");
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const blockToggle = async (userId, shouldBlock) => {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/${shouldBlock ? "block" : "unblock"}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }
      loadDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  const addDomain = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/admin/domains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(domainForm)
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }
      setDomainForm({ domain: "", label: "" });
      loadDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  const removeDomain = async (domainId) => {
    try {
      const response = await fetch(`${API_URL}/admin/domains/${domainId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.msg || data.error);
        return;
      }
      loadDashboard();
    } catch (error) {
      console.log(error);
    }
  };

  const stats = [
    { label: "Students", value: analytics?.userCount || 0, icon: Users },
    { label: "Products", value: analytics?.productCount || 0, icon: ChartColumn },
    { label: "Reports", value: analytics?.reportedCount || 0, icon: ShieldAlert },
    { label: "Blocked", value: analytics?.blockedCount || 0, icon: Ban },
    { label: "Reviews", value: analytics?.reviewCount || 0, icon: CheckCircle2 },
    { label: "Wishlists", value: analytics?.totalWishlistEntries || 0, icon: Plus }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="bg-black text-white px-4 sm:px-8 md:px-20 py-10 sm:py-14 rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <p className="text-green-400 font-semibold uppercase tracking-wide mb-3">
            Admin Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
            College Access
            <span className="block text-green-400">Control Center</span>
          </h1>
          <p className="mt-5 text-gray-300 text-base sm:text-lg max-w-2xl">
            Approve email domains, block abusive users, and keep the marketplace college-only.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
                <div className="rounded-2xl bg-green-100 text-green-700 p-3">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{item.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Allowed Domains</h2>
            </div>

            <form onSubmit={addDomain} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input
                type="text"
                value={domainForm.domain}
                onChange={(e) => setDomainForm((prev) => ({ ...prev, domain: e.target.value }))}
                placeholder="nec.edu.in"
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                value={domainForm.label}
                onChange={(e) => setDomainForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="Nandha College"
                className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700"
              >
                <Plus size={18} />
                Add
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {domains.length === 0 ? (
                <p className="text-gray-500">No domains added yet.</p>
              ) : (
                domains.map((domain) => (
                  <div key={domain._id} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{domain.label || domain.domain}</p>
                      <p className="text-sm text-gray-500">{domain.domain}</p>
                    </div>
                    <button
                      onClick={() => removeDomain(domain._id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">User Moderation</h2>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {users.map((user) => (
                <div key={user._id} className="rounded-2xl bg-gray-50 px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">
                      {user.role} {user.isBlocked ? "• Blocked" : ""}
                    </p>
                  </div>

                  {user.role !== "admin" && (
                    <button
                      onClick={() => blockToggle(user._id, !user.isBlocked)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white ${
                        user.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {user.isBlocked ? (
                        <>
                          <CheckCircle2 size={16} />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban size={16} />
                          Block
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
