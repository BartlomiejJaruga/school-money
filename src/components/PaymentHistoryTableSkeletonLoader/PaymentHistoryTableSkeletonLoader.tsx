import styles from './PaymentHistoryTableSkeletonLoader.module.scss';
import clsx from 'clsx';

type PaymentHistoryTableSkeletonLoaderProps = {
  skeletonsNumber: number;
};

export function PaymentHistoryTableSkeletonLoader({
  skeletonsNumber,
}: PaymentHistoryTableSkeletonLoaderProps) {
  const skeletons = Array.from({ length: skeletonsNumber }, (_, i) => i);

  return (
    <div className={styles['history-table-wrapper']}>
      <table className={styles['history-table']}>
        <thead className={styles['history-table__header']}>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Operation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={styles['history-table__body']}>
          {skeletons.map((id) => (
            <tr key={id} className={styles['history-table__row']}>
              <td className={styles['history-table__cell']}>
                <div
                  className={clsx(
                    styles['skeleton-bar'],
                    styles['skeleton-bar--date'],
                    styles['shimmer']
                  )}
                />
              </td>
              <td className={styles['history-table__cell']}>
                <div
                  className={clsx(
                    styles['skeleton-bar'],
                    styles['skeleton-bar--amount'],
                    styles['shimmer']
                  )}
                />
              </td>
              <td className={styles['history-table__cell']}>
                <div
                  className={clsx(
                    styles['skeleton-bar'],
                    styles['skeleton-bar--operation'],
                    styles['shimmer']
                  )}
                />
              </td>
              <td className={styles['history-table__cell']}>
                <div
                  className={clsx(
                    styles['skeleton-bar'],
                    styles['skeleton-bar--status'],
                    styles['shimmer']
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
