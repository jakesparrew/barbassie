// components/sections/Footer.tsx
import { useTranslations } from "next-intl"
import { Icon } from "@/components/ui/Icon"
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher"

const EMAIL = "hello@barbassie.be"
const PHONE = "32470487252"
const IG = "https://instagram.com/barbassie.wintercircus"

export function Footer() {
  const t = useTranslations()
  return (
    <footer className="bg-ink text-bg py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.contact")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>
              <a href={`mailto:${EMAIL}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Mail className="w-4 h-4" /> {EMAIL}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${PHONE}`} className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Whatsapp className="w-4 h-4" /> +32 470 48 72 52
              </a>
            </li>
            <li className="font-body">
              {t("location.addressLine1")}, {t("location.addressLine2")}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.hours")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>{t("hours.weekdays")}</li>
            <li>{t("hours.weekends")}</li>
            <li>{t("hours.closed")}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-subtitle uppercase text-accent text-sm tracking-wide">
            {t("footer.follow")}
          </h4>
          <ul className="mt-4 space-y-2 font-body">
            <li>
              <a href={IG} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                <Icon.Instagram className="w-4 h-4" /> @barbassie.wintercircus
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <LocaleSwitcher />
          </div>
        </div>
      </div>
      <p className="mt-12 text-center font-body text-bg/60 text-xs">
        © Bar Bassie · {t("footer.designed")}
      </p>
    </footer>
  )
}
