import styles from './FundsPage.module.scss';
import { Baby } from 'lucide-react';
import clsx from 'clsx';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { FUND_STATUS_ENUM } from '@lib/constants';
import { FundStatusTile } from '@components/FundStatusTile';
import { CircularProgressBar } from '@components/CircularProgressBar';
import { useState } from 'react';
import { FundTile } from '@components/FundTile';
import { FundsPagination } from '@components/FundsPagination';

export function FundsPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__fund-list']}>
            <FundTile />
            <FundTile />
            <FundsPagination />
          </div>
          <div className={styles['grid-container__children']}>
            <ChildrenReportSection />
          </div>
          <div className={styles['grid-container__history']}>
            <h5 className={styles['history__label']}>Historical funds</h5>
            <HistoryFundTile />
            <HistoryFundTile />
            <HistoryFundTile />
          </div>
        </div>
      </div>
    </>
  );
}

function ChildrenReportSection() {
  return (
    <div className={styles['children-report']}>
      <div className={styles['children-report__left-col']}>
        <div className={styles['left-col__scrollbar-container']}>
          <ChildrenReportTile selected={true} />
          <ChildrenReportTile selected={false} />
          <ChildrenReportTile selected={false} />
          <ChildrenReportTile selected={false} />
        </div>
      </div>
      <div className={styles['children-report__right-col']}>
        <div className={styles['right-col__summary']}>
          <span>Total spend</span>
          <span>1210.00 PLN</span>
          <span>Refunds</span>
          <span>210.00 PLN</span>
          <span>Summary cost</span>
          <span>1000.00 PLN</span>
        </div>
        <button className={styles['right-col__generate-report']}>
          Generate report
        </button>
      </div>
    </div>
  );
}

type ChildrenReportTileProps = {
  selected: boolean;
};

function ChildrenReportTile({ selected }: ChildrenReportTileProps) {
  const [isSelected, setIsSelected] = useState<boolean>(selected);

  return (
    <div
      className={clsx(
        styles['child-tile'],
        isSelected && styles['child-tile--selected']
      )}
      onClick={(e) => {
        e.stopPropagation();
        setIsSelected(!isSelected);
      }}
    >
      <h3 className={styles['child-tile__name']}>John Millers</h3>
      <h3 className={styles['child-tile__class']}>3C 18/19</h3>
      <div className={styles['child-tile__details']}>
        <span>Spend</span>
        <span>670 PLN</span>
        <span>Funds</span>
        <span>11</span>
      </div>
      <h6 className={styles['child-tile__info-to-click']}>Click to select</h6>
    </div>
  );
}

function HistoryFundTile() {
  return (
    <div className={styles['history-fund-tile']}>
      <img
        src={defaultFundPhoto}
        alt="fund photo"
        className={styles['history-fund-tile__photo']}
      />
      <div className={styles['history-fund-tile__details']}>
        <h2 className={styles['details__fund-title']}>Museum trip</h2>
        <div className={styles['details__fund-child']}>
          <Baby />
          <span>John Millers 3C 18/19</span>
        </div>
        <span>Created: 01.10.2025</span>
        <span>Due to: 08.10.2025</span>
      </div>
      <div className={styles['history-fund-tile__info']}>
        <FundStatusTile
          status={FUND_STATUS_ENUM.paid}
          className={styles['info__fund-status']}
        />
        <CircularProgressBar
          percent={75}
          className={styles['info__payment-percent']}
        />
        <button className={styles['info__more-info']}>More info</button>
      </div>
    </div>
  );
}
