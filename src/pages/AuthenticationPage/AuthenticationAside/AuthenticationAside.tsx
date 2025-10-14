import styles from './AuthenticationAside.module.scss';

export function AuthenticationAside() {
  return (
    <>
      <aside className={styles['aside']}>
        <RegisterAside />
        <LoginAside />
      </aside>
    </>
  );
}

function RegisterAside() {
  return (
    <>
      <h2 className={styles['title']}>Create an account</h2>
      <form className={styles['form']}>
        <input name="firstName" />
        <input name="lastName" />
        <input name="email" />
        <input name="password" />
        <input name="rPassword" />
        <button className={styles['form__submit']}>Sign up</button>
      </form>
      <div className={styles['auth-switch']}>
        <span className={styles['auth-switch__text']}>
          Already have an account?
        </span>
        <button className={styles['auth-switch__button']}>Log in</button>
      </div>
    </>
  );
}

function LoginAside() {
  return (
    <>
      <h2 className={styles['title']}>Log in</h2>
      <form className={styles['form']}>
        <input name="email" />
        <input name="password" />
        <button className={styles['form__submit']}>Log in</button>
      </form>
      <div className={styles['auth-switch']}>
        <span className={styles['auth-switch__text']}>
          Don't have an account?
        </span>
        <button className={styles['auth-switch__button']}>Create one</button>
      </div>
    </>
  );
}
