import clsx from 'clsx';
import styles from './HorizontalProgressBar.module.scss';

interface DateProps {
  type: 'date';
  start: string;
  end: string;
}

interface NumericProps {
  type: 'numeric';
  start: number;
  end: number;
  current: number;
}

type HorizontalProgressBarProps = (DateProps | NumericProps) & {
  title: string;
  textStart: string;
  textEnd: string;
};

const parseStringToDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('.').map(Number);
  return new Date(year, month - 1, day);
};

const calculateDateProgress = (start: string, end: string): number => {
  const startTimestamp = parseStringToDate(start).getTime();
  const endTimestamp = parseStringToDate(end).getTime();
  const nowTimestamp = new Date().getTime();

  const totalDuration = endTimestamp - startTimestamp;
  const elapsedDuration = nowTimestamp - startTimestamp;

  if (totalDuration <= 0) {
    return elapsedDuration >= 0 ? 100 : 0;
  }

  let progress = (elapsedDuration / totalDuration) * 100;
  return Math.max(0, Math.min(100, progress));
};

const calculateNumericProgress = (
  start: number,
  end: number,
  current: number
): number => {
  const totalRange = end - start;
  const achievedValue = current - start;

  if (totalRange <= 0) {
    return achievedValue >= 0 ? 100 : 0;
  }

  let progress = (achievedValue / totalRange) * 100;
  return Math.max(0, Math.min(100, progress));
};

export function HorizontalProgressBar(props: HorizontalProgressBarProps) {
  let progressPercentage: number;

  if (props.type === 'date') {
    progressPercentage = calculateDateProgress(props.start, props.end);
  } else if (props.type === 'numeric') {
    progressPercentage = calculateNumericProgress(
      props.start,
      props.end,
      props.current
    );
  } else {
    progressPercentage = 0;
  }

  return (
    <div className={styles['wrapper']}>
      <h3 className={styles['wrapper__title']}>{props.title}</h3>
      <div
        className={clsx(
          styles['wrapper__progress-bar'],
          props.type == 'date' && styles['wrapper__progress-bar--date']
        )}
      >
        <div style={{ width: `${progressPercentage}%` }} />
      </div>
      <div className={styles['wrapper__labels']}>
        <span className={styles['labels__start']}>
          {props.textStart} {props.type == 'date' ? props.start : props.current}
        </span>
        <span className={styles['labels__end']}>
          {props.textEnd} {props.end}
        </span>
      </div>
    </div>
  );
}
