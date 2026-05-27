import { useTranslations } from "next-intl";
import { AuthCard } from "@/components/ui/AuthCard";

export default function RegisterPage() {
  const t = useTranslations();

  return (
    <AuthCard
      mode="register"
      title={t("page.auth.register.title")}
      subtitle={t("page.auth.register.subtitle")}
      googleButtonLabel={t("page.auth.common.googleButton")}
      dividerLabel={t("page.auth.register.dividerLabel")}
      submitButtonLabel={t("page.auth.register.submitButtonLabel")}
      footerText={t("page.auth.register.footerText")}
      footerLinkLabel={t("page.auth.register.footerLinkLabel")}
      nameLabel={t("page.auth.register.nameTitle")}
      namePlaceholder={t("page.auth.register.namePlaceholder")}
      emailLabel={t("page.auth.common.emailTitle")}
      emailPlaceholder={t("page.auth.common.emailPlaceholder")}
      passwordLabel={t("page.auth.common.passwordTitle")}
      passwordPlaceholder={t("page.auth.common.passwordPlaceholder")}
      footerLinkHref="/login"
      redirectTo="/inzeraty"
    />
  );
}
