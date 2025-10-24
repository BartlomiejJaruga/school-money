import { Outlet } from 'react-router-dom';
import styles from './AsideLayout.module.scss';
import { AppAside } from '@components/AppAside';

export function AsideLayout() {
  return (
    <>
      <div className={styles['layout']}>
        <AppAside />
        <main className={styles['main-content']}>
          <Outlet />
        </main>
      </div>
    </>
  );
}
