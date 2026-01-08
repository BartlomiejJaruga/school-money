import styles from './FundTile.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import type { FundResponseDTO } from '@dtos/FundResponseDto';
import { Baby, BanknoteX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FundTileProps = {
  fundData: FundResponseDTO;
  showBudget?: boolean;
};

export function FundTile({ fundData, showBudget = false }: FundTileProps) {
  const navigate = useNavigate();
  const amountPerChild = Number(
    (fundData.amount_per_child_in_cents / 100).toFixed(0)
  );

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
            <h2 className={styles['fund-title']}>{fundData.title}</h2>
            <div className={styles['fund-child']}>
              <Baby />
              <span>John Millers 3C 18/19</span>
            </div>
          </div>
          <div>
            <h2>{`${amountPerChild} PLN`}</h2>
          </div>
        </div>
        <p className={styles['details__description']}>{fundData.description}</p>
        <HorizontalProgressBar
          type="date"
          title="Time"
          start={fundData.starts_at}
          end={fundData.ends_at}
          textStart="Created:"
          textEnd="Due to:"
          className={styles['details__time']}
        />
        {showBudget && (
          <HorizontalProgressBar
            type="numeric"
            title="Bugdet"
            start={0}
            current={fundData.fund_progress}
            end={amountPerChild * 6}
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
          <button className={styles['actions-bar__reject']}>
            <BanknoteX />
          </button>
        </div>
      </div>
    </div>
  );
}
