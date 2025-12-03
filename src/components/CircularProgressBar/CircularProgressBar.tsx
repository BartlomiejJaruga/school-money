import clsx from 'clsx';
import styles from './CircularProgressBar.module.scss';

type CircularProgressBarProps = {
  percent: number;
  className?: string;
  backgroundClassName?: string;
};

const THRESHOLD_COLOR_MEDIUM: number = 35;
const THRESHOLD_COLOR_HIGH: number = 75;
const radius = 54;
const circumference = 2 * Math.PI * radius;

export function CircularProgressBar({
  percent,
  className,
  backgroundClassName,
}: CircularProgressBarProps) {
  const strokeDashoffset =
    circumference - (Math.max(0, percent) / 100) * circumference;

  let circleColor = '';
  if (percent >= THRESHOLD_COLOR_HIGH) {
    circleColor = 'high';
  } else if (percent >= THRESHOLD_COLOR_MEDIUM) {
    circleColor = 'medium';
  } else {
    circleColor = 'low';
  }

  return (
    <div className={clsx(styles['circular-progress-bar'], className ?? '')}>
      <svg
        className={styles['circular-progress-bar__svg']}
        viewBox="0 0 120 120"
      >
        <circle
          className={clsx(
            styles['circular-progress-bar__circle--background'],
            backgroundClassName ?? ''
          )}
          cx="60"
          cy="60"
          r={radius}
        />
        <circle
          className={clsx(
            styles['circular-progress-bar__circle'],
            styles[`circular-progress-bar__circle--${circleColor}`]
          )}
          cx="60"
          cy="60"
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      <div
        className={clsx(
          styles['circular-progress-bar__percent'],
          styles[`circular-progress-bar__percent--${circleColor}`]
        )}
      >
        {Math.round(Math.max(0, percent))}%
      </div>
    </div>
  );
}
