import { NavLink, useFetcher, useRouteLoaderData } from 'react-router-dom';
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
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { getUserData } from '@lib/session';
import type { AsideLayoutData } from '@routes/_authenticated.route';
import type { WalletData } from '@lib/constants';
import { useEffect, useState } from 'react';
import type { ParentResponseDto } from '@dtos/ParentResponseDto';
import { ModalTemplate } from '@components/ModalTemplate';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import {
  WalletWithdrawalModalSchema,
  type WalletWithdrawalModalValues,
} from '@schemas/wallet/walletWithdrawalModal.schema';
import {
  WalletTopUpModalSchema,
  type WalletTopUpModalValues,
} from '@schemas/wallet/walletTopUpModal.schema';

export function AppAside() {
  const asideLayoutData = useRouteLoaderData('aside-layout') as AsideLayoutData;
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] =
    useState<boolean>(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);

  const handleOpenWithdrawalModal = () => {
    setIsWithdrawalModalOpen(true);
  };

  const handleCloseWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleOpenTopUpModal = () => {
    setIsTopUpModalOpen(true);
  };

  const handleCloseTopUpModal = () => {
    setIsTopUpModalOpen(false);
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
          <UserInfo
            userAvatar={asideLayoutData.userAvatar}
            userData={asideLayoutData.userData}
          />
          <Wallet
            walletData={asideLayoutData.walletData}
            handleOpenWithdrawalModal={handleOpenWithdrawalModal}
            handleOpenTopUpModal={handleOpenTopUpModal}
          />
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
      <ModalTemplate
        isOpen={isWithdrawalModalOpen}
        onOverlayClick={handleCloseWithdrawalModal}
      >
        <WithdrawWalletModal
          onClose={handleCloseWithdrawalModal}
          onConfirm={handleCloseWithdrawalModal}
        />
      </ModalTemplate>
      <ModalTemplate
        isOpen={isTopUpModalOpen}
        onOverlayClick={handleCloseTopUpModal}
      >
        <TopUpWalletModal
          onClose={handleCloseTopUpModal}
          onConfirm={handleCloseTopUpModal}
        />
      </ModalTemplate>
    </>
  );
}

type UserInfoProps = {
  userAvatar: Blob | null;
  userData: ParentResponseDto | null;
};

function UserInfo({ userAvatar, userData }: UserInfoProps) {
  const storedUserData = getUserData();
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
          {userData?.first_name || storedUserData?.firstName || 'No info'}{' '}
          {userData?.last_name || storedUserData?.lastName || 'No info'}
        </span>
        <span className={styles['info__email']}>
          {userData?.email || storedUserData?.email || 'No info'}
        </span>
      </div>
    </div>
  );
}

type WalletProps = {
  walletData: WalletData | null;
  handleOpenWithdrawalModal: () => void;
  handleOpenTopUpModal: () => void;
};

function Wallet({
  walletData,
  handleOpenWithdrawalModal,
  handleOpenTopUpModal,
}: WalletProps) {
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
        <button
          className={styles['operations__button']}
          onClick={handleOpenTopUpModal}
        >
          <BanknoteArrowUp className={styles['button__icon']} />
          Top up
        </button>
        <button
          className={styles['operations__button']}
          onClick={handleOpenWithdrawalModal}
        >
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

type WithdrawWalletModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

function WithdrawWalletModal({ onClose, onConfirm }: WithdrawWalletModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<WalletWithdrawalModalValues>({
    resolver: zodResolver(WalletWithdrawalModalSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 1,
      iban: '',
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      onConfirm();
    }
  }, [fetcher.state, fetcher.data]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: WalletWithdrawalModalValues) => {
    fetcher.submit(values, {
      method: 'post',
      action: '/walletWithdrawal',
    });
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['wallet-withdrawal-modal']}>
      <div className={styles['wallet-withdrawal-modal__top']}>
        <h2 className={styles['top__title']}>WITHDRAW MONEY</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['wallet-withdrawal-modal__form']}
        >
          <CustomInputWithLabel
            label="IBAN"
            name="iban"
            placeholder="Enter IBAN of account"
            autoComplete="on"
          />
          <CustomInputWithLabel
            type="number"
            label="Amount"
            name="amount"
            placeholder="Enter amount to withdraw"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

type TopUpWalletModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

function TopUpWalletModal({ onClose, onConfirm }: TopUpWalletModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<WalletTopUpModalValues>({
    resolver: zodResolver(WalletTopUpModalSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 1,
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && fetcher.data.checkoutUrl) {
      onConfirm();
      window.location.assign(fetcher.data.checkoutUrl);
    }
  }, [fetcher.state, fetcher.data]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: WalletTopUpModalValues) => {
    fetcher.submit(
      { currentAppLocation: window.location.href, ...values },
      {
        method: 'post',
        action: '/walletTopUp',
      }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['wallet-top-up-modal']}>
      <div className={styles['wallet-top-up-modal__top']}>
        <h2 className={styles['top__title']}>TOP UP MONEY</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['wallet-top-up-modal__form']}
        >
          <CustomInputWithLabel
            type="number"
            label="Amount"
            name="amount"
            placeholder="Enter amount to top up"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
