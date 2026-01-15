import styles from './FundTile.module.scss';
import defaultFundPhoto from '@assets/default-fund.jpg';
import { HorizontalProgressBar } from '@components/HorizontalProgressBar';
import type { PagedModelParentChildUnpaidFundResponseDto } from '@dtos/PagedModelParentChildUnpaidFundResponseDto';
import { Baby, BanknoteX, School } from 'lucide-react';
import { useFetcher, useNavigate } from 'react-router-dom';

type FundTileProps = {
  fundData: PagedModelParentChildUnpaidFundResponseDto;
  showBudget?: boolean;
};

export function FundTile({ fundData, showBudget = false }: FundTileProps) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const amountPerChild = Number(
    (fundData.fund.amount_per_child_in_cents / 100).toFixed(0)
  );
  const childNames = `${fundData.child.first_name} ${fundData.child.last_name}`;
  const childSchoolClass = `${fundData.fund.school_class.school_class_name} (${fundData.fund.school_class.school_class_year})`;

  const handleFundPayment = () => {
    fetcher.submit(
      { fundId: fundData.fund.fund_id, childId: fundData.child.child_id },
      { method: 'post', action: '/fundPayment' }
    );
  };

  const handleFundReject = () => {
    fetcher.submit(
      { fundId: fundData.fund.fund_id, childId: fundData.child.child_id },
      { method: 'post', action: '/fundReject' }
    );
  };

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
            <h2 className={styles['fund-title']}>{fundData.fund.title}</h2>
            <div className={styles['fund-child']}>
              <Baby />
              <span>{childNames}</span>
            </div>
            <div className={styles['fund-child-class']}>
              <School />
              <span>{childSchoolClass}</span>
            </div>
          </div>
          <div>
            <h2>{`${amountPerChild} PLN`}</h2>
          </div>
        </div>
        <p className={styles['details__description']}>
          {fundData.fund.description}
        </p>
        <HorizontalProgressBar
          type="date"
          title="Time"
          start={fundData.fund.starts_at}
          end={fundData.fund.ends_at}
          textStart="Created:"
          textEnd="Due to:"
          className={styles['details__time']}
        />
        {showBudget && (
          <HorizontalProgressBar
            type="numeric"
            title="Bugdet"
            start={0}
            current={parseInt(
              (
                fundData.fund.fund_progress.current_amount_in_cents / 100
              ).toFixed(2),
              10
            )}
            end={parseInt(
              (
                amountPerChild *
                fundData.fund.fund_progress.participating_children_count
              ).toFixed(2),
              10
            )}
            textStart="Raised:"
            textEnd="Goal:"
            className={styles['details__bugdet']}
          />
        )}
        <div className={styles['details__actions-bar']}>
          <button
            className={styles['actions-bar__more-info']}
            onClick={() => {
              navigate(`/funds/${fundData.fund.fund_id}`);
            }}
          >
            More info
          </button>
          <button
            className={styles['actions-bar__make-payment']}
            onClick={handleFundPayment}
            disabled={fetcher.state !== 'idle'}
          >
            Make payment
          </button>
          <button
            className={styles['actions-bar__reject']}
            onClick={handleFundReject}
            disabled={fetcher.state !== 'idle'}
          >
            <BanknoteX />
          </button>
        </div>
      </div>
    </div>
  );
}
