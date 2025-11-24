import styles from './FundsPage.module.scss';
import { MoveLeft, MoveRight } from 'lucide-react';
import clsx from 'clsx';

export function FundsPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__fund-list']}>
            <div className={styles['pagination']}>
              <button className={styles['pagination__prev']} disabled={true}>
                <MoveLeft />
                Prev
              </button>
              <div className={styles['pagination__pages']}>
                <button
                  className={clsx(
                    styles['pages__page'],
                    styles['pages__page--active']
                  )}
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
          </div>
          <div className={styles['grid-container__children']}>children</div>
          <div className={styles['grid-container__history']}>history</div>
        </div>
      </div>
    </>
  );
}
