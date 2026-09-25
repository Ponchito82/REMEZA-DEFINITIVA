import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react-native";

import { ListRow, StatusScreen } from "../components/ui";
import { MOCK_NOTIFICATION_PREFERENCES, NotificationPreferences } from "../mocks/remeza";
import {
  getNotificationPreferences,
  saveNotificationPreferences,
} from "../services/securitySettings";

type Props = {
  t: any;
  onExit: () => void;
};

const KEYS: (keyof NotificationPreferences)[] = ["transactions", "security"];

/** Notificaciones (pantalla 12): solo transacciones y seguridad. */
export default function NotificationSettingsScreen({ t, onExit }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(MOCK_NOTIFICATION_PREFERENCES);

  useEffect(() => {
    let alive = true;
    getNotificationPreferences().then((stored) => {
      if (alive) setPrefs(stored);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Sin boton de continuar: cada cambio se guarda al momento.
  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    saveNotificationPreferences(next);
  };

  return (
    <StatusScreen
      testID="notificationSettings"
      showBack
      onBack={onExit}
      backTestID="notificationSettings.backButton"
      backAccessibilityLabel={t.back}
      icon={Bell}
      title={t.notificationsTitle}
      subtitle={t.notificationsSubtitle}
    >
      {KEYS.map((key) => (
        <ListRow
          key={key}
          testID={`notificationSettings.${key}`}
          icon={Bell}
          title={t[`notif_${key}`]}
          subtitle={t[`notif_${key}Desc`]}
          right="toggle"
          selected={prefs[key]}
          onToggle={(value) => handleToggle(key, value)}
        />
      ))}
    </StatusScreen>
  );
}
