import { Popup, PopupProps } from '@rtl-extensions/popup';

const popupProps: PopupProps = {
  brand: {
    name: 'Cluade',
    url: 'https://claude.ai',
  },
};

export function App() {
  return <Popup {...popupProps} />;
}

export default App;
