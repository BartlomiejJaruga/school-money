import clsx from 'clsx';
import styles from './EventLogRecord.module.scss';
import {
  FUND_OPERATION_TYPE_ENUM,
  type FundOperationType,
} from '@lib/constants';
import { Info } from 'lucide-react';
import type { PagedModelFundLogViewDto } from '@dtos/PagedModelFundLogViewDto';
import { formatISOToDate } from '@lib/utils';

type EventLogRecordProps = {
  fundLog: PagedModelFundLogViewDto;
  showFundName?: boolean;
};

const getOparationString = (operationType: FundOperationType): string => {
  let operationString;
  if (operationType == FUND_OPERATION_TYPE_ENUM.payment) {
    operationString = 'paid';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.rejection) {
    operationString = 'rejected fund';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.refund) {
    operationString = 'got refunded of';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.withdrawal) {
    operationString = 'withdrawn';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.deposit) {
    operationString = 'deposited';
  } else {
    operationString = 'error';
  }

  return operationString;
};

const getOperationClass = (operationType: FundOperationType): string => {
  let operationClass;
  if (operationType == FUND_OPERATION_TYPE_ENUM.payment) {
    operationClass = 'payment';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.rejection) {
    operationClass = 'rejection';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.refund) {
    operationClass = 'refund';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.withdrawal) {
    operationClass = 'withdrawal';
  } else if (operationType == FUND_OPERATION_TYPE_ENUM.deposit) {
    operationClass = 'deposit';
  } else {
    operationClass = 'error';
  }

  return operationClass;
};

export function EventLogRecord({
  fundLog,
  showFundName = false,
}: EventLogRecordProps) {
  const operationString = getOparationString(fundLog.operation_type);
  const operationClass = getOperationClass(fundLog.operation_type);

  return (
    <div className={styles['record']}>
      <div>
        <span className={styles['record__date']}>
          {formatISOToDate(fundLog.timestamp)}
        </span>

        <p>
          {`${fundLog.parent_full_name} `}
          <span
            className={clsx(
              styles['record__operation'],
              styles[`record__operation--${operationClass}`]
            )}
          >
            {operationString}
          </span>{' '}
          {fundLog.operation_type != FUND_OPERATION_TYPE_ENUM.rejection && (
            <>
              <span
                className={clsx(
                  styles['record__money'],
                  styles[`record__money--${operationClass}`]
                )}
              >
                {(fundLog.amount_in_cents / 100).toFixed(2)} {fundLog.currency}
              </span>{' '}
            </>
          )}
          {fundLog.operation_type != FUND_OPERATION_TYPE_ENUM.withdrawal &&
            fundLog.operation_type != FUND_OPERATION_TYPE_ENUM.deposit && (
              <>
                {'for '}
                <span className={styles['record__child']}>
                  {fundLog.child_full_name}
                </span>
              </>
            )}
        </p>

        {(fundLog.operation_type == FUND_OPERATION_TYPE_ENUM.withdrawal ||
          fundLog.operation_type == FUND_OPERATION_TYPE_ENUM.deposit) && (
          <div className={styles['record__description-wrapper']}>
            <Info className={styles['description-wrapper__icon']} />
            <span className={styles['description-wrapper__tooltip']}>
              {fundLog.note}
            </span>
          </div>
        )}
      </div>

      {showFundName && (
        <h3 className={styles['record__fund']}>{fundLog.fund_title}</h3>
      )}
    </div>
  );
}
