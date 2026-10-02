import { useTranslations } from "next-intl";

import Container from "@/components/Container";

const TermsPage = () => {
  const t = useTranslations("Terms");

  return (
    <main>
      <Container>
        <div className="mx-auto max-w-4xl py-12 sm:py-16">
          {/* Header */}
          <header className="border-b border-border pb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              {t("legal")}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {t("intro")}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              {t("lastUpdated")}
            </p>
          </header>

          {/* Terms & Conditions */}
          <section className="border-b border-border py-10">
            <div className="space-y-8 text-sm leading-7 text-muted-foreground sm:text-base">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.introduction.title")}
                </h2>
                <p className="mt-3">{t("terms.introduction.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.accountRegistration.title")}
                </h2>
                <p className="mt-3">{t("terms.accountRegistration.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.investmentTrading.title")}
                </h2>
                <p className="mt-3">{t("terms.investmentTrading.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.paymentsWithdrawals.title")}
                </h2>
                <p className="mt-3">{t("terms.paymentsWithdrawals.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.userResponsibilities.title")}
                </h2>
                <p className="mt-3">{t("terms.userResponsibilities.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.limitationOfLiability.title")}
                </h2>
                <p className="mt-3">{t("terms.limitationOfLiability.content")}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t("terms.changesToTerms.title")}
                </h2>
                <p className="mt-3">{t("terms.changesToTerms.content")}</p>
              </div>
            </div>
          </section>

          {/* Privacy Policy */}
          <section id="policy" className="scroll-mt-24 py-10">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t("privacy.label")}
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("privacy.title")}
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                {t("privacy.intro")}
              </p>
            </div>

            <div className="space-y-8 text-sm leading-7 text-muted-foreground sm:text-base">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.informationWeCollect.title")}
                </h3>
                <p className="mt-3">
                  {t("privacy.informationWeCollect.content")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.howWeUseInformation.title")}
                </h3>
                <p className="mt-3">
                  {t("privacy.howWeUseInformation.content")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.informationProtection.title")}
                </h3>
                <p className="mt-3">
                  {t("privacy.informationProtection.content")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.cookies.title")}
                </h3>
                <p className="mt-3">{t("privacy.cookies.content")}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.thirdPartyServices.title")}
                </h3>
                <p className="mt-3">
                  {t("privacy.thirdPartyServices.content")}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.yourRights.title")}
                </h3>
                <p className="mt-3">{t("privacy.yourRights.content")}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("privacy.contact.title")}
                </h3>
                <p className="mt-3">{t("privacy.contact.content")}</p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
};

export default TermsPage;
