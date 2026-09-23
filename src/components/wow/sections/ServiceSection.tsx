export interface ServiceItem {
  name: string;
  description?: string;
  icon?: string;
}

export interface ServiceSectionProps {
  title?: string;
  services: ServiceItem[];
}

/** Список услуг/предложений. Пока только интерфейс. */
export function ServiceSection(_props: ServiceSectionProps) {
  return null;
}
