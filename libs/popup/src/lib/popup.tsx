import styles from './popup.module.scss';

/* eslint-disable-next-line */
export interface PopupProps {}

export function Popup(props: PopupProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Popup!</h1>
    </div>
  );
}

export default Popup;
