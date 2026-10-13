import React from "react";
import { CreditCard, Landmark, Smartphone, User } from "lucide-react-native";

import { DetailRow } from "../../components/ui";
import { bankFromClabe, formatClabe } from "../../utils/bank";
import { Beneficiary } from "../../types/app";

type Props = {
  t: any;
  beneficiary: Pick<Beneficiary, "fullName" | "phone" | "clabe">;
  testIDPrefix: string;
};

/**
 * Datos del beneficiario en DetailRow (pantallas 34 y 36). El banco sale de
 * la CLABE; el PDF trae tambien "Numero de cuenta" y "Alias", que el
 * formulario de la app no pide.
 */
export default function BeneficiaryDetails({ t, beneficiary, testIDPrefix }: Props) {
  const bank = bankFromClabe(beneficiary.clabe);

  const rows = [
    { key: "fullName", icon: User, label: t.fullName, value: beneficiary.fullName },
    { key: "bank", icon: Landmark, label: t.commonBank, value: bank },
    {
      key: "clabe",
      icon: CreditCard,
      label: t.clabe,
      value: beneficiary.clabe ? formatClabe(beneficiary.clabe) : undefined,
      copy: true,
    },
    { key: "phone", icon: Smartphone, label: t.phoneNumber, value: beneficiary.phone },
  ];

  return (
    <>
      {rows.map((row) =>
        row.value ? (
          <DetailRow
            key={row.key}
            icon={row.icon}
            label={row.label}
            value={row.value}
            right={row.copy ? "copy" : "none"}
            copiedLabel={t.commonCopied}
            valueTestID={`${testIDPrefix}.${row.key}`}
          />
        ) : null,
      )}
    </>
  );
}
