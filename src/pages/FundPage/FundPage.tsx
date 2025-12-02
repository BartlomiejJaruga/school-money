import clsx from 'clsx';
import styles from './FundPage.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';
import {
  Baby,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  FileChartColumn,
  MoveLeft,
  Pencil,
  TicketX,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';

export function FundPage() {
  const isParentTreasurer = false;

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
        {isParentTreasurer && <TreasurerFundPageVariant />}

        {!isParentTreasurer && <ParentFundPageVariant />}
      </div>
    </div>
  );
}

function ParentFundPageVariant() {
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
        <FundDetails />
      </div>
      <div className={styles['grid-container__fund-cost']}>24 PLN</div>
      <div className={styles['grid-container__child-info']}>
        <Baby className={styles['child-info__label-icon']} />
        <h3 className={styles['child-info__names']}>John Millers</h3>
        <span className={styles['child-info__class']}>3C 18/19</span>
      </div>
      <div className={styles['grid-container__fund-budget']}>Fund budget</div>
      <div className={styles['grid-container__event-log']}>Event log</div>
      <div className={styles['grid-container__fund-documents']}>
        Fund documents
      </div>
    </>
  );
}

function TreasurerFundPageVariant() {
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
        <FundDetails />
      </div>
      <div className={styles['grid-container__available-funds']}>
        Available funds
      </div>
      <div className={styles['grid-container__event-log']}>Event log</div>
      <div className={styles['grid-container__fund-budget']}>Fund budget</div>
      <div className={styles['grid-container__children-info']}>
        Children info
      </div>
      <div className={styles['grid-container__fund-documents']}>
        Fund documents
      </div>
    </>
  );
}

function FundDetails() {
  return (
    <div className={styles['fund-details']}>
      <div>
        <h1 className={styles['fund-details__title']}>Theater trip</h1>
        <p className={styles['fund-details__description']}>
          After the final words, the theater will self-ignite in an act of
          despair and dramatic defiance, leaving only glowing ashes as a
          monument to the performance that once was.
        </p>
      </div>
      <HorizontalProgressBar
        type="date"
        title="Time"
        start="23.11.2025"
        end="07.12.2025"
        textStart="Created:"
        textEnd="Due to:"
        className={styles['fund-details__time']}
      />
    </div>
  );
}
