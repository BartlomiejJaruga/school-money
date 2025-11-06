import {
  CustomInput,
  type CustomInputProps,
} from '@components/CustomInput/CustomInput';
import styles from './CustomInputWithLabel.module.scss';
import { useId } from 'react';

type CustomInputWithLabelProps = CustomInputProps & {
  label: string;
};

export function CustomInputWithLabel({
  label,
  name,
  id,
  ...rest
}: CustomInputWithLabelProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;

  return (
    <>
      <div className={styles['wrapper']}>
        <label htmlFor={inputId} className={styles['label']}>
          {label}
        </label>
        <CustomInput name={name} id={inputId} {...rest} />
      </div>
    </>
  );
}
