import styles from './CreatedFundsPage.module.scss';
import clsx from 'clsx';
import {
  Ticket,
  TicketCheck,
  TicketX,
  HeartHandshake,
  Baby,
  User,
  Clock,
} from 'lucide-react';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { useEffect, useState } from 'react';
import { EventLogRecord } from '@components/EventLogRecord';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useSearchParams,
} from 'react-router-dom';
import { FUND_STATUS_ENUM, type FundStatusType } from '@lib/constants';
import { ModalTemplate } from '@components/ModalTemplate';
import { FundInfoModal } from '@components/FundInfoModal';
import type { CreatedFundsLoaderData } from '@routes/createdFunds.route';
import axiosInstance from '@services/axiosInstance';
import type { PageableResponseDTO } from '@dtos/_PageableResponseDTO';
import type { PagedModelFundLogViewDto } from '@dtos/PagedModelFundLogViewDto';
import { Pagination } from '@components/Pagination';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import { EventLogRecordSkeleton } from '@components/EventLogRecordSkeleton';
import { isParamChanging } from '@lib/utils';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';

export function CreatedFundsPage() {
  const createdFundsLoaderData = useLoaderData() as CreatedFundsLoaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateFundModalOpen, setIsCreateFundModalOpen] =
    useState<boolean>(false);
  const treasurerClasses = createdFundsLoaderData.treasurerClasses;
  const [currentSchoolClass, setCurrentSchoolClass] =
    useState<SchoolClassResponseDto | null>(
      treasurerClasses && treasurerClasses[0]
    );
  const [currentFundStatus, setCurrentFundStatus] = useState<FundStatusType>(
    FUND_STATUS_ENUM.active
  );

  const handleFundStatusChange = (newFundStatusType: FundStatusType) => {
    setCurrentFundStatus(newFundStatusType);
    searchParams.delete('logsPage');
    setSearchParams(searchParams, {
      replace: true,
    });
  };

  const handleSchoolClassChange = (newSchoolClassId: string) => {
    if (!treasurerClasses) return;

    handleFundStatusChange(FUND_STATUS_ENUM.active);

    const schoolClassResponseDto = treasurerClasses.find(
      (schoolClass) => schoolClass.school_class_id == newSchoolClassId
    );
    if (!schoolClassResponseDto) {
      setCurrentSchoolClass(treasurerClasses[0]);
      return;
    }

    setCurrentSchoolClass(schoolClassResponseDto);
  };

  const handleCancelCreateFundModal = () => {
    setIsCreateFundModalOpen(false);
  };

  const handleConfirmCreateFundModal = () => {
    setIsCreateFundModalOpen(false);
  };

  return (
    <>
      <div className={styles['page']}>
        {!treasurerClasses && (
          <NothingToShowInformation message="You are not a treasurer in any of your classes" />
        )}

        {treasurerClasses && (
          <div className={styles['grid-container']}>
            <div className={styles['grid-container__classes']}>
              {treasurerClasses.map((schoolClass) => {
                return (
                  <ClassButton
                    schoolClassId={schoolClass.school_class_id}
                    name={`${schoolClass.school_class_name} (${schoolClass.school_class_year})`}
                    changeSchoolClass={handleSchoolClassChange}
                    active={
                      schoolClass.school_class_id ==
                      currentSchoolClass?.school_class_id
                    }
                  />
                );
              })}
            </div>
            <button
              className={styles['grid-container__create-fund']}
              onClick={() => {
                setIsCreateFundModalOpen(true);
              }}
            >
              Create fund
            </button>
            <div className={styles['grid-container__fund-list']}>
              <FundListTopBar
                currentFundStatus={currentFundStatus}
                handleFundStatusChange={handleFundStatusChange}
              />
              <div className={styles['fund-list__container']}>
                <FundTile />
                <FundTile />
              </div>
            </div>
            <div className={styles['grid-container__class-info']}>
              <ClassInfo />
            </div>
            <div className={styles['grid-container__event-log']}>
              <EventLog
                currentFundStatus={currentFundStatus}
                currentSchoolClassId={
                  currentSchoolClass?.school_class_id ?? null
                }
              />
            </div>
          </div>
        )}
      </div>
      <ModalTemplate
        isOpen={isCreateFundModalOpen}
        onOverlayClick={handleCancelCreateFundModal}
      >
        <FundInfoModal
          type="create"
          onClose={handleCancelCreateFundModal}
          onConfirm={handleConfirmCreateFundModal}
          classesData={createdFundsLoaderData.treasurerClasses}
        />
      </ModalTemplate>
    </>
  );
}

type ClassButtonProps = {
  schoolClassId: string;
  name: string;
  changeSchoolClass: (newSchoolClassId: string) => void;
  active?: boolean;
};

function ClassButton({
  schoolClassId,
  name,
  changeSchoolClass,
  active = false,
}: ClassButtonProps) {
  return (
    <button
      className={clsx(
        styles['classes__button'],
        active && styles['classes__button--active']
      )}
      onClick={() => {
        changeSchoolClass(schoolClassId);
      }}
    >
      {name}
    </button>
  );
}

type FundListTopBarProps = {
  currentFundStatus: FundStatusType;
  handleFundStatusChange: (newFundStatusType: FundStatusType) => void;
};

function FundListTopBar({
  currentFundStatus,
  handleFundStatusChange,
}: FundListTopBarProps) {
  return (
    <div className={styles['fund-list__top-bar']}>
      <div
        className={clsx(
          styles['top-bar__funds-type-button'],
          currentFundStatus == FUND_STATUS_ENUM.active &&
            styles['top-bar__funds-type-button--active']
        )}
        onClick={() => {
          handleFundStatusChange(FUND_STATUS_ENUM.active);
        }}
      >
        <Ticket />
        <span>Active</span>
      </div>

      <div
        className={clsx(
          styles['top-bar__funds-type-button'],
          currentFundStatus == FUND_STATUS_ENUM.cancelled &&
            styles['top-bar__funds-type-button--active']
        )}
        onClick={() => {
          handleFundStatusChange(FUND_STATUS_ENUM.cancelled);
        }}
      >
        <TicketX />
        <span>Cancelled</span>
      </div>

      <div
        className={clsx(
          styles['top-bar__funds-type-button'],
          currentFundStatus == FUND_STATUS_ENUM.finished &&
            styles['top-bar__funds-type-button--active']
        )}
        onClick={() => {
          handleFundStatusChange(FUND_STATUS_ENUM.finished);
        }}
      >
        <TicketCheck />
        <span>Finished</span>
      </div>

      <div
        className={clsx(
          styles['top-bar__funds-type-button'],
          currentFundStatus == FUND_STATUS_ENUM.scheduled &&
            styles['top-bar__funds-type-button--active']
        )}
        onClick={() => {
          handleFundStatusChange(FUND_STATUS_ENUM.scheduled);
        }}
      >
        <Clock />
        <span>Scheduled</span>
      </div>
    </div>
  );
}

function FundTile() {
  const navigate = useNavigate();

  return (
    <div className={styles['fund-tile']}>
      <img
        src={defaultFundPhoto}
        alt="fund photo"
        className={styles['fund-tile__photo']}
      />
      <div className={styles['fund-tile__details']}>
        <div className={styles['details__top']}>
          <div>
            <h2 className={styles['fund-title']}>Theater trip</h2>
            <p className={styles['fund-description']}>
              After the play ends, the theater will self-ignite in an act of
              despair and dramatic events.
            </p>
          </div>
          <div>
            <span>Funds available</span>
            <h2>24 PLN</h2>
          </div>
        </div>
        <HorizontalProgressBar
          type="date"
          title="Time"
          start="23.11.2025"
          end="30.11.2025"
          textStart="Created:"
          textEnd="Due to:"
        />
        <HorizontalProgressBar
          type="numeric"
          title="Budget"
          start={0}
          end={240}
          current={24}
          textStart="Raised:"
          textEnd="Goal:"
        />
        <div className={styles['details__actions-bar']}>
          <button className={styles['actions-bar__withdraw']}>
            Withdraw money
          </button>
          <button
            className={styles['actions-bar__more-info']}
            onClick={() => {
              navigate('/funds/fund');
            }}
          >
            More info
          </button>
        </div>
      </div>
    </div>
  );
}

function ClassInfo() {
  return (
    <>
      <div className={styles['class-info__top-row']}>
        <div>
          <span>Class</span>
          <h2>3C 20/21</h2>
        </div>
        <div>
          <span>Historical funds</span>
          <h2>21090 PLN</h2>
        </div>
      </div>
      <div className={styles['class-info__bottom-row']}>
        <div>
          <span>Kids</span>
          <div>
            <h2>21</h2>
            <Baby />
          </div>
        </div>
        <div>
          <span>Parents</span>
          <div>
            <h2>19</h2>
            <User />
          </div>
        </div>
        <div>
          <span>Funds</span>
          <div>
            <h2>32</h2>
            <HeartHandshake />
          </div>
        </div>
      </div>
    </>
  );
}

type EventLogProps = {
  currentFundStatus: FundStatusType;
  currentSchoolClassId: string | null;
};

function EventLog({ currentFundStatus, currentSchoolClassId }: EventLogProps) {
  const [logs, setLogs] =
    useState<PageableResponseDTO<PagedModelFundLogViewDto> | null>(null);
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const location = useLocation();
  const isPaginating = isParamChanging(navigation, location, 'logsPage');

  const currentPage = parseInt(searchParams.get('logsPage') || '0');

  useEffect(() => {
    if (!currentSchoolClassId) return;

    const currentSchoolClassLogs = async () => {
      setIsFetchingLogs(true);

      console.log(currentFundStatus, currentSchoolClassId);

      try {
        const response = await axiosInstance.get(
          `/v1/school-classes/${currentSchoolClassId}/funds/logs`,
          {
            params: {
              fundStatus: currentFundStatus,
              page: currentPage,
              size: 10,
            },
          }
        );

        setLogs(response.data ?? null);
      } catch (error) {
        console.error('Error', error);
        setLogs(null);
      } finally {
        setIsFetchingLogs(false);
      }
    };

    currentSchoolClassLogs();
  }, [currentSchoolClassId, currentFundStatus, currentPage]);

  const isLoading = isFetchingLogs || isPaginating;

  return (
    <>
      <h3 className={styles['event-log__title']}>Event log</h3>

      {isLoading && (
        <EventLogRecordSkeleton skeletonsNumber={10} showFundTitle={true} />
      )}

      {!isLoading && logs && logs.content.length > 0 && (
        <>
          {logs.content.map((fundLog) => {
            return (
              <EventLogRecord
                fundLog={fundLog}
                showFundName={true}
                key={fundLog.timestamp + fundLog.child_full_name}
              />
            );
          })}
          <Pagination
            urlPagesName="logsPage"
            totalPages={logs.page.totalPages}
            currentPage={logs.page.number}
            resetScrollPosition={false}
          />
        </>
      )}

      {!isLoading && logs && logs.content.length < 1 && (
        <NothingToShowInformation
          message="Nothing has happened yet."
          className={styles['event-log__no-logs-info']}
        />
      )}
    </>
  );
}
