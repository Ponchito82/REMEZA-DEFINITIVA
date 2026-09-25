import React from "react";
import { Linking } from "react-native";
import { Mail, MessageSquareMore, Phone } from "lucide-react-native";

import { ListRow, StatusScreen } from "../../components/ui";
import { getSupportContact } from "../../services/support";

type Props = {
  t: any;
  onBack: () => void;
  onOpenChat: () => void;
};

const openLink = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

/** Soporte en vivo (pantalla 5). */
export default function LiveSupportScreen({ t, onBack, onOpenChat }: Props) {
  const contact = getSupportContact();

  return (
    <StatusScreen
      testID="liveSupport"
      showBack
      onBack={onBack}
      backTestID="liveSupport.backButton"
      backAccessibilityLabel={t.back}
      icon={MessageSquareMore}
      title={t.liveSupportTitle}
      subtitle={t.liveSupportSubtitle}
    >
      <ListRow
        testID="liveSupport.chatRow"
        icon={MessageSquareMore}
        title={t.liveChat}
        subtitle={t.liveChatDesc}
        onPress={onOpenChat}
      />
      <ListRow
        testID="liveSupport.ticketRow"
        icon={Mail}
        title={t.sendTicket}
        subtitle={t.sendTicketDesc}
        onPress={() => openLink(`mailto:${contact.email}`)}
      />
      <ListRow
        testID="liveSupport.callRow"
        icon={Phone}
        title={t.callSupport}
        subtitle={contact.phone}
        onPress={() => openLink(`tel:${contact.phone.replace(/[^\d+]/g, "")}`)}
      />
    </StatusScreen>
  );
}
