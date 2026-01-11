import styles from './CreatedFundsPage.module.scss';
import clsx from 'clsx';
import {
  Ticket,
  TicketCheck,
  TicketX,
  HeartHandshake,
  Baby,
  User,
} from 'lucide-react';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { useState } from 'react';
import { EventLogRecord } from '@components/EventLogRecord';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { FUND_OPERATION_TYPE_ENUM } from '@lib/constants';
import { ModalTemplate } from '@components/ModalTemplate';
import { FundInfoModal } from '@components/FundInfoModal';
import type { CreatedFundsLoaderData } from '@routes/createdFunds.route';

export function CreatedFundsPage() {
  const createdFundsLoaderData = useLoaderData() as CreatedFundsLoaderData;
  const [isCreateFundModalOpen, setIsCreateFundModalOpen] = useState(false);

  const handleCancelCreateFundModal = () => {
    setIsCreateFundModalOpen(false);
  };

  const handleConfirmCreateFundModal = () => {
    setIsCreateFundModalOpen(false);
  };

  return (
    <>
      <div className={styles['page']}>
        {/* <NothingToShowInformation message="You are not a treasurer in any of your classes"/> */}
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__classes']}>
            <ClassButton name="1A 22/23" active={true} />
            <ClassButton name="3C 20/21" />
            <ClassButton name="4B 19/20" />
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
            <FundListTopBar />
            <div className={styles['fund-list__container']}>
              <FundTile />
              <FundTile />
            </div>
          </div>
          <div className={styles['grid-container__class-info']}>
            <ClassInfo />
          </div>
          <div className={styles['grid-container__event-log']}>
            <EventLog />
          </div>
        </div>
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
  name: string;
  active?: boolean; // when connecting to backend change this
};

function ClassButton({ name, active = false }: ClassButtonProps) {
  const [isActive, setIsActive] = useState(active);

  return (
    <button
      className={clsx(
        styles['classes__button'],
        isActive && styles['classes__button--active']
      )}
      onClick={() => setIsActive(!isActive)}
    >
      {name}
    </button>
  );
}

function FundListTopBar() {
  return (
    <div className={styles['fund-list__top-bar']}>
      <div className={styles['top-bar__funds-summary']}>
        <span>Total funds available</span>
        <h2>2100 PLN</h2>
        <span>in 10 funds</span>
      </div>
      <div
        className={clsx(
          styles['top-bar__funds-type-button'],
          styles['top-bar__funds-type-button--active']
        )}
      >
        <Ticket />
        <span>Active</span>
      </div>
      <div className={styles['top-bar__funds-type-button']}>
        <TicketX />
        <span>Refunded</span>
      </div>
      <div className={styles['top-bar__funds-type-button']}>
        <TicketCheck />
        <span>Finished</span>
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

function EventLog() {
  return (
    <>
      <h3 className={styles['event-log__title']}>Event log</h3>
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.payment,
          date: '2025-11-27',
        }}
        showFundName={true}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.refund,
          date: '2025-11-24',
        }}
        showFundName={true}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.deposit,
          date: '2025-11-23',
        }}
        showFundName={true}
      />
      <EventLogRecord
        fundOperationDTO={{
          fundOperationId: '1',
          amountInCents: 2400,
          currency: 'PLN',
          operationType: FUND_OPERATION_TYPE_ENUM.withdrawal,
          date: '2025-11-23',
        }}
        showFundName={true}
      />
    </>
  );
}
