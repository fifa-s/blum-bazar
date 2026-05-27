import { useTranslations } from "next-intl";
import { AuthCard } from "@/components/ui/AuthCard";

export default function LoginPage() {
  const t = useTranslations();

  return (
    <AuthCard
      mode="login"
      title={t("page.auth.login.title")}
      subtitle={t("page.auth.login.subtitle")}
      googleButtonLabel={t("page.auth.common.googleButton")}
      dividerLabel={t("page.auth.login.dividerLabel")}
      submitButtonLabel={t("page.auth.login.submitButtonLabel")}
      forgotPasswordLabel={t("page.auth.login.forgotPassword")}
      forgotPasswordHref="/forgot-password"
      footerText={t("page.auth.login.footerText")}
      footerLinkLabel={t("page.auth.login.footerLinkLabel")}
      emailLabel={t("page.auth.common.emailTitle")}
      emailPlaceholder={t("page.auth.common.emailPlaceholder")}
      passwordLabel={t("page.auth.common.passwordTitle")}
      passwordPlaceholder={t("page.auth.common.passwordPlaceholder")}
      footerLinkHref="/register"
      redirectTo="/inzeraty"
    />
  );
}
