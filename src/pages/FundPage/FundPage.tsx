import clsx from 'clsx';
import styles from './FundPage.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';

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
  return (
    <>
      <div className={styles['grid-container__top-bar']}>Top bar</div>
      <div className={styles['grid-container__fund-photo']}>
        <img src={defaultFundPhoto} alt="fund photo" />
      </div>
      <div className={styles['grid-container__fund-details']}>Fund details</div>
      <div className={styles['grid-container__fund-cost']}>24 PLN</div>
      <div className={styles['grid-container__child-info']}>Child info</div>
      <div className={styles['grid-container__fund-budget']}>Fund budget</div>
      <div className={styles['grid-container__event-log']}>Event log</div>
      <div className={styles['grid-container__fund-documents']}>
        Fund documents
      </div>
    </>
  );
}

function TreasurerFundPageVariant() {
  return (
    <>
      <div className={styles['grid-container__top-bar']}>Top bar</div>
      <div className={styles['grid-container__fund-photo']}>
        <img src={defaultFundPhoto} alt="fund photo" />
      </div>
      <div className={styles['grid-container__fund-details']}>Fund details</div>
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
