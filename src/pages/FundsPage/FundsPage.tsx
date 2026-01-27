import styles from './FundsPage.module.scss';
import { Baby, FileChartColumn, School } from 'lucide-react';
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
import type { ChildWithSchoolClassInfoResponseDto } from '@dtos/ChildWithSchoolClassInfoResponseDto';
import axiosInstance from '@services/axiosInstance';

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
                        showBudget={true}
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
            <ChildrenReportSection
              parentsChildren={fundsLoaderData.parentsChildren}
            />
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

type ChildrenReportSectionProps = {
  parentsChildren: ChildWithSchoolClassInfoResponseDto[] | null;
};

function ChildrenReportSection({
  parentsChildren,
}: ChildrenReportSectionProps) {
  const [currentlySelectedChildId, setCurrentlySelectedChildId] =
    useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  const handleFundReportDownload = async () => {
    if (!currentlySelectedChildId) return;

    try {
      setIsGeneratingReport(true);
      const response = await axiosInstance.get(
        `/v1/children/${currentlySelectedChildId}/report`,
        {
          responseType: 'blob',
        }
      );

      const today = new Date();
      const formattedToday = formatISOToDate(today.toISOString());

      const contentDisposition = response.headers['content-disposition'];
      let fileName = `Report-${currentlySelectedChildId}-${formattedToday}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsGeneratingReport(false);
    } catch (error) {
      console.error('Error:', error);
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className={styles['children-report']}>
      <div className={styles['children-report__left-col']}>
        <div className={styles['left-col__scrollbar-container']}>
          {parentsChildren &&
            parentsChildren.map((child) => {
              return (
                <ChildrenReportTile
                  childData={child}
                  currentlySelectedChildId={currentlySelectedChildId}
                  setCurrentlySelectedChild={setCurrentlySelectedChildId}
                  key={child.child_id}
                />
              );
            })}
        </div>
      </div>
      <div className={styles['children-report__right-col']}>
        <div className={styles['right-col__summary']}>
          <span>Total spend</span>
          <span>0.00 PLN</span>
          <span>Refunds</span>
          <span>0.00 PLN</span>
          <span>Summary cost</span>
          <span>0.00 PLN</span>
        </div>
        <button
          className={styles['right-col__generate-report']}
          onClick={handleFundReportDownload}
          disabled={isGeneratingReport}
        >
          <FileChartColumn />
          Generate report
        </button>
      </div>
    </div>
  );
}

type ChildrenReportTileProps = {
  childData: ChildWithSchoolClassInfoResponseDto;
  currentlySelectedChildId: string;
  setCurrentlySelectedChild: (childId: string) => void;
};

function ChildrenReportTile({
  childData,
  currentlySelectedChildId,
  setCurrentlySelectedChild,
}: ChildrenReportTileProps) {
  const isSelected = childData.child_id === currentlySelectedChildId;
  const childNames = `${childData.first_name} ${childData.last_name}`;
  const schoolClassName = `${childData?.school_class?.school_class_name ?? 'No class'} (${childData?.school_class?.school_class_year ?? 'year'})`;

  return (
    <div
      className={clsx(
        styles['child-tile'],
        isSelected && styles['child-tile--selected']
      )}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentlySelectedChild(childData.child_id);
      }}
    >
      <h3 className={styles['child-tile__name']}>{childNames}</h3>
      <h3 className={styles['child-tile__class']}>{schoolClassName}</h3>
      <div className={styles['child-tile__details']}>
        <span>Spend</span>
        <span>0 PLN</span>
        <span>Funds</span>
        <span>0</span>
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
            navigate(`/funds/${historicalFundData.fund.fund_id}`, {
              state: {
                childData: {
                  id: historicalFundData.child.child_id,
                  firstName: historicalFundData.child.first_name,
                  lastName: historicalFundData.child.last_name,
                },
              },
            });
          }}
        >
          More info
        </button>
      </div>
    </div>
  );
}
