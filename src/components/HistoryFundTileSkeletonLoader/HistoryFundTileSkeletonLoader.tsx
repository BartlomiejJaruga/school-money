import styles from './HistoryFundTileSkeletonLoader.module.scss';
import clsx from 'clsx';

type HistoryFundTileSkeletonLoaderProps = {
  skeletonsNumber: number;
};

export function HistoryFundTileSkeletonLoader({
  skeletonsNumber,
}: HistoryFundTileSkeletonLoaderProps) {
  const skeletons = Array.from({ length: skeletonsNumber }, (_, i) => i + 1);

  return (
    <>
      {skeletons.map((id) => (
        <div key={id} className={styles['skeleton-tile']}>
          {/* Left side - Photo placeholder */}
          <div
            className={clsx(styles['skeleton-tile__photo'], styles['shimmer'])}
          />

          {/* Center - Fund Details */}
          <div className={styles['skeleton-tile__details']}>
            {/* Fund title */}
            <div
              className={clsx(
                styles['skeleton-line'],
                styles['skeleton-line--title'],
                styles['shimmer']
              )}
            />

            {/* Child name info */}
            <div
              className={clsx(
                styles['skeleton-line'],
                styles['skeleton-line--subtitle'],
                styles['shimmer']
              )}
            />

            {/* Class info */}
            <div
              className={clsx(
                styles['skeleton-line'],
                styles['skeleton-line--subtitle'],
                styles['shimmer']
              )}
            />

            {/* Dates (Created & Due to) */}
            <div className={styles['details__dates']}>
              <div
                className={clsx(
                  styles['skeleton-line'],
                  styles['skeleton-line--small'],
                  styles['shimmer']
                )}
              />
              <div
                className={clsx(
                  styles['skeleton-line'],
                  styles['skeleton-line--small'],
                  styles['shimmer']
                )}
              />
            </div>
          </div>

          {/* Right side - Info & Progress (Grid area layout) */}
          <div className={styles['skeleton-tile__info']}>
            {/* Status block */}
            <div
              className={clsx(
                styles['info__status-placeholder'],
                styles['shimmer']
              )}
            />

            {/* Circular progress placeholder */}
            <div
              className={clsx(
                styles['info__progress-placeholder'],
                styles['shimmer']
              )}
            />

            {/* More info button placeholder */}
            <div
              className={clsx(
                styles['info__button-placeholder'],
                styles['shimmer']
              )}
            />
          </div>
        </div>
      ))}
    </>
  );
}
