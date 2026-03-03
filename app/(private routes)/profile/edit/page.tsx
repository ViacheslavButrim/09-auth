"use client";

import css from "./EditProfilePage.module.css";
import { updateMe, updateAvatar } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AvatarPicker from "@/components/AvatarPicker/AvatarPicker";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [username, setUsername] = useState(user?.username ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (!user) return null;

  const handleAvatarSelect = (file: File | null) => {
    setAvatarFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let updatedUser = user;

      if (avatarFile) {
        updatedUser = await updateAvatar(avatarFile);
      }

      const profileUpdated = await updateMe({ username });
      setUser({ ...updatedUser, ...profileUpdated });

      router.push("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Error updating profile");
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar ?? "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <AvatarPicker
          profilePhotoUrl={user.avatar ?? ""}
          onFileSelect={handleAvatarSelect}
        />

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email ?? "Unknown"}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
