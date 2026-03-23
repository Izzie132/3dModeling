import { useState, useEffect } from 'react';

export default function useAppSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch('/appsettings.json')
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings({ featureFlags: {} }));
  }, []);

  return settings;
}
