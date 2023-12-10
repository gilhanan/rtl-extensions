import { Popup, PopupProps } from '@rtl-extensions/popup';

const popupProps: PopupProps = {
  brand: {
    name: 'Auto',
    url: '',
  },
};

export function App() {
  return <Popup {...popupProps} />;
}

export default App;
