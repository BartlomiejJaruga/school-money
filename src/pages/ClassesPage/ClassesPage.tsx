import styles from './ClassesPage.module.scss';

export function ClassesPage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__classes-list']}>
            Classes list
          </div>
          <div className={styles['grid-container__create-class']}>
            <button>Create new class</button>
          </div>
        </div>
      </div>
    </>
  );
}
