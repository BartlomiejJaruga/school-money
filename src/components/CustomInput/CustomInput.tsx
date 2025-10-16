import { useId, useState, type InputHTMLAttributes } from 'react';
import styles from './CustomInput.module.scss';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { Eye, EyeClosed } from 'lucide-react';

type CustomInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'id'
> & {
  name: string;
  id?: string;
  className?: string;
};

export function CustomInput({
  name,
  id,
  type = 'text',
  className,
  ...rest
}: CustomInputProps) {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error('CustomInput should be used inside of FormProvider');
  }

  const [passwordRevealed, setPasswordRevealed] = useState(false);
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  const {
    register,
    formState: { errors },
  } = formContext;
  const registration = register(name);
  const errorMessage = (errors?.[name]?.message ?? '') as string;

  const currentType =
    type === 'password' ? (passwordRevealed ? 'text' : 'password') : type;

  return (
    <>
      <div className={clsx(styles['wrapper'], className ?? '')}>
        <div className={styles['field']}>
          <input
            className={styles['field__input']}
            type={currentType}
            id={inputId}
            {...registration}
            {...rest}
          />
          {type == 'password' && passwordRevealed && (
            <Eye onClick={() => setPasswordRevealed(false)} />
          )}
          {type == 'password' && !passwordRevealed && (
            <EyeClosed onClick={() => setPasswordRevealed(true)} />
          )}
        </div>

        {errorMessage ? (
          <span className={styles['error']}>{errorMessage}</span>
        ) : (
          <span className={styles['error']}>&nbsp;</span>
        )}
      </div>
    </>
  );
}
