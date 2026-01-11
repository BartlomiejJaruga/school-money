import styles from './FundsPage.module.scss';
import { Baby, School } from 'lucide-react';
import clsx from 'clsx';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { FundStatusTile } from '@components/FundStatusTile';
import { CircularProgressBar } from '@components/CircularProgressBar';
import { useState } from 'react';
import { FundTile } from '@components/FundTile';
import { Pagination } from '@components/Pagination';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import type { FundsLoaderData } from '@routes/funds.route';
import { FundTileSkeletonLoader } from '@components/FundTileSkeletonLoader';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import type { PagedModelParentChildHistoryFundResponseDto } from '@dtos/PagedModelParentChildHistoryFundResponseDto';
import { formatISOToDate, isParamChanging } from '@lib/utils';
import { HistoryFundTileSkeletonLoader } from '@components/HistoryFundTileSkeletonLoader';

export function FundsPage() {
  const fundsLoaderData = useLoaderData() as FundsLoaderData;
  const navigation = useNavigation();
  const location = useLocation();
  const isFetchingFunds = isParamChanging(navigation, location, 'fundsPage');
  const isFetchingHistoricalFunds = isParamChanging(
    navigation,
    location,
    'historicalFundsPage'
  );

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__fund-list']}>
            {isFetchingFunds && <FundTileSkeletonLoader skeletonsNumber={3} />}

            {!isFetchingFunds &&
              fundsLoaderData.funds &&
              fundsLoaderData.funds.content.length > 0 && (
                <>
                  {fundsLoaderData.funds.content.map((fundTileInfo) => {
                    return (
                      <FundTile
                        fundData={fundTileInfo}
                        key={
                          fundTileInfo.fund.fund_id +
                          fundTileInfo.child.child_id
                        }
                      />
                    );
                  })}
                  <Pagination
                    urlPagesName="fundsPage"
                    totalPages={fundsLoaderData.funds.page.totalPages}
                    currentPage={fundsLoaderData.funds.page.number}
                  />
                </>
              )}

            {!isFetchingFunds &&
              fundsLoaderData.funds &&
              fundsLoaderData.funds.content.length < 1 && (
                <NothingToShowInformation
                  message="No active funds or you have already paid all of them."
                  className={styles['fund-list__no-funds-info']}
                />
              )}
          </div>
          <div className={styles['grid-container__children']}>
            <ChildrenReportSection />
          </div>
          <div className={styles['grid-container__history']}>
            <h5 className={styles['history__label']}>Historical funds</h5>
            {isFetchingHistoricalFunds && (
              <HistoryFundTileSkeletonLoader skeletonsNumber={5} />
            )}

            {!isFetchingHistoricalFunds &&
              fundsLoaderData.historicalFunds &&
              fundsLoaderData.historicalFunds.content.length > 0 && (
                <>
                  {fundsLoaderData.historicalFunds.content.map(
                    (historicalFundTileInfo) => {
                      return (
                        <HistoryFundTile
                          historicalFundData={historicalFundTileInfo}
                          key={
                            historicalFundTileInfo.fund.fund_id +
                            historicalFundTileInfo.child.child_id
                          }
                        />
                      );
                    }
                  )}
                  <Pagination
                    urlPagesName="historicalFundsPage"
                    totalPages={fundsLoaderData.historicalFunds.page.totalPages}
                    currentPage={fundsLoaderData.historicalFunds.page.number}
                    resetScrollPosition={false}
                  />
                </>
              )}

            {!isFetchingHistoricalFunds &&
              fundsLoaderData.historicalFunds &&
              fundsLoaderData.historicalFunds.content.length < 1 && (
                <NothingToShowInformation
                  message="No active funds or you have already paid all of them."
                  className={styles['fund-list__no-funds-info']}
                />
              )}
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

type HistoryFundTileProps = {
  historicalFundData: PagedModelParentChildHistoryFundResponseDto;
};

function HistoryFundTile({ historicalFundData }: HistoryFundTileProps) {
  const navigate = useNavigate();
  const childNames = `${historicalFundData.child.first_name} ${historicalFundData.child.last_name}`;
  const childSchoolClass = `${historicalFundData.fund.school_class.school_class_name} (${historicalFundData.fund.school_class.school_class_year})`;

  return (
    <div className={styles['history-fund-tile']}>
      <img
        src={defaultFundPhoto}
        alt="fund photo"
        className={styles['history-fund-tile__photo']}
      />
      <div className={styles['history-fund-tile__details']}>
        <h2 className={styles['details__fund-title']}>
          {historicalFundData.fund.title}
        </h2>
        <div className={styles['details__fund-child']}>
          <Baby />
          <span>{childNames}</span>
        </div>
        <div className={styles['details__fund-child-class']}>
          <School />
          <span>{childSchoolClass}</span>
        </div>
        <span>{`Created: ${formatISOToDate(historicalFundData.fund.starts_at)}`}</span>
        <span>{`Due to: ${formatISOToDate(historicalFundData.fund.ends_at)}`}</span>
      </div>
      <div className={styles['history-fund-tile__info']}>
        <FundStatusTile
          status={historicalFundData.child_status}
          className={styles['info__fund-status']}
        />
        <CircularProgressBar
          percent={historicalFundData.fund.fund_progress.progress_percentage}
          className={styles['info__payment-percent']}
        />
        <button
          className={styles['info__more-info']}
          onClick={() => {
            navigate('/funds/fund');
          }}
        >
          More info
        </button>
      </div>
    </div>
  );
}
