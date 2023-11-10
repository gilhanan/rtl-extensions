interface Link {
  ariaLabel: string;
  href: string;
  text: string;
}

export interface BannerProps {
  link: Link;
}

export function Banner({ link: { href, text, ariaLabel } }: BannerProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-medium text-primary">
        {chrome.i18n.getMessage('headerTitle')}
      </h2>
      <p className="text-sm text-secondary">
        {chrome.i18n.getMessage('headerDescription')}
        <a
          className="underline text-link"
          href={href}
          target="_blank"
          aria-label={ariaLabel}
          rel="noreferrer"
        >
          {text}
        </a>
        .
      </p>
    </div>
  );
}

export default Banner;
