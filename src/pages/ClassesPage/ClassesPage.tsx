import styles from './ClassesPage.module.scss';
import { MoveRight } from 'lucide-react';
import defaultUserImage from '@assets/default-user.png';
import { useNavigate } from 'react-router-dom';

export function ClassesPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__classes-list']}>
            <ClassTile />
            <ClassTile />
          </div>
          <div className={styles['grid-container__create-class']}>
            <button>Create new class</button>
          </div>
        </div>
      </div>
    </>
  );
}

function ClassTile() {
  const navigate = useNavigate();

  return (
    <div className={styles['class-tile']}>
      <div className={styles['class-tile__main-info']}>
        <h2>3C 20/21</h2>
        <span>Kids: 21</span>
        <span>Active funds: 3</span>
      </div>
      <div className={styles['class-tile__right-side']}>
        <div className={styles['right-side__treasurer-card']}>
          <h5 className={styles['treasurer-card__label']}>Treasurer</h5>
          <div className={styles['treasurer']}>
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
        </div>
        <button
          className={styles['right-side__go-to-class-btn']}
          onClick={() => {
            navigate('/classes/class');
          }}
        >
          Go to class
          <MoveRight />
        </button>
      </div>
    </div>
  );
}
