import styles from './CreatedFundsPage.module.scss';
import { PackageOpen } from 'lucide-react';

export function CreatedFundsPage() {
  return (
    <>
      <div className={styles['page']}>
        <NoCreatedFundsInformation />
      </div>
    </>
  );
}

function NoCreatedFundsInformation() {
  return (
    <>
      <div className={styles['information-wrapper']}>
        <PackageOpen className={styles['information-wrapper__icon']} />
        <p className={styles['information-wrapper__text']}>
          You are not a treasurer in any of your classes
        </p>
      </div>
    </>
  );
}
