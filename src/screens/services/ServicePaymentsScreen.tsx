import React, { useEffect, useState } from "react";
import { Droplet, LayoutGrid, Lightbulb, Phone, Tv, Wifi } from "lucide-react-native";

import { ListRow, MerchantAvatar, StatusScreen } from "../../components/ui";
import type { IconComponent } from "../../components/ui";
import { MOCK_SERVICE_PROVIDERS, ServiceProvider } from "../../mocks/remeza";
import { getServiceProviders } from "../../services/servicePayments";
import { metrics } from "../../theme/radius";

type Props = {
  t: any;
  onBack: () => void;
  onSelect: (provider: ServiceProvider) => void;
};

/** Icono generico por tipo de servicio; el logo del proveedor solo si llega en SVG. */
const SERVICE_ICONS: Record<string, IconComponent> = {
  electricity: Lightbulb,
  water: Droplet,
  internet: Wifi,
  phone: Phone,
  tv: Tv,
};

/** Pago de servicios (pantalla 17). */
export default function ServicePaymentsScreen({ t, onBack, onSelect }: Props) {
  const [providers, setProviders] = useState<ServiceProvider[]>(MOCK_SERVICE_PROVIDERS);

  useEffect(() => {
    let alive = true;
    getServiceProviders().then((list) => {
      if (alive) setProviders(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <StatusScreen
      testID="servicePayments"
      showBack
      onBack={onBack}
      backTestID="servicePayments.backButton"
      backAccessibilityLabel={t.back}
      icon={LayoutGrid}
      title={t.servicesTitle}
      subtitle={t.servicesSubtitle}
    >
      {providers.map((provider) => (
        <ListRow
          key={provider.id}
          testID={`servicePayments.provider.${provider.id}`}
          icon={provider.logoSvgUrl ? undefined : SERVICE_ICONS[provider.id] ?? LayoutGrid}
          leading={
            provider.logoSvgUrl ? (
              <MerchantAvatar
                name={provider.company}
                svgUrl={provider.logoSvgUrl}
                size={metrics.rowIconCircle}
              />
            ) : undefined
          }
          title={`${t[provider.nameKey]} (${provider.company})`}
          onPress={() => onSelect(provider)}
        />
      ))}
    </StatusScreen>
  );
}
