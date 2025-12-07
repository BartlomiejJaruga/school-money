import styles from './PaymentHistoryPage.module.scss';
import clsx from 'clsx';
import {
  PAYMENT_HISTORY_OPERATION_STATUS_ENUM,
  PAYMENT_HISTORY_OPERATION_TYPE_ENUM,
  type PaymentHistoryOperationStatusType,
  type PaymentHistoryOperationType,
} from '@lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaymentHistoryRecord = {
  date: string;
  amountInCents: number;
  operationType: PaymentHistoryOperationType;
  operationStatus: PaymentHistoryOperationStatusType;
};

const PAYMENT_HISTORY_DATA: PaymentHistoryRecord[] = [
  {
    date: '09.10.2025, 14:50',
    amountInCents: -300,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletWithdrawal,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '09.10.2025, 14:47',
    amountInCents: 300,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundWithdrawal,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '09.10.2025, 14:44',
    amountInCents: -50,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '08.10.2025, 17:13',
    amountInCents: -20,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '08.10.2025, 17:11',
    amountInCents: -20,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.fail,
  },
  {
    date: '07.10.2025, 15:57',
    amountInCents: 150,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletTopUp,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '06.10.2025, 9:05',
    amountInCents: -50,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '06.10.2025, 9:01',
    amountInCents: -25,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
  {
    date: '06.10.2025, 8:50',
    amountInCents: 75,
    operationType: PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletTopUp,
    operationStatus: PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success,
  },
];

export function PaymentHistoryPage() {
  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__label']}>Wallet and Funds history</h1>
        <PaymentHistoryTable data={PAYMENT_HISTORY_DATA} />
        <PaymentHistoryPagination
          number={1}
          size={10}
          totalElements={267}
          totalPages={27}
        />
      </div>
    </>
  );
}

type PaymentHistoryTableProps = {
  data: PaymentHistoryRecord[];
};

function PaymentHistoryTable({ data }: PaymentHistoryTableProps) {
  return (
    <div className={styles['history-table-wrapper']}>
      <table className={styles['history-table']}>
        <thead className={styles['history-table__header']}>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Operation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className={styles['history-table__body']}>
          {data.map((record, index) => (
            <PaymentHistoryTableRow record={record} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const getPaymentHistoryOperationString = (
  operationType: PaymentHistoryOperationType
): string => {
  let operationString;
  if (operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment) {
    operationString = 'Fund Payment';
  } else if (operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletTopUp) {
    operationString = 'Wallet Top Up';
  } else if (
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundWithdrawal
  ) {
    operationString = 'Fund Withdrawal';
  } else if (operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundDeposit) {
    operationString = 'Fund Deposit';
  } else if (
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletWithdrawal
  ) {
    operationString = 'Wallet Withdrawal';
  } else if (operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundRefund) {
    operationString = 'Fund Refund';
  } else {
    operationString = 'Error';
  }

  return operationString;
};

const getPaymentHistoryOperationStatusString = (
  operationStatus: PaymentHistoryOperationStatusType
): string => {
  let operationStatusString;
  if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success) {
    operationStatusString = 'Success';
  } else if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.fail) {
    operationStatusString = 'Fail';
  } else {
    operationStatusString = 'Error';
  }

  return operationStatusString;
};

const getPaymentHistoryOperationStatusClassname = (
  operationStatus: PaymentHistoryOperationStatusType
): string => {
  let operationStatusClassname;
  if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.success) {
    operationStatusClassname = 'positive';
  } else if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.fail) {
    operationStatusClassname = 'negative';
  } else {
    operationStatusClassname = 'Error';
  }

  return operationStatusClassname;
};

type PaymentHistoryTableRowProps = {
  record: PaymentHistoryRecord;
  index: number;
};

function PaymentHistoryTableRow({
  record,
  index,
}: PaymentHistoryTableRowProps) {
  const amountClassname = record.amountInCents < 0 ? 'negative' : 'positive';
  const operationString = getPaymentHistoryOperationString(
    record.operationType
  );
  const operationStatusString = getPaymentHistoryOperationStatusString(
    record.operationStatus
  );
  const operationStatusClassname = getPaymentHistoryOperationStatusClassname(
    record.operationStatus
  );

  return (
    <tr key={index} className={styles['history-table__row']}>
      <td className={styles['history-table__cell']}>{record.date}</td>
      <td
        className={clsx(
          styles['history-table__cell'],
          styles['history-table__cell--amount'],
          styles[`history-table__cell--${amountClassname}`]
        )}
      >
        {record.amountInCents} PLN
      </td>
      <td className={styles['history-table__cell']}>{operationString}</td>
      <td
        className={clsx(
          styles['history-table__cell'],
          styles['history-table__cell--status'],
          styles[`history-table__cell--${operationStatusClassname}`]
        )}
      >
        {operationStatusString}
      </td>
    </tr>
  );
}

type PaymentHistoryPaginationProps = {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

function PaymentHistoryPagination({
  number,
  size,
  totalElements,
  totalPages,
}: PaymentHistoryPaginationProps) {
  const pageRangeStart = (number - 1) * size + 1;
  const pageRangeEnd =
    number * size >= totalElements ? totalElements : number * size;

  return (
    <div className={styles['payment-history-pagination-wrapper']}>
      <div className={styles['payment-history-pagination']}>
        <div className={styles['payment-history-pagination__pages']}>
          <span
            className={styles['payment-history-pagination__pages--highlighted']}
          >
            {`${pageRangeStart}-${pageRangeEnd}`}
          </span>
          {` of ${totalElements}`}
        </div>
        <button
          className={styles['payment-history-pagination__prev']}
          disabled={number == 1 ? true : false}
        >
          <ChevronLeft />
        </button>
        <button
          className={styles['payment-history-pagination__next']}
          disabled={number == totalPages ? true : false}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
