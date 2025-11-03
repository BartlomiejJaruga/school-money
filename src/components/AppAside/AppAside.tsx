import { NavLink } from 'react-router-dom';
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
  UserPen,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';

export function AppAside() {
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
          <SingleNavLink to="/profile" type="tab">
            <UserPen />
            <span>Profile</span>
          </SingleNavLink>
          <SingleNavLink to="/logout" type="logout">
            <LogOut />
            <span>Logout</span>
          </SingleNavLink>
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
      <SingleNavLink to="/funds" type="tab">
        <HeartHandshake />
        <span>Funds</span>
      </SingleNavLink>
      <SingleNavLink to="/created-funds" type="tab">
        <Blocks />
        <span>Created Funds</span>
      </SingleNavLink>
      <SingleNavLink to="/kids" type="tab">
        <Baby />
        <span>Kids</span>
      </SingleNavLink>
      <SingleNavLink to="/classes" type="tab">
        <GraduationCap />
        <span>Classes</span>
      </SingleNavLink>
    </>
  );
}

type SingleNavLinkProps = {
  to: string;
  type: 'tab' | 'logout';
  children?: React.ReactNode;
};

function SingleNavLink({ to, type, children }: SingleNavLinkProps) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={({ isActive, isPending }) =>
        clsx(
          isActive && styles['nav-link--active'],
          styles['nav-link'],
          type == 'tab' && styles['nav-link--tab'],
          type == 'logout' && styles['nav-link--logout'],
          isPending && type == 'logout' && styles['nav-link--disabled']
        )
      }
    >
      {children}
    </NavLink>
  );
}
