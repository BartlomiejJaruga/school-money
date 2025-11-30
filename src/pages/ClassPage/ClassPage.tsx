import { Baby, MoveLeft, User } from 'lucide-react';
import styles from './ClassPage.module.scss';
import { useState } from 'react';
import clsx from 'clsx';
import defaultUserImage from '@assets/default-user.png';
import { FundTile } from '@components/FundTile';
import { FundsPagination } from '@components/FundsPagination';

export function ClassPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__top-bar']}>
            <button className={styles['top-bar__return-btn']}>
              <MoveLeft />
              Return
            </button>
            <button className={styles['top-bar__generate-report-btn']}>
              Generate report
            </button>
            <div className={styles['top-bar__class-name']}>3C 20/21</div>
          </div>
          <div className={styles['grid-container__fund-list']}>
            <FundTile showBudget={true} />
            <FundTile showBudget={true} />
            <FundsPagination />
          </div>
          <div className={styles['grid-container__treasurer']}>
            <h5 className={styles['treasurer__label']}>Treasurer</h5>
            <div className={styles['treasurer__card-and-class-code']}>
              <div className={styles['treasurer__card']}>
                <img
                  className={styles['treasurer__photo']}
                  src={defaultUserImage}
                  alt="treasurer photo"
                />
                <div className={styles['treasurer__info']}>
                  <h4>Andrew Smith</h4>
                  <span>andrew.smith@gmail.com</span>
                </div>
              </div>
              <ClassCode code="12345678" />
            </div>
          </div>
          <div className={styles['grid-container__class-info']}>
            <ClassInfo />
          </div>
          <div className={styles['grid-container__children']}>
            <h5 className={styles['children__label']}>Children</h5>
            <ChildRow />
            <ChildRow />
            <ChildRow />
            <ChildRow />
            <ChildRow />
          </div>
        </div>
      </div>
    </>
  );
}

type ClassCodeProps = {
  code: string;
};

function ClassCode({ code }: ClassCodeProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const revealCode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsRevealed(true);
  };

  return (
    <div className={styles['class-code-tile']}>
      <h5 className={styles['class-code-tile__label']}>Class code</h5>
      <div
        onClick={revealCode}
        className={clsx(
          styles['class-code-tile__code'],
          isRevealed && styles['class-code-tile__code--visible']
        )}
      >
        {isRevealed ? code : 'XXXXXXXX'}
      </div>
    </div>
  );
}

function ClassInfo() {
  return (
    <>
      <div className={styles['class-info__top-row']}>
        <div>
          <span>Historical funds</span>
          <h2>21090 PLN</h2>
        </div>
        <div>
          <span>Funds</span>
          <h2>32</h2>
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
      </div>
    </>
  );
}

function ChildRow() {
  return (
    <div className={styles['child-row']}>
      <div className={styles['child-row__parent']}>
        <img
          src={defaultUserImage}
          alt="parent photo"
          className={styles['parent__photo']}
        />
        <span className={styles['parent__name']}>Nadine Kemmer-Lowe</span>
      </div>
      <span className={styles['child-row__child']}>Herman Pfeffer-Mann</span>
    </div>
  );
}
