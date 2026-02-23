import Link from "next/link";
import css from "./Header.module.css";
import AuthNavigation from "../AuthNavigation/AuthNavigation";

export default function Header() {
  return (
    <header className={css.header}>
      <nav>
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/notes" className={css.navigationLink}>
              Notes
            </Link>
          </li>

          <AuthNavigation />
        </ul>
      </nav>
    </header>
  );
}