import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col p-4">
      <div className="text-xl font-bold mb-8">SkillMatch</div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="p-2 rounded hover:bg-gray-100">
          Dashboard
        </Link>
        <Link href="/profile" className="p-2 rounded hover:bg-gray-100">
          My Profile
        </Link>
        <Link href="/jobs" className="p-2 rounded hover:bg-gray-100">
          Find Jobs
        </Link>
      </nav>
    </aside>
  );
}
