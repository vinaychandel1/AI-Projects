"use client";

import { useState, useEffect } from "react";

interface Skill {
  id: string;
  canonicalName: string;
  category: string | null;
}

interface UserSkill {
  id: string;
  skillId: string;
  proficiency: string | null;
  years: number | null;
  skill: Skill;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    headline: "",
    bio: "",
    yearsExperience: "",
    city: "",
    remotePreference: "REMOTE",
  });
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiency, setProficiency] = useState("INTERMEDIATE");
  const [years, setYears] = useState("1");
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((res) => res.json()),
      fetch("/api/user-skills").then((res) => res.json()),
      fetch("/api/skills").then((res) => res.json()),
    ])
      .then(([profileData, userSkillsData, allSkillsData]) => {
        if (profileData && profileData.profile) {
          setProfile({
            headline: profileData.profile.headline || "",
            bio: profileData.profile.bio || "",
            yearsExperience: profileData.profile.yearsExperience?.toString() || "",
            city: profileData.profile.city || "",
            remotePreference: profileData.profile.remotePreference?.[0] || "REMOTE",
          });
        }
        if (Array.isArray(userSkillsData)) {
          setUserSkills(userSkillsData);
        }
        if (Array.isArray(allSkillsData)) {
          setAllSkills(allSkillsData);
          if (allSkillsData.length > 0) {
            setSelectedSkillId(allSkillsData[0].id);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;

    try {
      const res = await fetch("/api/user-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: selectedSkillId,
          proficiency,
          years: parseFloat(years),
        }),
      });

      if (res.ok) {
        const newSkill = await res.json();
        const fullSkill = allSkills.find((s) => s.id === selectedSkillId);
        if (fullSkill) {
          setUserSkills([...userSkills, { ...newSkill, skill: fullSkill }]);
        }
        setMessage("Skill added successfully!");
      } else {
        setMessage("Failed to add skill.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred adding skill.");
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const res = await fetch(`/api/user-skills?skillId=${skillId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUserSkills(userSkills.filter((us) => us.skillId !== skillId));
        setMessage("Skill removed successfully!");
      } else {
        setMessage("Failed to remove skill.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred removing skill.");
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">{message}</div>}
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Headline</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={profile.headline}
              onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about your background..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years of Experience</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={profile.yearsExperience}
              onChange={(e) => setProfile({ ...profile, yearsExperience: e.target.value })}
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="e.g. San Francisco"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 py-2 px-4 bg-black text-white rounded font-medium disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">My Skills</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {userSkills.map((us) => (
            <span
              key={us.id}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2 border"
            >
              <strong>{us.skill.canonicalName}</strong> ({us.proficiency}, {us.years} yrs)
              <button
                type="button"
                onClick={() => handleDeleteSkill(us.skillId)}
                className="text-red-500 hover:text-red-700 ml-1 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
          {userSkills.length === 0 && <p className="text-gray-500">No skills added yet.</p>}
        </div>

        <form onSubmit={handleAddSkill} className="flex gap-4 items-end border-t pt-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Add Skill</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
            >
              {allSkills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.canonicalName} {skill.category ? `(${skill.category})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Proficiency</label>
            <select
              className="p-2 border rounded"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Years</label>
            <input
              type="number"
              step="0.5"
              className="w-24 p-2 border rounded"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-black text-white rounded font-medium h-10"
          >
            Add Skill
          </button>
        </form>
      </div>
    </div>
  );
}
