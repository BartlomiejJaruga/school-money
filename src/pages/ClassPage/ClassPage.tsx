import { Baby, MoveLeft, User } from 'lucide-react';
import styles from './ClassPage.module.scss';

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
          <div className={styles['grid-container__fund-list']}>Fund list</div>
          <div className={styles['grid-container__treasurer']}>Treasurer</div>
          <div className={styles['grid-container__class-info']}>
            <ClassInfo />
          </div>
          <div className={styles['grid-container__children']}>Children</div>
        </div>
      </div>
    </>
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
