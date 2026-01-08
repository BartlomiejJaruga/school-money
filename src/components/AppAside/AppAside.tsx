import { NavLink, useRouteLoaderData } from 'react-router-dom';
import styles from './AppAside.module.scss';
import logoWhite from '@assets/logo-white.svg';
import defaultUser from '@assets/default-user.png';
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
import { getUserData } from '@lib/session';
import type { AsideLayoutData } from '@routes/_authenticated.route';
import type { WalletData } from '@lib/constants';
import { useEffect, useState } from 'react';

export function AppAside() {
  const asideLayoutData = useRouteLoaderData('aside-layout') as AsideLayoutData;

  return (
    <>
      <aside className={styles['aside']}>
        <div className={styles['aside__top-side']}>
          <img
            src={logoWhite}
            alt="SchoolMoney logo"
            className={styles['top-side__logo']}
          />
          <UserInfo userAvatar={asideLayoutData.userAvatar} />
          <Wallet walletData={asideLayoutData.walletData} />
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

type UserInfoProps = {
  userAvatar: Blob | null;
};

function UserInfo({ userAvatar }: UserInfoProps) {
  const userData = getUserData();
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>(defaultUser);

  useEffect(() => {
    if (!userAvatar) return;

    const objectUrl = URL.createObjectURL(userAvatar);
    setUserAvatarUrl(objectUrl);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [userAvatar]);

  return (
    <div className={styles['user-info']}>
      <img
        src={userAvatarUrl}
        alt="avatar"
        className={styles['user-info__avatar']}
      />
      <div className={styles['user-info__info']}>
        <span className={styles['info__names']}>
          {userData?.firstName} {userData?.lastName}
        </span>
        <span className={styles['info__email']}>{userData?.email}</span>
      </div>
    </div>
  );
}

type WalletProps = {
  walletData: WalletData | null;
};

function Wallet({ walletData }: WalletProps) {
  const walletBalance = walletData?.balanceInCents
    ? walletData.balanceInCents / 100
    : 'No info';

  return (
    <div className={styles['wallet']}>
      <div className={styles['wallet__balance']}>
        <span className={styles['balance__title']}>Wallet balance</span>
        <h3 className={styles['balance__amount']}>
          {walletBalance} {walletData?.currency}
        </h3>
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
        <SingleNavLink to="/payment-history" type="tab">
          <History className={styles['button__icon']} />
          <span>Payment History</span>
        </SingleNavLink>
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
