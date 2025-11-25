import styles from './FundsPage.module.scss';
import { BanknoteX, MoveLeft, MoveRight, Baby } from 'lucide-react';
import clsx from 'clsx';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import defaultFundPhoto from '@assets/default-fund.jpg';

export function FundsPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__fund-list']}>
            <FundTile />
            <FundTile />
            <div className={styles['pagination']}>
              <button className={styles['pagination__prev']} disabled={true}>
                <MoveLeft />
                Prev
              </button>
              <div className={styles['pagination__pages']}>
                <button
                  className={clsx(
                    styles['pages__page'],
                    styles['pages__page--active']
                  )}
                >
                  1
                </button>
                <button className={styles['pages__page']}>2</button>
                <button className={styles['pages__page']}>3</button>
              </div>
              <button className={styles['pagination__next']}>
                Next
                <MoveRight />
              </button>
            </div>
          </div>
          <div className={styles['grid-container__children']}>children</div>
          <div className={styles['grid-container__history']}>history</div>
        </div>
      </div>
    </>
  );
}

function FundTile() {
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
            <div className={styles['fund-child']}>
              <Baby />
              <span>John Millers 3C 18/19</span>
            </div>
          </div>
          <div>
            <h2>24 PLN</h2>
          </div>
        </div>
        <p className={styles['details__description']}>
          After the play ends, the theater will self-ignite in an act of despair
          and dramatic events.
        </p>
        <HorizontalProgressBar
          type="date"
          title="Time"
          start="23.11.2025"
          end="30.11.2025"
          textStart="Created:"
          textEnd="Due to:"
          className={styles['details__time']}
        />
        <div className={styles['details__actions-bar']}>
          <button className={styles['actions-bar__more-info']}>
            More info
          </button>
          <button className={styles['actions-bar__make-payment']}>
            Make payment
          </button>
          <button className={styles['actions-bar__discard']}>
            <BanknoteX />
          </button>
        </div>
      </div>
    </div>
  );
}
