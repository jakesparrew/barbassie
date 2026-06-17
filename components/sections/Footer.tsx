// components/sections/Footer.tsx
import { useTranslations } from "next-intl"
import { Icon } from "@/components/ui/Icon"
import { CONTACT, instagramUrl, mailtoUrl, whatsappUrl } from "@/lib/contact"

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-ink text-bg px-4 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h4 className="font-subtitle text-accent text-sm tracking-wide uppercase">
            {t("footer.contact")}
          </h4>
          <ul className="font-body mt-4 space-y-2">
            <li>
              <a href={mailtoUrl()} className="hover:text-accent inline-flex items-center gap-2">
                <Icon.Mail className="h-4 w-4" /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent inline-flex items-center gap-2"
              >
                <Icon.Whatsapp className="h-4 w-4" /> {CONTACT.phoneDisplay}
              </a>
            </li>
            <li className="font-body">
              {t("location.addressLine1")}, {t("location.addressLine2")}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle text-accent text-sm tracking-wide uppercase">
            {t("footer.hours")}
          </h4>
          <ul className="font-body mt-4 space-y-2">
            <li>{t("hours.weekdays")}</li>
            <li>{t("hours.weekends")}</li>
            <li>{t("hours.sunday")}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle text-accent text-sm tracking-wide uppercase">
            {t("footer.follow")}
          </h4>
          <ul className="font-body mt-4 space-y-2">
            <li>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent inline-flex items-center gap-2"
              >
                <Icon.Instagram className="h-4 w-4" /> @{CONTACT.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle text-accent text-sm tracking-wide uppercase">
            {t("footer.jobs")}
          </h4>
          <a
            href={mailtoUrl("Jobs at Bar Bassie")}
            className="font-body hover:text-accent mt-4 inline-block tracking-wide uppercase"
          >
            {t("footer.jobsTeaser")}
          </a>
        </div>
      </div>
      <p className="font-body text-bg/60 mt-12 text-center text-xs">
        © Bar Bassie ·{" "}
        {t.rich("footer.designed", {
          link: (chunks) => (
            <a
              href="https://sidestream.be"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent underline-offset-2 hover:underline"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
    </footer>
  )
}
