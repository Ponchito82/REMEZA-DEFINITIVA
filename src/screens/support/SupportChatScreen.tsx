import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { MessageSquareText } from "lucide-react-native";

import {
  ChatBubble,
  ChatComposer,
  ScreenHeader,
  ScreenLayout,
} from "../../components/ui";
import { ChatMessage } from "../../mocks/remeza";
import { getChatHistory, getSupportContact, sendChatMessage } from "../../services/support";
import { formatTime } from "../../utils/date";
import { spacing } from "../../theme/spacing";
import { Language } from "../../types/app";

type Props = {
  t: any;
  language: Language;
  onBack: () => void;
};

/** Chat con soporte (pantalla 16). */
export default function SupportChatScreen({ t, language, onBack }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const agentName = getSupportContact().agentName;

  useEffect(() => {
    let alive = true;
    getChatHistory().then((history) => {
      if (alive) setMessages(history);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(id);
  }, [messages.length]);

  const handleSend = async (text: string) => {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: "me", text, at: Date.now() }]);
    const reply = await sendChatMessage(text);
    setMessages((prev) => [...prev, reply]);
  };

  return (
    <ScreenLayout
      keyboard
      showBack
      onBack={onBack}
      backTestID="supportChat.backButton"
      backAccessibilityLabel={t.back}
      scrollRef={scrollRef}
      footer={
        <ChatComposer
          testID="supportChat.composer"
          placeholder={t.chatPlaceholder}
          sendAccessibilityLabel={t.chatSend}
          onSend={handleSend}
        />
      }
    >
      <ScreenHeader
        icon={MessageSquareText}
        title={t.supportChatTitle}
        subtitle={t.supportChatSubtitle}
        style={styles.header}
      />

      <View style={styles.messages}>
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            from={message.from}
            agentName={agentName}
            text={message.textKey ? t[message.textKey] : message.text ?? ""}
            time={formatTime(message.at, language)}
          />
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.lg,
  },
  messages: {
    gap: spacing.lg,
  },
});
