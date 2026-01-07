import styles from './FundStatusTile.module.scss';
import clsx from 'clsx';
import {
  FUND_PAYMENT_STATUS_ENUM,
  type FUND_PAYMENT_STATUS_TYPE,
} from '@lib/constants';

const formatStatus = (status: FUND_PAYMENT_STATUS_TYPE): string => {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

type FundStatusTileProps = {
  status: FUND_PAYMENT_STATUS_TYPE;
  className?: string;
};

export function FundStatusTile({ status, className }: FundStatusTileProps) {
  return (
    <div
      className={clsx(
        styles['status-tile'],
        status == FUND_PAYMENT_STATUS_ENUM.paid && styles['status-tile--paid'],
        status == FUND_PAYMENT_STATUS_ENUM.unpaid &&
          styles['status-tile--cancelled'],
        status == FUND_PAYMENT_STATUS_ENUM.rejected &&
          styles['status-tile--rejected'],
        className ?? ''
      )}
    >
      {formatStatus(status)}
    </div>
  );
}
