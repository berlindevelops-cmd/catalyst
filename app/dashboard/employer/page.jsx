"use client";
import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const JOB_TYPES = ["Babysitting", "Lawn Care", "Tutoring", "Pet Sitting", "Snow Removal", "House Cleaning", "Grocery Help", "Moving Help", "Car Washing", "Dog Walking", "Other"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("listings");
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // post job form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [hours, setHours] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  // profile edit
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBusiness, setEditBusiness] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await getSupabase().auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const [profileRes, jobsRes] = await Promise.all([
        getSupabase().from("profiles").select("*").eq("id", user.id).maybesingle(),
        getSupabase().from("jobs").select("*").eq("employer_id", user.id).order("created_at", { ascending: false }),
      ]);

      if (!profileRes.data) { router.push("/auth/onboarding/employer"); return; }

      setProfile(profileRes.data);
      setJobs(jobsRes.data || []);

      if (profileRes.data?.location) setLocation(profileRes.data.location);

      if (jobsRes.data?.length > 0) {
        const jobIds = jobsRes.data.map((j) => j.id);
        const { data: appsData } = await getSupabase()
          .from("applications")
          .select("*, profiles(full_name, age, bio, skills, availability)")
          .in("job_id", jobIds)
          .order("created_at", { ascending: false });
        setApplications(appsData || []);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handlePostJob() {
    if (!title || !description || !pay || !location || !jobType) {
      setPostError("Please fill in all required fields.");
      return;
    }
    setPostLoading(true);
    setPostError("");
    const { data: { user } } = await getSupabase().auth.getUser();
    const { data, error } = await getSupabase().from("jobs").insert({
      employer_id: user.id,
      title,
      description,
      pay,
      location,
      job_type: jobType,
      hours,
      is_urgent: isUrgent,
    }).select().maybesingle();
    setPostLoading(false);
    if (error) { setPostError("Something went wrong."); return; }
    setJobs((prev) => [data, ...prev]);
    setPostSuccess(true);
    setTitle(""); setDescription(""); setPay(""); setJobType(""); setHours(""); setIsUrgent(false);
    setTimeout(() => { setPostSuccess(false); setActiveTab("listings"); }, 1500);
  }

  async function handleToggleJob(jobId, currentStatus) {
    await getSupabase().from("jobs").update({ is_active: !currentStatus }).eq("id", jobId);
    setJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, is_active: !currentStatus } : j));
  }

  async function handleDeleteJob(jobId) {
    await getSupabase().from("jobs").delete().eq("id", jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    setSelectedJob(null);
  }

  async function handleUpdateApplicationStatus(appId, status) {
    await getSupabase().from("applications").update({ status }).eq("id", appId);
    setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
  }

  async function handleSaveProfile() {
    setSaveLoading(true);
    const { data: { user } } = await getSupabase().auth.getUser();
    await getSupabase().from("profiles").upsert({
      id: user.id,
      full_name: editName,
      business_name: editBusiness,
      location: editLocation,
    });
    setProfile((prev) => ({ ...prev, full_name: editName, business_name: editBusiness, location: editLocation }));
    setSaveLoading(false);
    setEditMode(false);
  }

  const jobApplicants = (jobId) => applications.filter((a) => a.job_id === jobId);

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
          <span className="font-semibold text-gray-900">{profile?.business_name || profile?.full_name}</span>
        </span>
      </div>

      {/* LISTINGS TAB */}
      {activeTab === "listings" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Your Listings</h2>
            <button
              onClick={() => setActiveTab("post")}
              className="bg-black text-[#C8FF00] text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-900 transition"
            >
              + Post job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <span className="text-4xl">📋</span>
              <p className="text-gray-400 text-sm">No jobs posted yet.</p>
              <button onClick={() => setActiveTab("post")} className="bg-black text-[#C8FF00] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-900 transition">
                Post your first job
              </button>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      {job.is_urgent && <span className="bg-[#C8FF00] text-black text-xs font-bold px-2 py-0.5 rounded-full">⚡</span>}
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${job.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {job.is_active ? "Active" : "Paused"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{job.location} · {job.pay}</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 bg-[#C8FF00] px-2 py-0.5 rounded-full text-xs">
                    {jobApplicants(job.id).length} applicants
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 border border-gray-200 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition"
                  >
                    View applicants
                  </button>
                  <button
                    onClick={() => handleToggleJob(job.id, job.is_active)}
                    className="flex-1 border border-gray-200 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition"
                  >
                    {job.is_active ? "Pause" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="border border-red-100 text-red-400 text-sm font-medium px-3 py-2 rounded-xl hover:bg-red-50 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* POST JOB TAB */}
      {activeTab === "post" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <h2 className="text-lg font-bold text-gray-900">Post a Job</h2>

          {postSuccess ? (
            <div className="bg-[#C8FF00] text-black text-sm font-semibold px-4 py-4 rounded-2xl text-center">
              Job posted successfully!
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Job title *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Weekend babysitter needed"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Job type *</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => (
                    <button key={type} onClick={() => setJobType(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${jobType === type ? "bg-black text-[#C8FF00] border-black" : "bg-white text-gray-600 border-gray-200"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the job, what you need, any requirements..."
                  rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition resize-none" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Pay *</label>
                  <input value={pay} onChange={(e) => setPay(e.target.value)} placeholder="e.g. $20/hr"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Hours</label>
                  <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="e.g. 3-4 hrs"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location *</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Plymouth, IN"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
              </div>
              <button
                onClick={() => setIsUrgent((prev) => !prev)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition ${isUrgent ? "border-black bg-black text-white" : "border-gray-200"}`}
              >
                <span className="text-lg">⚡</span>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${isUrgent ? "text-[#C8FF00]" : "text-gray-900"}`}>Urgent Hire — $5</p>
                  <p className={`text-xs ${isUrgent ? "text-gray-300" : "text-gray-400"}`}>Pin to top of results for 48 hours</p>
                </div>
                {isUrgent && <span className="ml-auto text-[#C8FF00]">✓</span>}
              </button>

              {postError && <p className="text-xs text-red-500">{postError}</p>}

              <button onClick={handlePostJob} disabled={postLoading}
                className="w-full bg-black text-[#C8FF00] py-3 rounded-xl text-sm font-semibold hover:bg-gray-900 transition disabled:opacity-50">
                {postLoading ? "Posting..." : "Post job"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="flex flex-col gap-4 px-4 py-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Account</h2>
            {!editMode && (
              <button onClick={() => { setEditName(profile?.full_name || ""); setEditBusiness(profile?.business_name || ""); setEditLocation(profile?.location || ""); setEditMode(true); }}
                className="text-xs font-semibold border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition">
                Edit
              </button>
            )}
          </div>

          {!editMode ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-black text-[#C8FF00] flex items-center justify-center text-xl font-bold">
                  {(profile?.business_name || profile?.full_name)?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profile?.business_name || profile?.full_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{profile?.employer_type} · {profile?.location}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400">Name</span>
                  <span className="font-medium">{profile?.full_name}</span>
                </div>
                {profile?.business_name && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-400">Business</span>
                    <span className="font-medium">{profile.business_name}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-400">Type</span>
                  <span className="font-medium capitalize">{profile?.employer_type}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Location</span>
                  <span className="font-medium">{profile?.location}</span>
                </div>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Active listings</p>
                    <p className="text-xs text-gray-400">{jobs.filter((j) => j.is_active).length} of {jobs.length} jobs active</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{jobs.filter((j) => j.is_active).length}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Total applicants</p>
                    <p className="text-xs text-gray-400">Across all your jobs</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{applications.length}</span>
                </div>
              </div>
              <button onClick={async () => { await getSupabase().auth.signOut(); router.push("/"); }}
                className="text-xs text-red-400 hover:text-red-600 transition text-left">
                Sign out
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Your name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
              </div>
              {profile?.employer_type === "business" && (
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1.5 block">Business name</label>
                  <input value={editBusiness} onChange={(e) => setEditBusiness(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">Location</label>
                <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-black transition" />
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

      {/* APPLICANTS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setSelectedJob(null)}>
          <div className="bg-white rounded-t-3xl w-full p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-sm text-gray-400">{jobApplicants(selectedJob.id).length} applicants</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            {jobApplicants(selectedJob.id).length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No applicants yet.</p>
            ) : (
              jobApplicants(selectedJob.id).map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black text-[#C8FF00] flex items-center justify-center font-bold text-sm">
                        {app.profiles?.full_name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{app.profiles?.full_name}</p>
                        <p className="text-xs text-gray-400">Age {app.profiles?.age}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                      app.status === "accepted" ? "bg-[#C8FF00] text-black" :
                      app.status === "rejected" ? "bg-red-100 text-red-600" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                  {app.profiles?.bio && <p className="text-xs text-gray-500">{app.profiles.bio}</p>}
                  {app.profiles?.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {app.profiles.skills.map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  {app.message && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 italic">"{app.message}"</p>
                    </div>
                  )}
                  {app.status === "pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateApplicationStatus(app.id, "accepted")}
                        className="flex-1 bg-[#C8FF00] text-black text-xs font-semibold py-2 rounded-xl hover:bg-lime-300 transition">
                        Accept
                      </button>
                      <button onClick={() => handleUpdateApplicationStatus(app.id, "rejected")}
                        className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-xl hover:bg-gray-50 transition">
                        Pass
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* BOTTOM TAB BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-3 z-40">
        <button onClick={() => setActiveTab("listings")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "listings" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <span className="text-xs font-medium">Listings</span>
        </button>
        <button onClick={() => setActiveTab("post")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "post" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>
          </svg>
          <span className="text-xs font-medium">Post</span>
        </button>
        <button onClick={() => setActiveTab("settings")} className={`flex flex-col items-center gap-1 px-4 transition ${activeTab === "settings" ? "text-black" : "text-gray-400"}`}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span className="text-xs font-medium">Account</span>
        </button>
      </div>
    </main>
  );
}