import { useId, type SelectHTMLAttributes } from 'react';
import styles from './CustomSelect.module.scss';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

export type CustomSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'name' | 'id'
> & {
  name: string;
  id?: string;
  className?: string;
};

export function CustomSelect({
  name,
  id,
  children,
  className,
  ...rest
}: CustomSelectProps) {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error('CustomSelect should be used inside of FormProvider');
  }

  const fallbackId = useId();
  const selectId = id ?? fallbackId;

  const {
    register,
    formState: { errors },
  } = formContext;

  const registration = register(name);
  const errorMessage = (errors?.[name]?.message ?? '') as string;

  return (
    <div className={clsx(styles['wrapper'], className ?? '')}>
      <div
        className={clsx(
          styles['field'],
          errorMessage && styles['field--error']
        )}
      >
        <select
          className={styles['field__select']}
          id={selectId}
          {...registration}
          {...rest}
        >
          {children}
        </select>

        <ChevronDown className={styles['field__icon']} />
      </div>

      {errorMessage ? (
        <span className={styles['error']}>{errorMessage}</span>
      ) : (
        <span className={styles['error']}>&nbsp;</span>
      )}
    </div>
  );
}
