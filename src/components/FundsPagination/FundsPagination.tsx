import styles from './FundsPagination.module.scss';
import clsx from 'clsx';
import { MoveLeft, MoveRight } from 'lucide-react';

export function FundsPagination() {
  return (
    <div className={styles['pagination']}>
      <button className={styles['pagination__prev']} disabled={true}>
        <MoveLeft />
        Prev
      </button>
      <div className={styles['pagination__pages']}>
        <button
          className={clsx(styles['pages__page'], styles['pages__page--active'])}
        >
          1
        </button>
        <button className={styles['pages__page']}>2</button>
        <button className={styles['pages__page']}>3</button>
      </div>
      <button className={styles['pagination__next']}>
        Next
        <MoveRight />
      </button>
    </div>
  );
}
