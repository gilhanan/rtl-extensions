import { Popup, PopupProps } from '@rtl-extensions/popup';

const popupProps: PopupProps = {
  brand: {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
  },
};

export function App() {
  return <Popup {...popupProps} />;
}

export default App;
