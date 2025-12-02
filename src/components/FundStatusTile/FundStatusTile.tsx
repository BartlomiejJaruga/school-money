import styles from './FundStatusTile.module.scss';
import clsx from 'clsx';
import { FUND_STATUS_ENUM, type FUND_STATUS_TYPE } from '@lib/constants';

type FundStatusTileProps = {
  status: FUND_STATUS_TYPE;
  className?: string;
};

export function FundStatusTile({ status, className }: FundStatusTileProps) {
  return (
    <div
      className={clsx(
        styles['status-tile'],
        status == FUND_STATUS_ENUM.paid && styles['status-tile--paid'],
        status == FUND_STATUS_ENUM.cancelled &&
          styles['status-tile--cancelled'],
        status == FUND_STATUS_ENUM.rejected && styles['status-tile--rejected'],
        className ?? ''
      )}
    >
      {status}
    </div>
  );
}
