import { render } from '@testing-library/react';

import Popup, { PopupProps } from './popup';

const popupProps: PopupProps = {
  brand: {
    name: 'Test Brand',
    url: 'https://testbrand.com',
  },
};

describe('Popup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Popup {...popupProps} />);
    expect(baseElement).toBeTruthy();
  });
});
