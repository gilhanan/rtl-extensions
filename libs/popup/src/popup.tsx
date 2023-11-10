import { Banner, BannerProps } from './components/banner';
import { Settings } from './components/settings';

interface Brand {
  name: string;
  url: string;
}

export interface PopupProps {
  brand: Brand;
}

export function Popup({ brand: { name, url } }: PopupProps) {
  const bannerProps: BannerProps = {
    link: {
      href: url,
      text: name,
      ariaLabel: chrome.i18n.getMessage('linkAriaLabel'),
    },
  };

  return (
    <div className="w-72 p-4 bg-white dark:bg-zinc-800">
      <div className="flex flex-col gap-4">
        <Banner {...bannerProps} />
        <Settings />
      </div>
    </div>
  );
}

export default Popup;
