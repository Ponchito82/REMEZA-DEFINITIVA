import React, { useState } from "react";
import { Mail, MessageSquareMore } from "lucide-react-native";

import { InfoCard, StatusScreen, TextField } from "../../components/ui";
import type { TwoFactorMethod } from "../../services/securitySettings";
import { isValidE164Phone, isValidEmail } from "../../utils/validation";

type Props = {
  t: any;
  method: TwoFactorMethod;
  /** Telefono o correo de la cuenta. Vacio si la sesion no lo trae: se pide aqui. */
  destination: string;
  sending: boolean;
  onBack: () => void;
  onSend: (destination: string) => void;
};

/**
 * Activar un metodo de la verificacion en dos pasos: Codigo SMS o Correo
 * electronico. Se llega aqui solo al encender su switch en el listado, para
 * enviar y verificar el codigo antes de dejarlo activo; desactivar sigue
 * siendo directo desde el switch, sin pasar por aqui.
 */
export default function TwoFactorMethodScreen({
  t,
  method,
  destination,
  sending,
  onBack,
  onSend,
}: Props) {
  const isSms = method === "sms";
  const [typed, setTyped] = useState("");
  const [touched, setTouched] = useState(false);

  const value = (destination || typed).trim();
  const valid = isSms ? isValidE164Phone(value.replace(/[\s()-]/g, "")) : isValidEmail(value);
  const askForDestination = !destination;

  return (
    <StatusScreen
      testID={`twoFactorMethod.${method}`}
      keyboard={askForDestination}
      showBack
      onBack={onBack}
      backTestID={`twoFactorMethod.${method}.backButton`}
      backAccessibilityLabel={t.back}
      icon={isSms ? MessageSquareMore : Mail}
      title={isSms ? t.twoFactorSms : t.twoFactorEmail}
      subtitle={isSms ? t.twoFactorSmsDesc : t.twoFactorEmailDesc}
      primary={{
        testID: `twoFactorMethod.${method}.sendButton`,
        title: t.sendCode,
        showArrow: true,
        loading: sending,
        disabled: !valid,
        onPress: () => onSend(isSms ? value.replace(/[\s()-]/g, "") : value),
      }}
    >
      {askForDestination ? (
        <TextField
          testID={`twoFactorMethod.${method}.input`}
          label={isSms ? t.phoneNumber : t.emailAddress}
          placeholder={isSms ? "+1 555 123 4567" : "name@email.com"}
          value={typed}
          onChangeText={(text) => {
            setTouched(true);
            setTyped(text);
          }}
          keyboardType={isSms ? "phone-pad" : "email-address"}
          autoCapitalize="none"
          error={touched && !valid ? (isSms ? t.invalidPhoneNumber : t.requiredEmail) : undefined}
        />
      ) : (
        <InfoCard
          testID={`twoFactorMethod.${method}.destinationCard`}
          icon={isSms ? MessageSquareMore : Mail}
          title={isSms ? t.phoneNumber : t.emailAddress}
          text={`${destination}\n${isSms ? t.twoFactorDestinationSms : t.twoFactorDestinationEmail}`}
        />
      )}
    </StatusScreen>
  );
}
