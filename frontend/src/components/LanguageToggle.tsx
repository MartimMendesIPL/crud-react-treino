import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en-US" ? "pt-PT" : "en-US";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="lang-toggle"
      title={i18n.language === "en-US" ? "Switch to Portuguese" : "Mudar para Inglês"}
    >
      <Globe size={18} />
      <span className="lang-toggle-label">
        {i18n.language === "en-US" ? "PT" : "EN"}
      </span>
    </button>
  );
}
