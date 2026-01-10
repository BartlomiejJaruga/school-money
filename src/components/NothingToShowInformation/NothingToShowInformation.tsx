import { PackageOpen } from 'lucide-react';
import styles from './NothingToShowInformation.module.scss';
import clsx from 'clsx';

type NothingToShowInformationProps = {
  message: string;
  className?: string;
};

export function NothingToShowInformation({
  message,
  className,
}: NothingToShowInformationProps) {
  return (
    <>
      <div
        className={clsx(
          styles['nothing-to-show-info-wrapper'],
          className ?? ''
        )}
      >
        <PackageOpen className={styles['nothing-to-show-info-wrapper__icon']} />
        <p className={styles['nothing-to-show-info-wrapper__text']}>
          {message}
        </p>
      </div>
    </>
  );
}
