import styles from './PaymentHistoryPage.module.scss';
import clsx from 'clsx';
import {
  PAYMENT_HISTORY_OPERATION_STATUS_ENUM,
  PAYMENT_HISTORY_OPERATION_TYPE_ENUM,
  type PaymentHistoryOperationStatusType,
  type PaymentHistoryOperationType,
} from '@lib/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLoaderData, useLocation, useNavigation } from 'react-router-dom';
import type { PaymentHistoryLoaderData } from '@routes/paymentHistory.route';
import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelFinancialOperationResponseDto } from '@dtos/PagedModelFinancialOperationResponseDto';
import { Pagination } from '@components/Pagination';
import { isParamChanging } from '@lib/utils';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import { PaymentHistoryTableSkeletonLoader } from '@components/PaymentHistoryTableSkeletonLoader';

const pad = (num: number) => num.toString().padStart(2, '0');

/**
 * Formats ISO 8601 date string using Date methods.
 * Target format: 'DD.MM.YYYY, HH:mm'
 */
export const formatEventLogDate = (isoString: string): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return '-';

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}.${month}.${year}, ${hours}:${minutes}`;
};

export function PaymentHistoryPage() {
  const paymentHistoryLoaderData = useLoaderData() as PaymentHistoryLoaderData;
  const financialHistoryData = paymentHistoryLoaderData.financialHistoryData;

  return (
    <>
      <div className={styles['page']}>
        <h1 className={styles['page__label']}>Wallet and Funds history</h1>
        <PaymentHistoryTable financialHistoryData={financialHistoryData} />
      </div>
    </>
  );
}

type PaymentHistoryTableProps = {
  financialHistoryData: PageableResponseDTO<PagedModelFinancialOperationResponseDto> | null;
};

function PaymentHistoryTable({
  financialHistoryData,
}: PaymentHistoryTableProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isFetchingPaymentHistory = isParamChanging(
    navigation,
    location,
    'financialHistoryPage'
  );

  return (
    <>
      {isFetchingPaymentHistory && (
        <PaymentHistoryTableSkeletonLoader skeletonsNumber={10} />
      )}

      {!isFetchingPaymentHistory &&
        financialHistoryData &&
        financialHistoryData.content.length > 0 && (
          <>
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
                  {financialHistoryData.content.map(
                    (financialHistoryRecord) => {
                      return (
                        <PaymentHistoryTableRow
                          record={financialHistoryRecord}
                          key={financialHistoryRecord.started_at}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              urlPagesName="financialHistoryPage"
              totalPages={financialHistoryData.page.totalPages}
              currentPage={financialHistoryData.page.number}
              className={styles['default-pagination-wrapper']}
            />
          </>
        )}

      {!isFetchingPaymentHistory &&
        financialHistoryData &&
        financialHistoryData.content.length < 1 && (
          <NothingToShowInformation
            message="Nothing to show here yet."
            className={styles['nothing-to-show-information']}
          />
        )}
    </>
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
  } else if (
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.welcomeBonus
  ) {
    operationString = 'Welcome Bonus';
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
  } else if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.pending) {
    operationStatusString = 'Pending';
  } else if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.expired) {
    operationStatusString = 'Expired';
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
  } else if (
    operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.fail ||
    operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.expired
  ) {
    operationStatusClassname = 'negative';
  } else if (operationStatus == PAYMENT_HISTORY_OPERATION_STATUS_ENUM.pending) {
    operationStatusClassname = 'neutral';
  } else {
    operationStatusClassname = 'Error';
  }

  return operationStatusClassname;
};

const getPaymentHistoryAmountClassname = (
  operationType: PaymentHistoryOperationType
): string => {
  let amountClassname;
  if (
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundRefund ||
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundWithdrawal ||
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletTopUp ||
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.welcomeBonus
  ) {
    amountClassname = 'positive';
  } else if (
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundDeposit ||
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.fundPayment ||
    operationType == PAYMENT_HISTORY_OPERATION_TYPE_ENUM.walletWithdrawal
  ) {
    amountClassname = 'negative';
  } else {
    amountClassname = 'Error';
  }

  return amountClassname;
};

type PaymentHistoryTableRowProps = {
  record: PagedModelFinancialOperationResponseDto;
};

function PaymentHistoryTableRow({ record }: PaymentHistoryTableRowProps) {
  const operationString = getPaymentHistoryOperationString(
    record.operation_type
  );
  const operationStatusString = getPaymentHistoryOperationStatusString(
    record.operation_status
  );
  const operationStatusClassname = getPaymentHistoryOperationStatusClassname(
    record.operation_status
  );
  const amountClassname = getPaymentHistoryAmountClassname(
    record.operation_type
  );
  const recordDate =
    record.processed_at != null ? record.processed_at : record.started_at;
  const amount =
    typeof record.amount_in_cents == 'number'
      ? record.amount_in_cents / 100
      : 'Unknown';

  return (
    <tr className={styles['history-table__row']}>
      <td className={styles['history-table__cell']}>
        {formatEventLogDate(recordDate)}
      </td>
      <td
        className={clsx(
          styles['history-table__cell'],
          styles['history-table__cell--amount'],
          styles[`history-table__cell--${amountClassname}`]
        )}
      >
        {amount} PLN
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
