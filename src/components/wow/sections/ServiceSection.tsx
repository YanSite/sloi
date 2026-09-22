export interface ServiceItem {
  name: string;
  description?: string;
  icon?: string;
}

export interface ServiceSectionProps {
  title?: string;
  services: ServiceItem[];
}

/** Services/offerings listing. Interface only. */
export function ServiceSection(_props: ServiceSectionProps) {
  return null;
}
