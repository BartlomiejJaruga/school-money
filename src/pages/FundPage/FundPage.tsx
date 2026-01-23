import clsx from 'clsx';
import styles from './FundPage.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';
import defaultUserPhoto from '@assets/default-user.png';
import {
  ArrowDownToLine,
  Baby,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  FileChartColumn,
  FileText,
  FolderArchive,
  Image,
  MoveLeft,
  Pencil,
  School,
  TicketX,
  Trash2,
  User,
  Video,
} from 'lucide-react';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import { CircularProgressBar } from '@components/CircularProgressBar';
import {
  CHILD_FUND_STATUS_ENUM,
  FUND_DOCUMENTS_TYPE_ENUM,
  type ChildFundStatusType,
  type FundDocumentsType,
  type SimpleChildData,
} from '@lib/constants';
import { EventLogRecord } from '@components/EventLogRecord';
import type { FundLoaderData } from '@routes/fund.route';
import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelFundChildStatusResponseDto } from '@dtos/PagedModelFundChildStatusResponseDto';
import { formatISOToDate, isParamChanging } from '@lib/utils';
import { Pagination } from '@components/Pagination';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import type { FundResponseDTO } from '@dtos/FundResponseDto';
import type { PagedModelFundLogViewDto } from '@dtos/PagedModelFundLogViewDto';
import { EventLogRecordSkeleton } from '@components/EventLogRecordSkeleton';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { ChildrenStatusesSkeletonLoader } from '@components/ChildrenStatusesSkeletonLoader';

export function FundPage() {
  const FundLoaderData = useLoaderData() as FundLoaderData;
  const location = useLocation();
  const passedChildData = location.state?.childData as SimpleChildData;
  const childNames =
    passedChildData?.firstName && passedChildData?.lastName
      ? `${passedChildData.firstName} ${passedChildData.lastName}`
      : 'Unknown Unknown';
  const isParentTreasurer = true;

  return (
    <div className={styles['page']}>
      <div className={styles['grid-container']}>
        <FundPageContainer
          fundLoaderData={FundLoaderData}
          isParentTreasurer={isParentTreasurer}
          childNames={childNames}
        />
      </div>
    </div>
  );
}

type FundPageContainerProps = {
  fundLoaderData: FundLoaderData;
  isParentTreasurer: boolean;
  childNames: string;
};

function FundPageContainer({
  fundLoaderData,
  isParentTreasurer,
  childNames,
}: FundPageContainerProps) {
  const navigate = useNavigate();
  const fundBalanceInCents =
    fundLoaderData.fundData?.fund_current_balance_in_cents;
  const fundBalance =
    typeof fundBalanceInCents == 'number'
      ? (fundBalanceInCents / 100).toFixed(2)
      : 'Unknown';

  return (
    <>
      <div className={styles['grid-container__top-bar']}>
        <div className={styles['top-bar__left-side']}>
          <button
            className={styles['top-bar__return']}
            onClick={() => {
              navigate(-1);
            }}
          >
            <MoveLeft />
            Return
          </button>
          <button className={styles['top-bar__generate-report']}>
            <FileChartColumn />
            Generate report
          </button>
        </div>
        <div className={styles['top-bar__right-side']}>
          {isParentTreasurer && (
            <>
              <button className={styles['top-bar__edit']}>
                <Pencil />
                Edit
              </button>
              <button className={styles['top-bar__cancel']}>
                <TicketX />
                Cancel
              </button>
              <button className={styles['top-bar__withdraw']}>
                <BanknoteArrowDown />
                Withdraw
              </button>
              <button className={styles['top-bar__deposit']}>
                <BanknoteArrowUp />
                Deposit
              </button>
            </>
          )}
          <button className={styles['top-bar__make-payment']}>
            <BanknoteArrowUp />
            Make payment
          </button>
          <button className={styles['top-bar__reject']}>
            <BanknoteX />
            Reject
          </button>
        </div>
      </div>
      <div className={styles['grid-container__fund-photo']}>
        <img src={defaultFundPhoto} alt="fund photo" />
      </div>
      <div className={styles['grid-container__fund-details']}>
        <FundDetails
          fundData={fundLoaderData.fundData}
          schoolClassData={fundLoaderData.schoolClassData}
          childNames={childNames}
        />
      </div>
      <div className={styles['grid-container__available-funds']}>
        <span>Fund balance</span>
        <h2>{`${fundBalance} PLN`}</h2>
      </div>
      <div className={styles['grid-container__event-log']}>
        <EventLog fundLogs={fundLoaderData.fundLogs} />
      </div>
      <div className={styles['grid-container__fund-budget']}>
        <FundBudget
          fundData={fundLoaderData.fundData}
          schoolClassData={fundLoaderData.schoolClassData}
        />
      </div>
      <div className={styles['grid-container__children-info']}>
        <ChildrenInfo childrenStatuses={fundLoaderData.fundChildrenStatuses} />
      </div>
      <div className={styles['grid-container__fund-documents']}>
        <h5 className={styles['fund-documents__label']}>Fund documents</h5>
        <FundDocument
          isParentTreasurer={true}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.image}
        />
        <FundDocument
          isParentTreasurer={true}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.pdf}
        />
        <FundDocument
          isParentTreasurer={true}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.archive}
        />
        <FundDocument
          isParentTreasurer={true}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.video}
        />
        <button className={styles['fund-documents__upload-files']}>
          Upload files
        </button>
      </div>
    </>
  );
}

type FundDetailsProps = {
  fundData: FundResponseDTO | null;
  schoolClassData: SchoolClassResponseDto | null;
  childNames: string;
};

function FundDetails({
  fundData,
  schoolClassData,
  childNames,
}: FundDetailsProps) {
  const title = fundData?.title ?? 'Unknown fund title';
  const schoolClassName =
    schoolClassData?.school_class_name && schoolClassData.school_class_year
      ? `${schoolClassData?.school_class_name} (${schoolClassData.school_class_year})`
      : 'Unknown (Unknown)';
  const description = fundData?.description ?? 'Unknown fund description';
  const startDate = fundData?.starts_at ?? '';
  const endDate = fundData?.ends_at ?? '';

  return (
    <div className={styles['fund-details']}>
      <div>
        <h1 className={styles['fund-details__title']}>{title}</h1>
        <div className={styles['fund-details__child']}>
          <Baby />
          <span>{childNames}</span>
        </div>
        <div className={styles['fund-details__class-name']}>
          <School />
          <span>{schoolClassName}</span>
        </div>
        <p className={styles['fund-details__description']}>{description}</p>
      </div>
      <HorizontalProgressBar
        type="date"
        title="Time"
        start={formatISOToDate(startDate)}
        end={formatISOToDate(endDate)}
        textStart="Created:"
        textEnd="Due to:"
        className={styles['fund-details__time']}
      />
    </div>
  );
}

type FundBudgetProps = {
  fundData: FundResponseDTO | null;
  schoolClassData: SchoolClassResponseDto | null;
};

function FundBudget({ fundData, schoolClassData }: FundBudgetProps) {
  const amountPerChildInCents = fundData?.amount_per_child_in_cents;
  const paidChildrenCount = fundData?.fund_progress?.paid_children_count;
  const amountPerChild =
    typeof amountPerChildInCents == 'number'
      ? Number((amountPerChildInCents / 100).toFixed(2))
      : 'Unknown';
  const raisedMoney =
    typeof paidChildrenCount == 'number' && typeof amountPerChild == 'number'
      ? (paidChildrenCount * amountPerChild).toFixed(2)
      : 'Unknown';
  const fundGoal =
    typeof fundData?.fund_progress?.target_amount_in_cents == 'number'
      ? (fundData.fund_progress.target_amount_in_cents / 100).toFixed(2)
      : 'Unknown';
  const contributorsCount =
    typeof paidChildrenCount == 'number' ? paidChildrenCount : 'Unknown';
  const participantsCount =
    typeof fundData?.fund_progress?.participating_children_count == 'number'
      ? fundData.fund_progress.participating_children_count
      : 'Unknown';
  const ignoredChildrenCount =
    typeof fundData?.fund_progress?.ignored_children_count == 'number'
      ? fundData.fund_progress.ignored_children_count
      : 'Unknown';
  const schoolClassChildrenCount =
    typeof ignoredChildrenCount == 'number' &&
    typeof participantsCount == 'number'
      ? ignoredChildrenCount + participantsCount
      : 'Unknown';
  const schoolClassParentsCount =
    typeof schoolClassData?.number_of_parents == 'number'
      ? schoolClassData.number_of_parents
      : 'Unknown';
  const fundGoalPercent =
    typeof fundData?.fund_progress?.progress_percentage == 'number'
      ? fundData.fund_progress.progress_percentage
      : 0;

  return (
    <>
      <div className={styles['budget-info-tile']}>
        <h5 className={styles['budget-info-tile__label']}>Budget info</h5>
        <div className={styles['budget-info-tile__stats']}>
          <span>Raised:</span>
          <span>{`${raisedMoney} PLN`}</span>
          <span>Goal:</span>
          <span>{`${fundGoal} PLN`}</span>
          <span>Cost per person:</span>
          <span>{`${typeof amountPerChild == 'number' ? amountPerChild.toFixed(2) : amountPerChild} PLN`}</span>
          <span>Contributors:</span>
          <span>{contributorsCount}</span>
          <span>Participants:</span>
          <span>{participantsCount}</span>
        </div>
        <CircularProgressBar
          percent={fundGoalPercent}
          className={styles['budget-info-tile__progress-ring']}
          backgroundClassName={
            styles['budget-info-tile__progress-ring-background']
          }
        />
      </div>

      <div className={styles['budget-participants-tiles']}>
        <div className={styles['budget-participants-tiles__children']}>
          <span>Children</span>
          <div>
            <Baby />
            <h2>{schoolClassChildrenCount}</h2>
          </div>
        </div>
        <div className={styles['budget-participants-tiles__parents']}>
          <span>Parents</span>
          <div>
            <User />
            <h2>{schoolClassParentsCount}</h2>
          </div>
        </div>
      </div>
    </>
  );
}

type EventLogProps = {
  fundLogs: PageableResponseDTO<PagedModelFundLogViewDto> | null;
};

function EventLog({ fundLogs }: EventLogProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isFetchingLogs = isParamChanging(navigation, location, 'logsPage');

  return (
    <>
      <h5 className={styles['event-log__label']}>Event log</h5>
      {isFetchingLogs && <EventLogRecordSkeleton skeletonsNumber={12} />}

      {!isFetchingLogs && fundLogs && fundLogs.content.length > 0 && (
        <>
          {fundLogs.content.map((fundLog) => {
            return (
              <EventLogRecord
                fundLog={fundLog}
                key={fundLog.timestamp + fundLog.child_full_name}
              />
            );
          })}
          <Pagination
            urlPagesName="logsPage"
            totalPages={fundLogs.page.totalPages}
            currentPage={fundLogs.page.number}
          />
        </>
      )}

      {!isFetchingLogs && fundLogs && fundLogs.content.length < 1 && (
        <NothingToShowInformation
          message="Nothing has happened yet."
          className={styles['event-log__no-logs-info']}
        />
      )}
    </>
  );
}

type ChildrenInfoProps = {
  childrenStatuses: PageableResponseDTO<PagedModelFundChildStatusResponseDto> | null;
};

function ChildrenInfo({ childrenStatuses }: ChildrenInfoProps) {
  const navigation = useNavigation();
  const location = useLocation();
  const isFetchingChildrenStatuses = isParamChanging(
    navigation,
    location,
    'childrenStatusPage'
  );

  return (
    <>
      <h5 className={styles['children-info__label']}>Children info</h5>
      {isFetchingChildrenStatuses && (
        <ChildrenStatusesSkeletonLoader skeletonsNumber={10} />
      )}

      {!isFetchingChildrenStatuses &&
        childrenStatuses &&
        childrenStatuses.content.length > 0 && (
          <>
            {childrenStatuses.content.map((childStatusData) => {
              return (
                <ChildrenInfoRow
                  childStatusData={childStatusData}
                  key={childStatusData.child.child_id}
                />
              );
            })}
            <Pagination
              urlPagesName="childrenStatusPage"
              totalPages={childrenStatuses.page.totalPages}
              currentPage={childrenStatuses.page.number}
              resetScrollPosition={false}
            />
          </>
        )}

      {!isFetchingChildrenStatuses &&
        childrenStatuses &&
        childrenStatuses.content.length < 1 && (
          <NothingToShowInformation
            message="No children belong to this fund yet."
            className={styles['event-log__no-children-statuses-info']}
          />
        )}
    </>
  );
}

const getChildrenStatusString = (
  childFundStatus: ChildFundStatusType
): string => {
  let childFundStatusString: string;
  if (childFundStatus == CHILD_FUND_STATUS_ENUM.paid) {
    childFundStatusString = 'Paid';
  } else if (childFundStatus == CHILD_FUND_STATUS_ENUM.unpaid) {
    childFundStatusString = 'Unpaid';
  } else if (childFundStatus == CHILD_FUND_STATUS_ENUM.declined) {
    childFundStatusString = 'Rejected';
  } else {
    childFundStatusString = 'Error';
  }

  return childFundStatusString;
};

const getChildrenStatusClassName = (
  childFundStatus: ChildFundStatusType
): string => {
  let childFundStatusClass: string;
  if (childFundStatus == CHILD_FUND_STATUS_ENUM.paid) {
    childFundStatusClass = 'paid';
  } else if (childFundStatus == CHILD_FUND_STATUS_ENUM.unpaid) {
    childFundStatusClass = 'unpaid';
  } else if (childFundStatus == CHILD_FUND_STATUS_ENUM.declined) {
    childFundStatusClass = 'rejected';
  } else {
    childFundStatusClass = 'error';
  }

  return childFundStatusClass;
};

type ChildrenInfoRowProps = {
  childStatusData: PagedModelFundChildStatusResponseDto;
};

function ChildrenInfoRow({ childStatusData }: ChildrenInfoRowProps) {
  const statusString = getChildrenStatusString(childStatusData.status);
  const statusClassname = getChildrenStatusClassName(childStatusData.status);
  const childNames = `${childStatusData.child.first_name} ${childStatusData.child.last_name}`;

  return (
    <div className={styles['children-info-row']}>
      <div>
        <img
          src={defaultUserPhoto}
          alt="child photo"
          className={styles['children-info-row__image']}
        />
        <span className={styles['children-info-row__names']}>{childNames}</span>
      </div>
      <span
        className={clsx(
          styles['children-info-row__status'],
          styles[`children-info-row__status--${statusClassname}`]
        )}
      >
        {statusString}
      </span>
    </div>
  );
}

type FundDocumentProps = {
  isParentTreasurer?: boolean;
  fileType: FundDocumentsType;
};

function FundDocument({
  isParentTreasurer = false,
  fileType,
}: FundDocumentProps) {
  return (
    <div className={styles['fund-document']}>
      <div className={styles['fund-document__thumbnail']}>
        {fileType == FUND_DOCUMENTS_TYPE_ENUM.image && <Image />}

        {fileType == FUND_DOCUMENTS_TYPE_ENUM.pdf && <FileText />}

        {fileType == FUND_DOCUMENTS_TYPE_ENUM.archive && <FolderArchive />}

        {fileType == FUND_DOCUMENTS_TYPE_ENUM.video && <Video />}
      </div>
      <div className={styles['fund-document__details']}>
        <h4 className={styles['details__title']}>Paragon za autobus</h4>
        <p className={styles['details__desciption']}>
          Paragon za autobus i kawkę dla dzieci
        </p>
      </div>
      <div className={styles['fund-document__actions']}>
        {isParentTreasurer && (
          <>
            <button className={styles['actions__edit']}>
              <Pencil />
            </button>
            <button className={styles['actions__delete']}>
              <Trash2 />
            </button>
          </>
        )}

        {!isParentTreasurer && (
          <button className={styles['actions__download']}>
            <ArrowDownToLine />
          </button>
        )}
      </div>
    </div>
  );
}
