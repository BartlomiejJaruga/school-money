import styles from './FundTileSkeletonLoader.module.scss';
import clsx from 'clsx';

type FundTileSkeletonLoaderProps = {
  skeletonsNumber: number;
};

export function FundTileSkeletonLoader({
  skeletonsNumber,
}: FundTileSkeletonLoaderProps) {
  const skeletons = Array.from({ length: skeletonsNumber }, (_, i) => i + 1);

  return (
    <>
      {skeletons.map((id) => (
        <div key={id} className={styles['skeleton-tile']}>
          <div
            className={clsx(styles['skeleton-tile__photo'], styles['shimmer'])}
          />

          {/* Right side - details */}
          <div className={styles['skeleton-tile__details']}>
            <div className={styles['details__top']}>
              <div className={styles['top__left']}>
                {/* Fund title */}
                <div
                  className={clsx(
                    styles['skeleton-line'],
                    styles['skeleton-line--title'],
                    styles['shimmer']
                  )}
                />
                {/* Child info */}
                <div
                  className={clsx(
                    styles['skeleton-line'],
                    styles['skeleton-line--subtitle'],
                    styles['shimmer']
                  )}
                />
                {/* Child class info */}
                <div
                  className={clsx(
                    styles['skeleton-line'],
                    styles['skeleton-line--subtitle'],
                    styles['shimmer']
                  )}
                />
              </div>
              {/* Fund cost */}
              <div
                className={clsx(styles['skeleton-pill'], styles['shimmer'])}
              />
            </div>

            {/* Fund description */}
            <div className={styles['details__description']}>
              <div
                className={clsx(styles['skeleton-line'], styles['shimmer'])}
              />
              <div
                className={clsx(
                  styles['skeleton-line'],
                  styles['skeleton-line--short'],
                  styles['shimmer']
                )}
              />
            </div>

            {/* Action bar - buttons */}
            <div className={styles['details__actions-bar']}>
              <div
                className={clsx(styles['skeleton-button'], styles['shimmer'])}
              />
              <div
                className={clsx(styles['skeleton-button'], styles['shimmer'])}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
