import { useTranslation } from "react-i18next";

export default function PlayOnYourMobile() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-svh">
      <p className="text-2xl font-semibold uppercase">{t("play_on_your_mobile")}</p>
      <img
        src="/images/qrcode.png"
        alt="qrcode"
        className="object-contain max-w-xs rounded-xl"
      />
      <a href="#" className="text-2xl font-semibold">
        @1xMM
      </a>
    </div>
  );
}
