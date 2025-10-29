import { useFetcher } from 'react-router-dom';
import styles from './AppAside.module.scss';
import logoWhite from '@assets/logo-white.svg';
import { BanknoteArrowUp, BanknoteArrowDown, History } from 'lucide-react';

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
          <Wallet />
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

function Wallet() {
  return (
    <div className={styles['wallet']}>
      <div className={styles['wallet__balance']}>
        <span className={styles['balance__title']}>Wallet balance</span>
        <h3 className={styles['balance__amount']}>100.00 PLN</h3>
      </div>
      <div className={styles['wallet__operations']}>
        <button className={styles['operations__button']}>
          <BanknoteArrowUp />
          Top up
        </button>
        <button className={styles['operations__button']}>
          <BanknoteArrowDown />
          Withdrawal
        </button>
        <button className={styles['operations__button']}>
          <History />
          Payment history
        </button>
      </div>
    </div>
  );
}
