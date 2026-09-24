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

const KEYS: (keyof NotificationPreferences)[] = ["transactions", "security", "promotions", "reminders"];

/** Notificaciones (pantalla 12). */
export default function NotificationSettingsScreen({ t, onExit }: Props) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(MOCK_NOTIFICATION_PREFERENCES);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    getNotificationPreferences().then((stored) => {
      if (alive) setPrefs(stored);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleContinue = async () => {
    setSaving(true);
    await saveNotificationPreferences(prefs);
    setSaving(false);
    onExit();
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
      primary={{
        testID: "notificationSettings.continueButton",
        title: t.commonContinue,
        showArrow: true,
        loading: saving,
        onPress: handleContinue,
      }}
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
          onToggle={(value) => setPrefs((prev) => ({ ...prev, [key]: value }))}
        />
      ))}
    </StatusScreen>
  );
}
