import { NavLink, useFetcher } from 'react-router-dom';
import styles from './AppAside.module.scss';
import logoWhite from '@assets/logo-white.svg';
import {
  BanknoteArrowUp,
  BanknoteArrowDown,
  History,
  HeartHandshake,
  Blocks,
  Baby,
  GraduationCap,
} from 'lucide-react';
import clsx from 'clsx';

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
          <hr className={styles['top-side__divider']} />
          <NavList />
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
          <BanknoteArrowUp className={styles['button__icon']} />
          Top up
        </button>
        <button className={styles['operations__button']}>
          <BanknoteArrowDown className={styles['button__icon']} />
          Withdraw
        </button>
        <button className={styles['operations__button']}>
          <History className={styles['button__icon']} />
          Payment history
        </button>
      </div>
    </div>
  );
}

function NavList() {
  return (
    <>
      <SingleNavLink to="/funds">
        <HeartHandshake />
        Funds
      </SingleNavLink>
      <SingleNavLink to="/created-funds">
        <Blocks />
        Created Funds
      </SingleNavLink>
      <SingleNavLink to="/kids">
        <Baby />
        Kids
      </SingleNavLink>
      <SingleNavLink to="/classes">
        <GraduationCap />
        Classes
      </SingleNavLink>
    </>
  );
}

type SingleNavLinkProps = {
  to: string;
  children?: React.ReactNode;
};

function SingleNavLink({ to, children }: SingleNavLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(isActive && styles['nav-link--active'], styles['nav-link'])
      }
    >
      {children}
    </NavLink>
  );
}
