import styles from './ChildrenStatusesSkeletonLoader.module.scss';
import clsx from 'clsx';

type ChildrenStatusesSkeletonLoaderProps = {
  skeletonsNumber: number;
};

export function ChildrenStatusesSkeletonLoader({
  skeletonsNumber,
}: ChildrenStatusesSkeletonLoaderProps) {
  const skeletons = Array.from({ length: skeletonsNumber }, (_, i) => i + 1);

  return (
    <>
      {skeletons.map((id) => (
        <div key={id} className={styles['skeleton-row']}>
          {/* Left side: Avatar and Names */}
          <div className={styles['skeleton-row__left']}>
            <div
              className={clsx(styles['skeleton-avatar'], styles['shimmer'])}
            />
            <div
              className={clsx(
                styles['skeleton-text'],
                styles['skeleton-text--names'],
                styles['shimmer']
              )}
            />
          </div>

          {/* Right side: Status label */}
          <div
            className={clsx(
              styles['skeleton-text'],
              styles['skeleton-text--status'],
              styles['shimmer']
            )}
          />
        </div>
      ))}
    </>
  );
}
