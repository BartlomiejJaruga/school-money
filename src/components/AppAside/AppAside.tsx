import { useFetcher } from 'react-router-dom';
import styles from './AppAside.module.scss';
import logoWhite from '@assets/logo-white.svg';

export function AppAside() {
  const fetcher = useFetcher();

  const handleLogout = () => {
    fetcher.submit({}, { method: 'post', action: 'logout' });
  };

  return (
    <>
      <aside className={styles['aside']}>
        <div className={styles['aside__top-side']}>
          <img
            src={logoWhite}
            alt="SchoolMoney logo"
            className={styles['top-side__logo']}
          />
        </div>
        <div className={styles['aside__bottom-side']}>
          <button onClick={handleLogout} disabled={fetcher.state !== 'idle'}>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
