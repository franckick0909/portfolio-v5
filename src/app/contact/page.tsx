import ContactPage from "./ContactPage";
import { I18nProvider } from "@/lib/i18n";

export const metadata = {
  title: "Contact | Franck Chapelon",
  description: "Discutons de votre projet.",
};

export default function Page() {
  return (
    <I18nProvider>
      <ContactPage />
    </I18nProvider>
  );
}

