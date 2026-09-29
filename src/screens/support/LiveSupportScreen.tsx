import React from "react";
import { Linking } from "react-native";
import { Mail, MessageSquareMore, Phone } from "lucide-react-native";

import { ListRow, StatusScreen } from "../../components/ui";
import { getSupportContact } from "../../services/support";

type Props = {
  t: any;
  onBack: () => void;
};

const openLink = (url: string) => {
  Linking.openURL(url).catch(() => undefined);
};

/** E.164 del numero de WhatsApp de soporte: +1 (773) 263-1785 */
const WHATSAPP_URL = "https://wa.me/17732631785";

/** Soporte en vivo (pantalla 5). */
export default function LiveSupportScreen({ t, onBack }: Props) {
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
        onPress={() => openLink(WHATSAPP_URL)}
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
        subtitle={t.callSupportDesc}
        onPress={() => openLink(`tel:${contact.phone.replace(/[^\d+]/g, "")}`)}
      />
    </StatusScreen>
  );
}
