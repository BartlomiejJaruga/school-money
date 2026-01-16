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
  FUND_OPERATION_TYPE_ENUM,
  type ChildFundStatusType,
  type FundDocumentsType,
} from '@lib/constants';
import { EventLogRecord } from '@components/EventLogRecord';
import type { FundLoaderData } from '@routes/fund.route';
import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelFundChildStatusResponseDto } from '@dtos/PagedModelFundChildStatusResponseDto';
import { formatISOToDate, isParamChanging } from '@lib/utils';
import { Pagination } from '@components/Pagination';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import type { FundResponseDTO } from '@dtos/FundResponseDto';

export function FundPage() {
  const FundLoaderData = useLoaderData() as FundLoaderData;
  const isParentTreasurer = true;

  return (
    <div className={styles['page']}>
      <div
        className={clsx(
          styles['grid-container'],
          isParentTreasurer
            ? styles['grid-container--treasurer']
            : styles['grid-container--parent']
        )}
      >
        {isParentTreasurer && (
          <TreasurerFundPageVariant fundLoaderData={FundLoaderData} />
        )}

        {!isParentTreasurer && (
          <ParentFundPageVariant fundLoaderData={FundLoaderData} />
        )}
      </div>
    </div>
  );
}

type ParentFundPageVariantProps = {
  fundLoaderData: FundLoaderData;
};

function ParentFundPageVariant({ fundLoaderData }: ParentFundPageVariantProps) {
  const navigate = useNavigate();

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
        <FundDetails fundData={fundLoaderData.fundData} />
      </div>
      <div className={styles['grid-container__fund-cost']}>24 PLN</div>
      <div className={styles['grid-container__child-info']}>
        <Baby className={styles['child-info__label-icon']} />
        <h3 className={styles['child-info__names']}>John Millers</h3>
        <span className={styles['child-info__class']}>3C 18/19</span>
      </div>
      <div className={styles['grid-container__fund-budget']}>
        <FundBudget fundData={fundLoaderData.fundData} />
      </div>
      <div className={styles['grid-container__event-log']}>
        <EventLog />
      </div>
      <div className={styles['grid-container__fund-documents']}>
        <h5 className={styles['fund-documents__label']}>Fund documents</h5>
        <FundDocument
          isParentTreasurer={false}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.image}
        />
        <FundDocument
          isParentTreasurer={false}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.pdf}
        />
        <FundDocument
          isParentTreasurer={false}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.archive}
        />
        <FundDocument
          isParentTreasurer={false}
          fileType={FUND_DOCUMENTS_TYPE_ENUM.video}
        />
      </div>
    </>
  );
}

type TreasurerFundPageVariantProps = {
  fundLoaderData: FundLoaderData;
};

function TreasurerFundPageVariant({
  fundLoaderData,
}: TreasurerFundPageVariantProps) {
  const navigate = useNavigate();

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
          <button className={styles['top-bar__edit']}>
            <Pencil />
            Edit
          </button>
          <button className={styles['top-bar__cancel']}>
            <TicketX />
            Cancel
          </button>
          <button className={styles['top-bar__deposit']}>
            <BanknoteArrowUp />
            Deposit
          </button>
          <button className={styles['top-bar__withdraw']}>
            <BanknoteArrowDown />
            Withdraw
          </button>
        </div>
      </div>
      <div className={styles['grid-container__fund-photo']}>
        <img src={defaultFundPhoto} alt="fund photo" />
      </div>
      <div className={styles['grid-container__fund-details']}>
        <FundDetails fundData={fundLoaderData.fundData} />
      </div>
      <div className={styles['grid-container__available-funds']}>
        <span>Available funds</span>
        <h2>0 PLN</h2>
      </div>
      <div className={styles['grid-container__event-log']}>
        <EventLog />
      </div>
      <div className={styles['grid-container__fund-budget']}>
        <FundBudget fundData={fundLoaderData.fundData} />
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
};

function FundDetails({ fundData }: FundDetailsProps) {
  const title = fundData?.title ?? 'Unknown fund title';
  const description = fundData?.description ?? 'Unknown fund description';
  const startDate = fundData?.starts_at ?? '';
  const endDate = fundData?.ends_at ?? '';

  return (
    <div className={styles['fund-details']}>
      <div>
        <h1 className={styles['fund-details__title']}>{title}</h1>
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
};

function FundBudget({ fundData }: FundBudgetProps) {
  const amountPerChildInCents = fundData?.amount_per_child_in_cents;
  const paidChildrenCount = fundData?.fund_progress?.paid_children_count;
  const amountPerChild =
    typeof amountPerChildInCents == 'number'
      ? (amountPerChildInCents / 100).toFixed(2)
      : 'Unknown';
  const raisedMoney =
    typeof paidChildrenCount == 'number'
      ? (paidChildrenCount / 100).toFixed(2)
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
  const totalChildrenCount =
    typeof ignoredChildrenCount == 'number' &&
    typeof participantsCount == 'number'
      ? ignoredChildrenCount + participantsCount
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
          <span>{`${amountPerChild} PLN`}</span>
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
            <h2>{totalChildrenCount}</h2>
          </div>
        </div>
        <div className={styles['budget-participants-tiles__parents']}>
          <span>Parents</span>
          <div>
            <User />
            <h2>{'Unknown'}</h2>
          </div>
        </div>
      </div>
    </>
  );
}

function EventLog() {
  return (
    <>
      <h5 className={styles['event-log__label']}>Event log</h5>
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.payment,
          date: '2025-11-27',
        }}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.refund,
          date: '2025-11-24',
        }}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.deposit,
          date: '2025-11-23',
        }}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.withdrawal,
          date: '2025-11-23',
        }}
      />
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
      {/* {isFetchingChildrenStatuses && (
              <ChildrenStatusesSkeletonLoader skeletonsNumber={10} />
            )} */}

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
