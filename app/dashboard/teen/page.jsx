"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TeenDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("browse");
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editSkills, setEditSkills] = useState([]);
  const [editAvailability, setEditAvailability] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

  const SKILLS = ["Babysitting", "Lawn Care", "Tutoring", "Pet Sitting", "Snow Removal", "House Cleaning", "Grocery Help", "Moving Help", "Car Washing", "Dog Walking"];
  const AVAILABILITY = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekend mornings", "Weekend afternoons", "Weekend evenings"];

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [profileRes, jobsRes, appsRes, notifsRes] = await Promise.all([
        getSupabase().from("profiles").select("*").eq("id", user.id).single(),
        getSupabase().from("jobs").select("*, profiles(full_name, employer_type, business_name)").eq("is_active", true).order("created_at", { ascending: false }),
        getSupabase().from("applications").select("*, jobs(title, pay, location)").eq("teen_id", user.id).order("created_at", { ascending: false }),
        getSupabase().from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      // if no profile yet, send to onboarding
      if (!profileRes.data) {
        router.push("/auth/onboarding/teen"); // or /employer for employer dashboard
        return;
      }

      setProfile(profileRes.data);
      setJobs(jobsRes.data || []);
      setApplications(appsRes.data || []);
      setNotifications(notifsRes.data || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleApply() {
    setApplyLoading(true);
    setApplyError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    const { error } = await getSupabase().from("applications").insert({
      job_id: selectedJob.id,
      teen_id: user.id,
      message: applyMessage,
    });
    setApplyLoading(false);
    if (error) {
      setApplyError(error.code === "23505" ? "You already applied to this job." : "Something went wrong.");
      return;
    }
    setApplySuccess(true);
    setApplications((prev) => [...prev, { job_id: selectedJob.id, jobs: { title: selectedJob.title, pay: selectedJob.pay, location: selectedJob.location }, status: "pending", created_at: new Date().toISOString() }]);
  }

  async function handleSaveProfile() {
    setSaveLoading(true);
    const { data: { user } } = await getSupabase().auth.getUser();
    await getSupabase().from("profiles").upsert({
      id: user.id,
      full_name: editName,
      bio: editBio,
      skills: editSkills,
      availability: editAvailability.join(", "),
    });
    setProfile((prev) => ({ ...prev, full_name: editName, bio: editBio, skills: editSkills, availability: editAvailability.join(", ") }));
    setSaveLoading(false);
    setEditMode(false);
  }

  async function markNotifsRead() {
    const unread = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unread.length === 0) return;
    await getSupabase().from("notifications").update({ is_read: true }).in("id", unread);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }

  const filteredJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.location.toLowerCase().includes(search.toLowerCase()) ||
    j.job_type.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-24">
      {/* header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <span className="text-lg font-bold text-gray-900">
          catalyst<span className="text-[#C8FF00]">.</span>
        </span>
        <span className="text-sm text-gray-500">
          Hey, <span className="font-semibold text-gray-900">{profile?.full_name?.split(" ")[0]}</span> 👋
        </span>
      </div>

      {/* BROWSE TAB */}
      {activeTab === "browse" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <input
            type="text"
            placeholder="Search jobs, types, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition bg-white"
          />

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No jobs found.</div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => { setSelectedJob(job); setApplySuccess(false); setApplyError(""); setApplyMessage(""); }}
                className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 cursor-pointer hover:border-black transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      {job.is_urgent && (
                        <span className="bg-[#C8FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">⚡ Urgent</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {job.profiles?.business_name || job.profiles?.full_name} · {job.location}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 shrink-0">{job.pay}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.job_type}</span>
                  {job.hours && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.hours}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* APPLIED TAB */}
      {activeTab === "applied" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <h2 className="text-lg font-bold text-gray-900">Your Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No applications yet. Browse jobs to get started.</div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{app.jobs?.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    app.status === "accepted" ? "bg-[#C8FF00] text-black" :
                    app.status === "rejected" ? "bg-red-100 text-red-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{app.jobs?.location} · {app.jobs?.pay}</p>
                <p className="text-xs text-gray-400">Applied {new Date(app.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === "notifications" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <button onClick={markNotifsRead} className="text-xs text-gray-400 hover:text-gray-600 transition">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No notifications yet.</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={`bg-white rounded-2xl border p-4 flex gap-3 ${n.is_read ? "border-gray-200" : "border-black"}`}>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#C8FF00] mt-1.5 shrink-0" />}
                <p className="text-sm text-gray-700">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === "profile" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Profile</h2>
            {!editMode && (
              <button
                onClick={() => {
                  setEditName(profile?.full_name || "");
                  setEditBio(profile?.bio || "");
                  setEditSkills(profile?.skills || []);
                  setEditAvailability(profile?.availability ? profile.availability.split(", ") : []);
                  setEditMode(true);
                }}
                className="text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition"
              >
                Edit
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-xl font-bold">
                  {profile?.full_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profile?.full_name}</p>
                  <p className="text-xs text-gray-400">Age {profile?.age} · Teen</p>
                </div>
              </div>
              {profile?.bio && <p className="text-sm text-gray-600">{profile.bio}</p>}
              {profile?.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((s) => (
                      <span key={s} className="text-xs bg-[#C8FF00] text-black font-medium px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile?.availability && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Availability</p>
                  <p className="text-sm text-gray-600">{profile.availability}</p>
                </div>
              )}
              <button
                onClick={async () => { await getSupabase().auth.signOut(); router.push("/"); }}
                className="mt-2 text-xs text-red-400 hover:text-red-600 transition text-left"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Full name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Bio</label>
                <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button key={skill} onClick={() => setEditSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${editSkills.includes(skill) ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200"}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Availability</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABILITY.map((slot) => (
                    <button key={slot} onClick={() => setEditAvailability((prev) => prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot])}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${editAvailability.includes(slot) ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200"}`}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditMode(false)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button onClick={handleSaveProfile} disabled={saveLoading} className="flex-1 bg-black text-[#C8FF00] py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
                  {saveLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* JOB DETAIL MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                  {selectedJob.is_urgent && <span className="bg-[#C8FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">⚡ Urgent</span>}
                </div>
                <p className="text-sm text-gray-400 mt-0.5">{selectedJob.profiles?.business_name || selectedJob.profiles?.full_name} · {selectedJob.location}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-bold text-gray-900 bg-[#C8FF00] px-3 py-1 rounded-full">{selectedJob.pay}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selectedJob.job_type}</span>
              {selectedJob.hours && <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{selectedJob.hours}</span>}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{selectedJob.description}</p>

            {applySuccess ? (
              <div className="bg-[#C8FF00] text-black text-sm font-semibold px-4 py-3 rounded-xl text-center">
                Applied successfully!
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Message to employer <span className="text-gray-400">(optional)</span></label>
                  <textarea
                    placeholder="Introduce yourself, mention relevant experience..."
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none"
                  />
                </div>
                {applyError && <p className="text-xs text-red-500">{applyError}</p>}
                <button
                  onClick={handleApply}
                  disabled={applyLoading}
                  className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {applyLoading ? "Applying..." : "Apply now"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM TAB BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 z-40">
        <button onClick={() => setActiveTab("browse")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "browse" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-xs font-medium">Browse</span>
        </button>
        <button onClick={() => setActiveTab("applied")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "applied" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span className="text-xs font-medium">Applied</span>
        </button>
        <button onClick={() => { setActiveTab("notifications"); markNotifsRead(); }} className={`flex flex-col items-center gap-1 px-4 transition relative ${activeTab === "notifications" ? "text-black" : "text-gray-400"}`}>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8FF00] text-black text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
          )}
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span className="text-xs font-medium">Alerts</span>
        </button>
        <button onClick={() => setActiveTab("profile")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "profile" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </main>
  );
}