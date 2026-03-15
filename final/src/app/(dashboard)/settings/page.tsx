// app/(dashboard)/settings/page.tsx
"use client";

import { useState }         from "react";
import { Topbar }           from "@/components/layout/Topbar";
import { Input }            from "@/components/ui/Input";
import { Select }           from "@/components/ui/Select";
import { Button }           from "@/components/ui/Button";
import { Modal }            from "@/components/ui/Modal";
import { toast }            from "@/components/ui/Toaster";
import { MOCK_PROFILE }     from "@/mock-data";
import { TIMEZONE_OPTIONS } from "@/lib/constants";
import { getInitials }      from "@/lib/utils";

type Tab = "profile" | "notifications" | "password" | "danger";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile",       label: "Profile"       },
  { id: "notifications", label: "Notifications" },
  { id: "password",      label: "Password"      },
  { id: "danger",        label: "Danger zone"   },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab]     = useState<Tab>("profile");
  const [isSaving,  setIsSaving]      = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form state
  const [form, setForm] = useState({
    full_name:  MOCK_PROFILE.full_name ?? "",
    company:    MOCK_PROFILE.company   ?? "",
    phone:      MOCK_PROFILE.phone     ?? "",
    timezone:   MOCK_PROFILE.timezone,
    email_notifications: MOCK_PROFILE.email_notifications,
  });

  // Password form state
  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password:     "",
    confirm_password: "",
  });
  const [pwError, setPwError] = useState("");

  function handleFormChange(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSaveProfile() {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // Step 7: await updateProfile(form)
    setIsSaving(false);
    toast.success("Profile updated successfully");
  }

  async function handleChangePassword() {
    setPwError("");
    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("New passwords do not match");
      return;
    }
    if (pwForm.new_password.length < 8) {
      setPwError("Password must be at least 8 characters");
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // Step 7: await updatePassword(pwForm)
    setIsSaving(false);
    setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    toast.success("Password changed successfully");
  }

  async function handleDeleteAccount() {
    // Step 7: await deleteAccount()
    toast.error("Account deletion is disabled in demo mode");
    setShowDeleteModal(false);
  }

  return (
    <>
      <Topbar title="Settings" />

      <main className="flex-1 p-6">
        <div className="max-w-3xl">
          <div className="flex gap-6">

            {/* ── Settings nav ── */}
            <nav className="w-44 shrink-0 space-y-0.5">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-medium"
                      : tab.id === "danger"
                        ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* ── Tab panels ── */}
            <div className="flex-1 min-w-0">

              {/* Profile tab */}
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Profile information
                  </h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-lg font-semibold text-blue-700 dark:text-blue-300">
                      {getInitials(form.full_name || "?")}
                    </div>
                    <Button variant="secondary" size="sm">
                      Change avatar
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      value={form.full_name}
                      onChange={(e) => handleFormChange("full_name", e.target.value)}
                      required
                    />
                    <Input
                      label="Company"
                      value={form.company}
                      onChange={(e) => handleFormChange("company", e.target.value)}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                    />
                    <Select
                      label="Timezone"
                      options={TIMEZONE_OPTIONS}
                      value={form.timezone}
                      onChange={(e) => handleFormChange("timezone", e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      isLoading={isSaving}
                      onClick={handleSaveProfile}
                    >
                      Save changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Notifications tab */}
              {activeTab === "notifications" && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </h2>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-800">
                    {[
                      { key: "email_notifications", label: "Email on order status change", desc: "Receive an email whenever your order moves to a new status." },
                      { key: "notes_notifications", label: "Email when a note is added",   desc: "Get notified when your writer leaves a new note." },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-start justify-between gap-4 px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
                        </div>
                        <button
                          role="switch"
                          aria-checked={form.email_notifications}
                          onClick={() => handleFormChange("email_notifications", !form.email_notifications)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors mt-0.5 ${
                            form.email_notifications
                              ? "bg-gray-900 dark:bg-white"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white dark:bg-gray-900 shadow transition-transform ${
                              form.email_notifications ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="primary" size="md"
                    isLoading={isSaving}
                    onClick={handleSaveProfile}
                  >
                    Save preferences
                  </Button>
                </div>
              )}

              {/* Password tab */}
              {activeTab === "password" && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Change password
                  </h2>
                  <div className="space-y-4 max-w-sm">
                    <Input
                      label="Current password"
                      type="password"
                      value={pwForm.current_password}
                      onChange={(e) => setPwForm((f) => ({ ...f, current_password: e.target.value }))}
                      required
                    />
                    <Input
                      label="New password"
                      type="password"
                      value={pwForm.new_password}
                      helperText="Minimum 8 characters"
                      onChange={(e) => setPwForm((f) => ({ ...f, new_password: e.target.value }))}
                      required
                    />
                    <Input
                      label="Confirm new password"
                      type="password"
                      value={pwForm.confirm_password}
                      error={pwError}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirm_password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button
                    variant="primary" size="md"
                    isLoading={isSaving}
                    onClick={handleChangePassword}
                  >
                    Update password
                  </Button>
                </div>
              )}

              {/* Danger zone tab */}
              {activeTab === "danger" && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Danger zone
                  </h2>
                  <div className="rounded-xl border border-red-200 dark:border-red-900 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Delete account
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Permanently delete your account and all associated orders. This action cannot be undone.
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete my account
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete account confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete account"
        description="This will permanently delete your account, all orders, and all associated data."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
              Yes, delete everything
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          To confirm, type your email address below. This action cannot be reversed.
        </p>
        <Input
          className="mt-3"
          placeholder="your@email.com"
        />
      </Modal>
    </>
  );
}
