import styles from './FundsPage.module.scss';

export function FundsPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__fund-list']}>fund-list</div>
          <div className={styles['grid-container__children']}>children</div>
          <div className={styles['grid-container__history']}>history</div>
        </div>
      </div>
    </>
  );
}
