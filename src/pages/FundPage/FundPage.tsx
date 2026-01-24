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
  X,
} from 'lucide-react';
import {
  useFetcher,
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
import { ModalTemplate } from '@components/ModalTemplate';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import {
  FundEditModalSchema,
  type FundEditModalValues,
} from '@schemas/fund/fundEditModal.schema';
import { ConfirmationModal } from '@components/ConfirmationModal';
import {
  FundWithdrawalModalSchema,
  type FundWithdrawalModalValues,
} from '@schemas/fund/fundWithdrawalModal.schema';
import {
  FundDepositModalSchema,
  type FundDepositModalValues,
} from '@schemas/fund/fundDepositModal.schema';
import axiosInstance from '@services/axiosInstance';

export function FundPage() {
  const fundLoaderData = useLoaderData() as FundLoaderData;
  const fundData = fundLoaderData.fundData;
  const location = useLocation();
  const fetcher = useFetcher();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] =
    useState<boolean>(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isFundCancelModalOpen, setIsFundCancelModalOpen] =
    useState<boolean>(false);
  const passedChildData = location.state?.childData as SimpleChildData;
  const isParentTreasurer = true;

  const isFetcherBusy = fetcher.state != 'idle';

  const handleOpenEditModal = () => {
    if (fundData == null) return;

    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenFundCancelModal = () => {
    if (fundData == null) return;

    setIsFundCancelModalOpen(true);
  };

  const handleCloseFundCancelModal = () => {
    setIsFundCancelModalOpen(false);
  };

  const handleFundCancel = () => {
    if (fundData == null) return;

    fetcher.submit(
      { fundId: fundData.fund_id },
      { method: 'post', action: '/fundCancel' }
    );
  };

  const handleOpenWithdrawalModal = () => {
    if (fundData == null) return;

    setIsWithdrawalModalOpen(true);
  };

  const handleCloseWithdrawalModal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleOpenDepositModal = () => {
    if (fundData == null) return;

    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <FundPageContainer
            fundLoaderData={fundLoaderData}
            isParentTreasurer={isParentTreasurer}
            childData={passedChildData}
            handleOpenEditModal={handleOpenEditModal}
            handleOpenFundCancelModal={handleOpenFundCancelModal}
            handleOpenWithdrawalModal={handleOpenWithdrawalModal}
            handleOpenDepositModal={handleOpenDepositModal}
          />
        </div>
      </div>
      {fundData && (
        <>
          <ModalTemplate
            isOpen={isEditModalOpen}
            onOverlayClick={handleCloseEditModal}
          >
            <EditFundModal
              onClose={handleCloseEditModal}
              onConfirm={handleCloseEditModal}
              fundData={fundData}
            />
          </ModalTemplate>
          <ConfirmationModal
            isOpen={isFundCancelModalOpen}
            onOverlayClick={handleCloseFundCancelModal}
            onCancel={handleCloseFundCancelModal}
            onConfirm={handleFundCancel}
            text={`Are you sure you want to cancel fund ${fundData.title}?`}
            warningSubtext="This operation is irreversible!"
            highlightedPart={`${fundData.title}`}
            isConfirming={isFetcherBusy}
          />
          <ModalTemplate
            isOpen={isWithdrawalModalOpen}
            onOverlayClick={handleCloseWithdrawalModal}
          >
            <WithdrawFundModal
              onClose={handleCloseWithdrawalModal}
              onConfirm={handleCloseWithdrawalModal}
              fundData={fundData}
            />
          </ModalTemplate>
          <ModalTemplate
            isOpen={isDepositModalOpen}
            onOverlayClick={handleCloseDepositModal}
          >
            <DepositFundModal
              onClose={handleCloseDepositModal}
              onConfirm={handleCloseDepositModal}
              fundData={fundData}
            />
          </ModalTemplate>
        </>
      )}
    </>
  );
}

type FundPageContainerProps = {
  fundLoaderData: FundLoaderData;
  isParentTreasurer: boolean;
  childData: SimpleChildData;
  handleOpenEditModal: () => void;
  handleOpenFundCancelModal: () => void;
  handleOpenWithdrawalModal: () => void;
  handleOpenDepositModal: () => void;
};

function FundPageContainer({
  fundLoaderData,
  isParentTreasurer,
  childData,
  handleOpenEditModal,
  handleOpenFundCancelModal,
  handleOpenWithdrawalModal,
  handleOpenDepositModal,
}: FundPageContainerProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const fundBalanceInCents =
    fundLoaderData.fundData?.fund_current_balance_in_cents;
  const fundBalance =
    typeof fundBalanceInCents == 'number'
      ? (fundBalanceInCents / 100).toFixed(2)
      : 'Unknown';
  const childNames =
    childData?.firstName && childData?.lastName
      ? `${childData.firstName} ${childData.lastName}`
      : 'Unknown Unknown';

  const handleFundReportDownload = async () => {
    if (fundLoaderData.fundData == null) return;

    try {
      setIsGeneratingReport(true);
      const response = await axiosInstance.get(
        `/v1/funds/${fundLoaderData.fundData.fund_id}/report`,
        {
          responseType: 'blob',
        }
      );

      const today = new Date();
      const formattedToday = formatISOToDate(today.toISOString());

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Report-${fundLoaderData.fundData.title}-${formattedToday}.pdf`
      );

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

  const handleFundPayment = () => {
    if (fundLoaderData.fundData == null || typeof childData.id !== 'string')
      return;

    fetcher.submit(
      { fundId: fundLoaderData.fundData.fund_id, childId: childData.id },
      { method: 'post', action: '/fundPayment' }
    );
  };

  const handleFundReject = () => {
    if (fundLoaderData.fundData == null || typeof childData.id !== 'string')
      return;

    fetcher.submit(
      { fundId: fundLoaderData.fundData.fund_id, childId: childData.id },
      { method: 'post', action: '/fundReject' }
    );
  };

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
          <button
            className={styles['top-bar__generate-report']}
            onClick={handleFundReportDownload}
            disabled={isGeneratingReport}
          >
            <FileChartColumn />
            Generate report
          </button>
        </div>
        <div className={styles['top-bar__right-side']}>
          {isParentTreasurer && (
            <>
              <button
                className={styles['top-bar__edit']}
                onClick={handleOpenEditModal}
              >
                <Pencil />
                Edit
              </button>
              <button
                className={styles['top-bar__cancel']}
                onClick={handleOpenFundCancelModal}
              >
                <TicketX />
                Cancel
              </button>
              <button
                className={styles['top-bar__withdraw']}
                onClick={handleOpenWithdrawalModal}
              >
                <BanknoteArrowDown />
                Withdraw
              </button>
              <button
                className={styles['top-bar__deposit']}
                onClick={handleOpenDepositModal}
              >
                <BanknoteArrowUp />
                Deposit
              </button>
            </>
          )}
          <button
            className={styles['top-bar__make-payment']}
            onClick={handleFundPayment}
            disabled={fetcher.state != 'idle'}
          >
            <BanknoteArrowUp />
            Make payment
          </button>
          <button
            className={styles['top-bar__reject']}
            onClick={handleFundReject}
            disabled={fetcher.state != 'idle'}
          >
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

type EditFundModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  fundData: FundResponseDTO;
};

function EditFundModal({ onClose, onConfirm, fundData }: EditFundModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<FundEditModalValues>({
    resolver: zodResolver(FundEditModalSchema),
    mode: 'onChange',
    defaultValues: {
      title: fundData.title ?? '',
      description: fundData.description ?? '',
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      onConfirm();
    }
  }, [fetcher.state, fetcher.data]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: FundEditModalValues) => {
    fetcher.submit(
      { fundId: fundData.fund_id, ...values },
      {
        method: 'post',
        action: `/funds/${fundData.fund_id}`,
      }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['fund-edit-modal']}>
      <div className={styles['fund-edit-modal__top']}>
        <h2 className={styles['top__title']}>EDIT FUND</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['fund-edit-modal__form']}
        >
          <div>PHOTO</div>
          <CustomInputWithLabel
            label="Title"
            name="title"
            placeholder="Enter fund title"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Description"
            name="description"
            placeholder="Enter fund description"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

type WithdrawFundModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  fundData: FundResponseDTO;
};

function WithdrawFundModal({
  onClose,
  onConfirm,
  fundData,
}: WithdrawFundModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<FundWithdrawalModalValues>({
    resolver: zodResolver(FundWithdrawalModalSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 0,
      note: '',
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      onConfirm();
    }
  }, [fetcher.state, fetcher.data]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: FundWithdrawalModalValues) => {
    fetcher.submit(
      { fundId: fundData.fund_id, ...values },
      {
        method: 'post',
        action: '/fundWithdrawal',
      }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['fund-withdrawal-modal']}>
      <div className={styles['fund-withdrawal-modal__top']}>
        <h2 className={styles['top__title']}>WITHDRAW MONEY</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['fund-withdrawal-modal__form']}
        >
          <CustomInputWithLabel
            type="number"
            label="Amount"
            name="amount"
            placeholder="Enter amount to withdraw"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Note"
            name="note"
            placeholder="Enter short note for this action"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

type DepositFundModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  fundData: FundResponseDTO;
};

function DepositFundModal({
  onClose,
  onConfirm,
  fundData,
}: DepositFundModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<FundDepositModalValues>({
    resolver: zodResolver(FundDepositModalSchema),
    mode: 'onChange',
    defaultValues: {
      amount: 0,
      note: '',
    },
  });

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      onConfirm();
    }
  }, [fetcher.state, fetcher.data]);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: FundDepositModalValues) => {
    fetcher.submit(
      { fundId: fundData.fund_id, ...values },
      {
        method: 'post',
        action: '/fundDeposit',
      }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['fund-deposit-modal']}>
      <div className={styles['fund-deposit-modal__top']}>
        <h2 className={styles['top__title']}>DEPOSIT MONEY</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['fund-deposit-modal__form']}
        >
          <CustomInputWithLabel
            type="number"
            label="Amount"
            name="amount"
            placeholder="Enter amount to deposited"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Note"
            name="note"
            placeholder="Enter short note for this action"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
