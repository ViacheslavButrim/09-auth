import css from "./ProfilePage.module.css";
import { getMe } from "@/lib/api/serverApi";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Profile",
  description: "User profile page",
};

export default async function ProfilePage() {
  let user = null;

  try {
    user = await getMe();
  } catch (err) {
    console.error("Failed to fetch user:", err);
    user = null; // fallback
  }

  if (!user) {
    return (
      <main className={css.mainContent}>
        <p>User not found. Please log in.</p>
        <Link href="/sign-in">Sign In</Link>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar ?? "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username ?? "Unknown"}</p>
          <p>Email: {user.email ?? "Unknown"}</p>
        </div>
      </div>
    </main>
  );
}
