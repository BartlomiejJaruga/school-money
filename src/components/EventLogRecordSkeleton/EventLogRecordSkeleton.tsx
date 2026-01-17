import styles from './EventLogRecordSkeleton.module.scss';
import clsx from 'clsx';

type EventLogRecordSkeletonProps = {
  skeletonsNumber: number;
  showFundTitle?: boolean;
};

export function EventLogRecordSkeleton({
  skeletonsNumber,
  showFundTitle = false,
}: EventLogRecordSkeletonProps) {
  const skeletons = Array.from({ length: skeletonsNumber }, (_, i) => i + 1);

  return (
    <>
      {skeletons.map((id) => (
        <div key={id} className={styles['skeleton-record']}>
          {/* Date placeholder */}
          <div
            className={clsx(
              styles['skeleton-text'],
              styles['skeleton-text--date'],
              styles['shimmer']
            )}
          />

          {/* Operation/Description placeholder */}
          <div
            className={clsx(
              styles['skeleton-text'],
              styles['skeleton-text--description'],
              styles['shimmer']
            )}
          />

          {/* Fund title placeholder */}
          {showFundTitle && (
            <div
              className={clsx(
                styles['skeleton-text'],
                styles['skeleton-text--fund'],
                styles['shimmer']
              )}
            />
          )}
        </div>
      ))}
    </>
  );
}
