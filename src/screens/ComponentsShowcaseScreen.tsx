import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import {
  Phone,
  Lock,
  Mail,
  MapPin,
  Globe,
  Check,
  User,
  DollarSign,
  Plus,
  ShieldAlert,
  ShieldCheck,
  MessageSquareWarning,
  FileX2,
  Clock,
  Smartphone,
  Calendar,
} from "lucide-react-native";

import {
  Badge,
  Button,
  ChipGroup,
  CloseButton,
  CountdownText,
  FlagIcon,
  FieldLabel,
  GlassCard,
  IconCircle,
  LinkText,
  LogoTile,
  OtpInput,
  PinDotsInput,
  ScreenHeader,
  SelectField,
  StepProgress,
  TextField,
} from "../components/ui";

import {
  ActivityItem,
  AvailableBalanceCard,
  AvatarPicker,
  BalanceHeader,
  BeneficiaryItem,
  CardCarousel,
  CredentialsSummaryCard,
  ToggleRow,
  TransactionItem,
  UploadDocumentCard,
  ListItemCard,
  CurrencyAccountCard,
  InfoDetailsCard,
} from "../components/remeza";

import PhoneField from "../components/PhoneField";
import type { CountryCode } from "../services/geo";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing, screenPadding } from "../theme/spacing";

type SectionProps = { title: string; children: React.ReactNode };

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={[typography.h2, styles.sectionTitle]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const DAY_OPTIONS = Array.from({ length: 9 }, (_, index) => ({
  label: String(index + 1),
  value: String(index + 1),
}));

/**
 * Catalogo de la libreria de componentes. Solo se monta en `__DEV__`: sirve
 * para revisar estados uno al lado del otro sin tener que navegar la app.
 */
export default function ComponentsShowcaseScreen({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [secret, setSecret] = useState("");
  const [day, setDay] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpLarge, setOtpLarge] = useState(["4", "7", "2", "9", "1", "6"]);
  const [pin, setPin] = useState("");
  const [chip, setChip] = useState("all");
  const [showData, setShowData] = useState(false);
  const [beneficiary, setBeneficiary] = useState("1");
  const [listChoice, setListChoice] = useState("report");

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topBar}>
        <Text style={typography.h1}>Showcase</Text>
        <CloseButton onPress={onClose} testID="showcase-closeButton" />
      </View>

      <Section title="Logo y encabezados">
        <LogoTile />
        <ScreenHeader title="Welcome" subtitle="Sign in to your U.S. Latino account" align="center" />
        <ScreenHeader title="Recover access code" subtitle="Enter your phone number." />
      </Section>

      <Section title="StepProgress">
        <StepProgress current={1} />
        <StepProgress current={3} />
        <StepProgress current={4} partial={0.45} />
      </Section>

      <Section title="Button">
        <Button title="Next" onPress={() => {}} variant="primary" />
        <Button title="Get Started" onPress={() => {}} variant="gradient" />
        <Button title="Sign In" onPress={() => {}} variant="ghost" />
        <Button title="Send Transfer" onPress={() => {}} disabled />
        <Button title="Loading" onPress={() => {}} loading />
        <Button title="Save Changes" onPress={() => {}} radius="pill" />
      </Section>

      <Section title="Campos">
        <FieldLabel>Phone number</FieldLabel>
        <TextField placeholder="Ex. +52 55 1234 5678" value={text} onChangeText={setText} leftIcon={Phone} />
        <TextField label="Access code" placeholder="6 digits" value={secret} onChangeText={setSecret} leftIcon={Lock} secureTextEntry maxLength={6} />
        <TextField placeholder="Phone number" value={text} onChangeText={setText} leftIcon={Phone} shape="pill" />
        <TextField label="Exchange rate" value="1 USD = $17.25 MXN" editable={false} leftIcon={DollarSign} />
        <TextField label="State" placeholder="Select a state" value="" onChangeText={() => {}} helperText="Enter a valid postal code first." />
        <TextField label="Email" placeholder="Ex. maria@example.com" value="nope" onChangeText={() => {}} leftIcon={Mail} error="Enter a valid email address." />
        <SelectField label="Day" placeholder="Day" value={day} options={DAY_OPTIONS} onSelect={setDay} />
        <SelectField label="Country" placeholder="Select a country" options={[]} onSelect={() => {}} leftIcon={Globe} disabled helperText="Pick a postal code first." />
        <PhoneField
          t={{ selectCountry: "Country", phoneNumber: "Phone number" }}
          language="en"
          label="Complete phone number"
          country={countryCode}
          onCountryChange={setCountryCode}
          digits={phone}
          onDigitsChange={setPhone}
        />
      </Section>

      <Section title="Codigos">
        <OtpInput value={otp} onChange={setOtp} testID="showcase-otpInput" />
        <PinDotsInput value={pin} onChangeText={setPin} testID="showcase-pinInput" />
      </Section>

      <Section title="Chips y badges">
        <ChipGroup
          options={[
            { label: "All", value: "all" },
            { label: "Virtual", value: "virtual" },
            { label: "Physical", value: "physical" },
            { label: "Remittance", value: "remittance" },
            { label: "Trading", value: "trading" },
          ]}
          value={chip}
          onChange={setChip}
        />
        <View style={styles.row}>
          <Badge label="Virtual" variant="virtual" />
          <Badge label="Physical" variant="physical" />
          <Badge label="Remittance" variant="remittance" />
          <Badge label="Trading" variant="trading" />
        </View>
      </Section>

      <Section title="Cards, circulos y links">
        <GlassCard>
          <Text style={typography.bodyStrong}>GlassCard md</Text>
        </GlassCard>
        <GlassCard size="lg">
          <Text style={typography.bodyStrong}>GlassCard lg</Text>
        </GlassCard>
        <View style={styles.row}>
          <IconCircle icon={Check} size={88} glow color={colors.text.primary} background={colors.primary} />
          <IconCircle icon={Lock} size={64} />
          <IconCircle icon={User} size={48} />
          <IconCircle icon={MapPin} size={36} />
        </View>
        <View style={styles.row}>
          <LinkText onPress={() => {}}>Paste code</LinkText>
          <LinkText onPress={() => {}} tone="plain">Sign up</LinkText>
          <LinkText onPress={() => {}} disabled>Disabled</LinkText>
          <LinkText onPress={() => {}} tone="magenta">Contactar soporte</LinkText>
        </View>
      </Section>

      <Section title="Seguridad (fase 1)">
        <View style={styles.row}>
          <CloseButton onPress={() => {}} icon="chevron" />
          <CloseButton onPress={() => {}} icon="arrow" />
          <CloseButton onPress={() => {}} />
          <IconCircle icon={Globe} size={96} hero glow />
          <IconCircle icon={ShieldAlert} size={96} hero glow filled />
          <FlagIcon country="US" />
          <FlagIcon country="MX" />
        </View>
        <ScreenHeader title="Alerta de seguridad" subtitle="Hemos detectado un inicio de sesión en un dispositivo no reconocido." align="center" size="hero" />
        <ScreenHeader title="¿Fuiste tú?" subtitle="Si no reconoces este inicio de sesión, asegura tu cuenta." size="section" />
        <OtpInput value={otpLarge} onChange={setOtpLarge} size="lg" testID="showcase-otpLarge" />
        <CountdownText seconds={30} onResend={() => {}} label="Reenviar código" />
        <Button title="Agregar moneda" onPress={() => {}} variant="gradient" leftIcon={Plus} rightAdornment="none" size="lg" radius="md" deepGradient />
        <Button title="Continuar" onPress={() => {}} variant="gradient" rightAdornment="arrow" size="lg" radius="md" deepGradient />
        <Button title="Sí, fui yo" onPress={() => {}} variant="gradient" rightAdornment="arrowCircle" size="lg" radius="pill" deepGradient />
        <Button title="No, no fui yo" onPress={() => {}} variant="outline" rightAdornment="none" size="lg" radius="pill" />
      </Section>

      <Section title="Home">
        <BalanceHeader label="MY BALANCE" amount="$2,450.00" onMenuPress={() => {}} />
        <CardCarousel
          cards={[
            { id: "physical", title: "Physical", last4: "4590", holderName: "John Perez", status: "off", number: "4590 1234 5678 4590" },
            { id: "virtual", title: "Virtual", last4: "7781", holderName: "John Perez", status: "on", number: "7781 4432 9087 7781" },
          ]}
          showData={showData}
          offLabel="CARD OFF"
        />
        <ToggleRow label="Show Data" value={showData} onChange={setShowData} />
        <ActivityItem label="Zelle Deposit" amount="+$500.00" direction="in" />
        <ActivityItem label="Service Payment" amount="-$80.00" direction="out" />
      </Section>

      <Section title="Transacciones">
        <TransactionItem badgeLabel="Virtual" variant="virtual" label="Zelle Deposit" date="MAR 02, 2026" amount="+$500.00" />
        <TransactionItem badgeLabel="Physical" variant="physical" label="POS Purchase" date="MAR 05, 2026" amount="-$46.20" />
        <TransactionItem badgeLabel="Remittance" variant="remittance" label="Mario Diaz / 1500 MXN" date="MAR 06, 2026" amount="$100.00" />
        <TransactionItem badgeLabel="Trading" variant="trading" label="Wallet Transfer" date="MAR 08, 2026" amount="-$120.00" />
      </Section>

      <Section title="Envio y alta">
        <AvailableBalanceCard label="Available USD Balance" amount="$2450.00" />
        <BeneficiaryItem name="Juan Pérez" phone="+52 55 1234 5678" city="CDMX, CDMX" selected={beneficiary === "1"} onPress={() => setBeneficiary("1")} />
        <BeneficiaryItem name="María López" phone="+52 81 5555 2222" city="Monterrey, Nuevo León" selected={beneficiary === "2"} onPress={() => setBeneficiary("2")} />
        <UploadDocumentCard title="Identification Front" actionLabel="Upload document" emptyLabel="No file selected" onPress={() => {}} />
        <CredentialsSummaryCard phoneLabel="Phone number" phone="+1 (748) 123-0230" codeLabel="Access code" code="573920" revealLabel="Show Data" />
        <AvatarPicker onPress={() => {}} />
      </Section>

      <Section title="Listas y cards (fase 2)">
        <CurrencyAccountCard country="US" code="USD" name="Dólar estadounidense" balance={12480} onPress={() => {}} />
        <CurrencyAccountCard country="MX" code="MXN" name="Peso mexicano" balance={25300} onPress={() => {}} />

        <ListItemCard
          icon={MessageSquareWarning}
          title="Reportar cargo"
          description="Inicia una disputa de transacción."
          showChevron
          selected={listChoice === "report"}
          onPress={() => setListChoice("report")}
        />
        <ListItemCard
          icon={FileX2}
          title="Cancelar transferencia"
          description="Si la transacción aún está en proceso."
          showChevron
          selected={listChoice === "cancel"}
          onPress={() => setListChoice("cancel")}
        />
        <ListItemCard
          icon={Clock}
          title="Seguimiento"
          description="Consulta el estatus de tu reporte."
          showChevron
          selected={listChoice === "track"}
          onPress={() => setListChoice("track")}
        />
        <ListItemCard
          icon={ShieldCheck}
          title="Tu información está a salvo"
          description="Solo tú puedes acceder a tu cuenta."
        />

        <InfoDetailsCard
          items={[
            { icon: Smartphone, label: "Dispositivo", value: "iPhone 14 Pro" },
            { icon: MapPin, label: "Ubicación", value: "Ciudad de México, MX" },
            { icon: Calendar, label: "Fecha y hora", value: "14 Sep 2025, 10:24 a.m." },
          ]}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: screenPadding,
    paddingBottom: spacing.xxxl * 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xl,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  sectionBody: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.md,
  },
});
