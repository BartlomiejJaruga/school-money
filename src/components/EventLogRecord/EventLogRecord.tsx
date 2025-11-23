import clsx from 'clsx';
import styles from './EventLogRecord.module.scss';

export function EventLogRecord() {
  return (
    <div className={styles['record']}>
      <p>
        Adam Nowak <span className={styles['record__operation']}>paid</span>{' '}
        <span
          className={clsx(
            styles['record__money'],
            styles['record__money--payment']
          )}
        >
          24 PLN
        </span>{' '}
        for <span className={styles['record__child']}>Ada Nowak</span>
      </p>
      <h3 className={styles['record__fund']}>Theater trip</h3>
    </div>
  );
}
