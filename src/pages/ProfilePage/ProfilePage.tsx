import { ImagePlus } from 'lucide-react';
import styles from './ProfilePage.module.scss';
import defaultUserPhoto from '@assets/default-user.png';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import { useFetcher, useRouteLoaderData } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  BasicInfoFormSchema,
  type BasicInfoFormValues,
} from '@schemas/profile/basicInfoForm.schema';
import { PROFILE_FORM_TYPE_ENUM } from '@lib/constants';
import {
  ResetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@schemas/profile/resetPasswordForm.schema';
import type { AsideLayoutData } from '@routes/_authenticated.route';
import { useEffect, useRef, useState } from 'react';

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
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </>
  );
}

function Avatar() {
  const asideLayoutData = useRouteLoaderData('aside-layout') as AsideLayoutData;
  const fetcher = useFetcher();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string>(defaultUserPhoto);

  useEffect(() => {
    if (!asideLayoutData.userAvatar) return;

    const objectUrl = URL.createObjectURL(asideLayoutData.userAvatar);
    setUserAvatarUrl(objectUrl);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asideLayoutData.userAvatar]);

  const handleOverlayClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Accepted formats: .png, .jpg');
      return;
    }

    const formData = new FormData();
    formData.append('avatarFile', file);
    formData.append('formType', PROFILE_FORM_TYPE_ENUM.updateAvatar);

    fetcher.submit(formData, {
      method: 'post',
      action: '/profile',
      encType: 'multipart/form-data',
    });
  };

  return (
    <div className={styles['avatar-wrapper']}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".png, .jpg, .jpeg"
        style={{ display: 'none' }}
      />
      <img
        src={userAvatarUrl}
        alt="avatar photo"
        className={styles['avatar__photo']}
      />
      <div
        className={styles['avatar__overlay']}
        onClick={handleOverlayClick}
        role="button"
        tabIndex={0}
      >
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

function PasswordResetForm() {
  const fetcher = useFetcher();
  const formMethods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: ResetPasswordFormValues) => {
    fetcher.submit(
      { ...values, formType: PROFILE_FORM_TYPE_ENUM.changePasswordForm },
      { method: 'post', action: '/profile' }
    );
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <FormProvider {...formMethods}>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={styles['reset-password-form']}
      >
        <div className={styles['reset-password-form__inputs']}>
          <CustomInputWithLabel
            type="password"
            label="Current password"
            name="currentPassword"
            placeholder="Current password"
            autoComplete="off"
          />
          <CustomInputWithLabel
            type="password"
            label="New password"
            name="newPassword"
            placeholder="New password"
            autoComplete="off"
          />
          <CustomInputWithLabel
            type="password"
            label="Repeat new password"
            name="repeatNewPassword"
            placeholder="Repeat new password"
            autoComplete="off"
          />
        </div>
        <div className={styles['reset-password-form__actions']}>
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
