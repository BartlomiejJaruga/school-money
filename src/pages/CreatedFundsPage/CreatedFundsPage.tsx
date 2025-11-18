import styles from './CreatedFundsPage.module.scss';
import { PackageOpen } from 'lucide-react';

export function CreatedFundsPage() {
  return (
    <>
      <div className={styles['page']}>
        {/* <NothingToShowInformation /> */}
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__classes']}>Classes</div>
          <div className={styles['grid-container__create-fund']}>
            Create fund
          </div>
          <div className={styles['grid-container__fund-list']}>Fund list</div>
          <div className={styles['grid-container__class-info']}>Class info</div>
          <div className={styles['grid-container__event-log']}>Event log</div>
        </div>
      </div>
    </>
  );
}

function NothingToShowInformation() {
  return (
    <>
      <div className={styles['nothing-to-show-info-wrapper']}>
        <PackageOpen className={styles['nothing-to-show-info-wrapper__icon']} />
        <p className={styles['nothing-to-show-info-wrapper__text']}>
          You are not a treasurer in any of your classes
        </p>
      </div>
    </>
  );
}
