import styles from './ProfilePage.module.scss';

export function ProfilePage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__avatar']}>Avatar</div>
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
