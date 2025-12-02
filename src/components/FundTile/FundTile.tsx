import styles from './FundTile.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import { Baby, BanknoteX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FundTileProps = {
  showBudget?: boolean;
};

export function FundTile({ showBudget = false }: FundTileProps) {
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
        {showBudget && (
          <HorizontalProgressBar
            type="numeric"
            title="Bugdet"
            start={0}
            current={48}
            end={240}
            textStart="Raised:"
            textEnd="Goal:"
            className={styles['details__bugdet']}
          />
        )}
        <div className={styles['details__actions-bar']}>
          <button
            className={styles['actions-bar__more-info']}
            onClick={() => {
              navigate('/funds/fund');
            }}
          >
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
