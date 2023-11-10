import { render } from '@testing-library/react';

import Banner, { BannerProps } from './banner';

const bannerProps: BannerProps = {
  link: {
    text: 'Test Link',
    href: 'https://testlink.com',
    ariaLabel: 'Test Link',
  },
};

describe('Banner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Banner {...bannerProps} />);
    expect(baseElement).toBeTruthy();
  });
});
