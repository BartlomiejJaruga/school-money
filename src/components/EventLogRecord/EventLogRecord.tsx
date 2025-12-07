import clsx from 'clsx';
import styles from './EventLogRecord.module.scss';
import type { FundOperationResponseDTO } from '@dtos/FundOperationResponseDTO';
import {
  FUND_OPERATION_TYPE_ENUM,
  type FundOperationType,
  type SimpleDateString,
} from '@lib/constants';
import { Info } from 'lucide-react';

type EventLogRecordProps = {
  fundOperationDTO: FundOperationResponseDTO;
  showFundName?: boolean;
};

const formatDate = (date: SimpleDateString): string => {
  const [year, month, day] = date.split('-').map(Number);
  return `${day}.${month}.${year}`;
};

const getOparationString = (operationType: FundOperationType): string => {
  let operationString;
  if (operationType == FUND_OPERATION_TYPE_ENUM.payment) {
    operationString = 'paid';
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
  fundOperationDTO,
  showFundName = false,
}: EventLogRecordProps) {
  const operationString = getOparationString(fundOperationDTO.operationType);
  const operationClass = getOperationClass(fundOperationDTO.operationType);

  return (
    <div className={styles['record']}>
      <div>
        <span className={styles['record__date']}>
          {formatDate(fundOperationDTO.date)}
        </span>

        <p>
          Adam Nowak{' '}
          <span
            className={clsx(
              styles['record__operation'],
              styles[`record__operation--${operationClass}`]
            )}
          >
            {operationString}
          </span>{' '}
          <span
            className={clsx(
              styles['record__money'],
              styles[`record__money--${operationClass}`]
            )}
          >
            {fundOperationDTO.amountInCents / 100} {fundOperationDTO.currency}
          </span>{' '}
          {fundOperationDTO.operationType !=
            FUND_OPERATION_TYPE_ENUM.withdrawal &&
            fundOperationDTO.operationType !=
              FUND_OPERATION_TYPE_ENUM.deposit && (
              <>
                {'for '}
                <span className={styles['record__child']}>Ada Nowak</span>
              </>
            )}
        </p>

        {(fundOperationDTO.operationType ==
          FUND_OPERATION_TYPE_ENUM.withdrawal ||
          fundOperationDTO.operationType ==
            FUND_OPERATION_TYPE_ENUM.deposit) && (
          <div className={styles['record__description-wrapper']}>
            <Info className={styles['description-wrapper__icon']} />
            <span className={styles['description-wrapper__tooltip']}>
              This is description for the money change.
            </span>
          </div>
        )}
      </div>

      {showFundName && <h3 className={styles['record__fund']}>Theater trip</h3>}
    </div>
  );
}
