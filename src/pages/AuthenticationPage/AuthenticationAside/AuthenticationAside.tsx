import { useFetcher } from 'react-router-dom';
import styles from './AuthenticationAside.module.scss';
import { FormProvider, useForm } from 'react-hook-form';
import {
  type RegisterValues,
  RegisterSchema,
} from '@schemas/auth/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AuthenticationResponse } from '@routes/root.route';
import { LoginSchema, type LoginValues } from '@schemas/auth/login.schema';
import { CustomInput } from '@components/CustomInput';

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
  const fetcher = useFetcher<AuthenticationResponse>();
  const formMethods = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: RegisterValues) => {
    fetcher.submit(
      { ...values, formType: 'register' },
      { method: 'post', action: '/' }
    );
  };

  const busy = isSubmitting || fetcher.state !== 'idle';

  return (
    <>
      <h2 className={styles['title']}>Create an account</h2>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['form']}
        >
          <CustomInput name="firstName" placeholder="First name" />
          <CustomInput name="lastName" placeholder="Last name" />
          <CustomInput name="email" placeholder="Email" />
          <CustomInput name="password" type="password" placeholder="Password" />
          <CustomInput
            name="repeatPassword"
            type="password"
            placeholder="Repeat password"
          />
          <button className={styles['form__submit']} disabled={busy}>
            Sign up
          </button>
        </form>
      </FormProvider>
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
  const fetcher = useFetcher<AuthenticationResponse>();
  const formMethods = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: LoginValues) => {
    fetcher.submit(
      { ...values, formType: 'login' },
      { method: 'post', action: '/' }
    );
  };

  const busy = isSubmitting || fetcher.state !== 'idle';

  return (
    <>
      <h2 className={styles['title']}>Log in</h2>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['form']}
        >
          <CustomInput name="email" placeholder="Email" />
          <CustomInput name="password" type="password" placeholder="Password" />
          <button className={styles['form__submit']} disabled={busy}>
            Log in
          </button>
        </form>
      </FormProvider>
      <div className={styles['auth-switch']}>
        <span className={styles['auth-switch__text']}>
          Don't have an account?
        </span>
        <button className={styles['auth-switch__button']}>Create one</button>
      </div>
    </>
  );
}
