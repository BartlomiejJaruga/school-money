import { ImagePlus } from 'lucide-react';
import styles from './ProfilePage.module.scss';
import defaultUserPhoto from '@assets/default-user.png';

export function ProfilePage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__avatar']}>
            <Avatar />
          </div>
          <div className={styles['grid-container__basic-info-form']}>
            Basic info form
          </div>
          <div className={styles['grid-container__password-form']}>
            Password form
          </div>
        </div>
      </div>
    </>
  );
}

function Avatar() {
  return (
    <div className={styles['avatar-wrapper']}>
      <img
        src={defaultUserPhoto}
        alt="avatar photo"
        className={styles['avatar__photo']}
      />
      <div className={styles['avatar__overlay']}>
        <ImagePlus />
      </div>
    </div>
  );
}
