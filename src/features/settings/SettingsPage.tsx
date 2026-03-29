import { useAppState } from '../../app/state';

export function SettingsPage() {
  const { theme, toggleTheme } = useAppState();
  return (
    <div>
      <h1>Settings</h1>
      <p>Theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Light / Dark</button>
    </div>
  );
}
