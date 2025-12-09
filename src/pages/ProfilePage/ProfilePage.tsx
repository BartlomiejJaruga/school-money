import { ImagePlus } from 'lucide-react';
import styles from './ProfilePage.module.scss';
import defaultUserPhoto from '@assets/default-user.png';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import { useFetcher } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BasicInfoFormSchema,
  type BasicInfoFormValues,
} from '@schemas/profile/basicInfoForm.schema';
import { PROFILE_FORM_TYPE_ENUM } from '@lib/constants';

export function ProfilePage() {
  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__avatar']}>
            <Avatar />
          </div>
          <div className={styles['grid-container__basic-info-form']}>
            <BasicInfoForm />
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

function BasicInfoForm() {
  const userData = {
    firstName: 'Andrew',
    lastName: 'Smith',
    emailAddress: 'andrew.smith@gmail.com',
  };
  const fetcher = useFetcher();
  const formMethods = useForm<BasicInfoFormValues>({
    resolver: zodResolver(BasicInfoFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: userData?.firstName ?? '',
      lastName: userData?.lastName ?? '',
      emailAddress: userData?.emailAddress ?? '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: BasicInfoFormValues) => {
    fetcher.submit(
      { ...values, formType: PROFILE_FORM_TYPE_ENUM.basicInfoForm },
      { method: 'post', action: '/profile' }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <FormProvider {...formMethods}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={styles['basic-info-form']}
      >
        <div className={styles['basic-info-form__names']}>
          <CustomInputWithLabel
            label="First name"
            name="firstName"
            placeholder="First name"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Last name"
            name="lastName"
            placeholder="Last name"
            autoComplete="off"
          />
        </div>
        <CustomInputWithLabel
          label="Email address"
          name="emailAddress"
          placeholder="Email address"
          autoComplete="off"
        />
        <div className={styles['basic-info-form__actions']}>
          <button
            type="button"
            className={styles['actions__cancel']}
            onClick={() => reset()}
            disabled={busy}
          >
            Cancel
          </button>
          <button className={styles['actions__confirm']} disabled={busy}>
            Confirm
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
