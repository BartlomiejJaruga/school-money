import styles from './PaymentHistoryPage.module.scss';

export function PaymentHistoryPage() {
  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__label']}>Wallet and Funds history</h1>
        <div>Table</div>
        <div>Pagination</div>
      </div>
    </>
  );
}
