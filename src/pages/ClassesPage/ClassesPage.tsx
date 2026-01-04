import styles from './ClassesPage.module.scss';
import { MoveRight, X } from 'lucide-react';
import defaultUserImage from '@assets/default-user.png';
import { useFetcher, useLoaderData, useNavigate } from 'react-router-dom';
import type { ClassesLoaderData } from '@routes/classes.route';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { ModalTemplate } from '@components/ModalTemplate';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewClassSchema,
  type NewClassValues,
} from '@schemas/classes/newClass.schema';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import { useState } from 'react';

export function ClassesPage() {
  const classesLoaderData = useLoaderData() as ClassesLoaderData;
  const [isNewClassModalOpen, setIsNewClassModalOpen] =
    useState<boolean>(false);

  const handleCancelChildModal = () => {
    setIsNewClassModalOpen(false);
  };

  const handleOpenChildModal = () => {
    setIsNewClassModalOpen(true);
  };

  const handleConfirmChildModal = () => {
    setIsNewClassModalOpen(false);
  };

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__classes-list']}>
            {classesLoaderData.classes &&
              classesLoaderData.classes.map(
                (schoolClass: SchoolClassResponseDto) => {
                  return (
                    <ClassTile
                      classData={schoolClass}
                      key={schoolClass.school_class_id}
                    />
                  );
                }
              )}
          </div>
          <div className={styles['grid-container__create-class']}>
            <button onClick={handleOpenChildModal}>Create new class</button>
          </div>
        </div>
      </div>
      <ModalTemplate
        isOpen={isNewClassModalOpen}
        onOverlayClick={handleCancelChildModal}
      >
        <CreateNewClassModal
          onClose={handleCancelChildModal}
          onConfirm={handleConfirmChildModal}
        />
      </ModalTemplate>
    </>
  );
}

type ClassTileProps = {
  classData: SchoolClassResponseDto;
};

function ClassTile({ classData }: ClassTileProps) {
  const navigate = useNavigate();

  return (
    <div className={styles['class-tile']}>
      <div className={styles['class-tile__main-info']}>
        <h2>{`${classData.school_class_name} ${classData.school_class_year}`}</h2>
        <span>{`Kids: ${classData.number_of_children}`}</span>
        <span>{`Active funds: ${classData.number_of_active_funds}`}</span>
      </div>
      <div className={styles['class-tile__right-side']}>
        <div className={styles['right-side__treasurer-card']}>
          <h5 className={styles['treasurer-card__label']}>Treasurer</h5>
          <div className={styles['treasurer']}>
            <img
              className={styles['treasurer__photo']}
              src={defaultUserImage}
              alt="treasurer photo"
            />
            <div className={styles['treasurer__info']}>
              <h4>{`${classData.treasurer.first_name} ${classData.treasurer.last_name}`}</h4>
              <span>{classData.treasurer.email}</span>
            </div>
          </div>
        </div>
        <button
          className={styles['right-side__go-to-class-btn']}
          onClick={() => {
            navigate('/classes/class', { state: { classData } });
          }}
        >
          Go to class
          <MoveRight />
        </button>
      </div>
    </div>
  );
}

type CreateNewClassModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

function CreateNewClassModal({ onClose, onConfirm }: CreateNewClassModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<NewClassValues>({
    resolver: zodResolver(NewClassSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: NewClassValues) => {
    fetcher.submit(values, {
      method: 'post',
      action: '/classes',
    });

    onConfirm();
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['new-class-modal']}>
      <div className={styles['new-class-modal__top']}>
        <h2 className={styles['top__title']}>ADD NEW CLASS</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['new-class-modal__form']}
        >
          <CustomInputWithLabel
            label="Class name"
            name="schoolClassName"
            placeholder="Class name"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Class year"
            name="schoolClassYear"
            placeholder="YY/YY or YYYY/YYYY"
            autoComplete="off"
          />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
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
    </div>
  );
}
