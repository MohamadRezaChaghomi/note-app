import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="flex justify-between p-4 border-b">
      <span>📝 Notes</span>
      <ThemeToggle />
    </header>
  );
}
