import { AuthenticationAside } from './AuthenticationAside';
import styles from './AuthenticationPage.module.scss';
import logoWhite from '@assets/logo-white.svg';

export function AuthenticationPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['page__overlay']} />
        <div className={styles['hero']}>
          <img
            src={logoWhite}
            className={styles['hero__logo']}
            alt="SchoolMoney logo"
          />
          <h1 className={styles['hero__text']}>
            <span className={styles['hero__text--accent']}>Simple</span> and{' '}
            <span className={styles['hero__text--accent']}>transparent</span>{' '}
            class fundraisers - all in one place
          </h1>
        </div>
        <AuthenticationAside />
      </div>
    </>
  );
}
