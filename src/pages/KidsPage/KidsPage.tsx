import styles from './KidsPage.module.scss';
import defaultImage from '@assets/default-user.png';
import { School, Ellipsis, Plus, Pencil, Trash2, X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ModalTemplate } from '@components/ModalTemplate';
import { FormProvider, useForm } from 'react-hook-form';
import { useFetcher, useLoaderData } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewChildSchema,
  type NewChildValues,
} from '@schemas/kids/newChild.schema';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import { ConfirmationModal } from '@components/ConfirmationModal';
import type { ChildData } from '@lib/constants';
import type { KidsLoaderData } from '@routes/kids.route';
import { DragAndDropPhotoInput } from '@components/DragAndDropPhotoInput';
import axiosInstance from '@services/axiosInstance';

export function KidsPage() {
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [childDataToEdit, setChildDataToEdit] = useState<ChildData | null>(
    null
  );
  const kidsLoaderData = useLoaderData() as KidsLoaderData;

  const handleCancelChildModal = () => {
    setIsChildModalOpen(false);
    setChildDataToEdit(null);
  };

  const handleOpenChildModal = () => {
    setIsChildModalOpen(true);
    setChildDataToEdit(null);
  };

  const handleConfirmChildModal = () => {
    setIsChildModalOpen(false);
    setChildDataToEdit(null);
  };

  const handleEditChild = (childData: ChildData) => {
    setIsChildModalOpen(true);
    setChildDataToEdit(childData);
  };

  return (
    <>
      <div className={styles['page']}>
        {kidsLoaderData.children &&
          kidsLoaderData.children.map((child: ChildData) => {
            return (
              <KidTile
                handleEditChild={handleEditChild}
                childData={child}
                key={child.id}
              />
            );
          })}
        <NewKidTile handleOpenChildModal={handleOpenChildModal} />
      </div>
      <ModalTemplate
        isOpen={isChildModalOpen}
        onOverlayClick={handleCancelChildModal}
      >
        <ChildModal
          onClose={handleCancelChildModal}
          onConfirm={handleConfirmChildModal}
          childData={childDataToEdit}
        />
      </ModalTemplate>
    </>
  );
}

type KidTileProps = {
  handleEditChild: (childData: ChildData) => void;
  childData: ChildData;
};

function KidTile({ handleEditChild, childData }: KidTileProps) {
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [childAvatarUrl, setChildAvatarUrl] = useState<string>(defaultImage);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchAvatar = async () => {
      try {
        const response = await axiosInstance.get(
          `/v1/children/${childData.id}/avatar`,
          { responseType: 'blob' }
        );

        if (response.data?.size == 0) return;

        objectUrl = URL.createObjectURL(response.data);
        setChildAvatarUrl(objectUrl);
      } catch (error) {
        console.error(error);
        setChildAvatarUrl(defaultImage);
      }
    };

    if (childData.id) {
      fetchAvatar();
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    function handleClickOutsideActionMenu(event: MouseEvent) {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setIsActionMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsideActionMenu);

    return () =>
      document.removeEventListener('mousedown', handleClickOutsideActionMenu);
  }, []);

  const handleDeleteConfirm = () => {
    console.log('child deleted');
    setIsDeleteConfirmationOpen(false);
  };

  const handleDeleteCancel = () => {
    console.log('delete child operation canceled');
    setIsDeleteConfirmationOpen(false);
  };

  return (
    <>
      <div className={styles['kid-tile']}>
        <Ellipsis
          onClick={() => {
            setIsActionMenuOpen(true);
          }}
          className={styles['kid-tile__ellipsis']}
        />
        {isActionMenuOpen && (
          <div ref={actionMenuRef} className={styles['kid-tile__action-menu']}>
            <button
              className={styles['action-menu__button']}
              onClick={() => {
                handleEditChild({ ...childData });
              }}
            >
              <Pencil />
              Edit
            </button>
            <button
              className={clsx(
                styles['action-menu__button'],
                styles['action-menu__button--red']
              )}
              onClick={() => {
                setIsDeleteConfirmationOpen(true);
                setIsActionMenuOpen(false);
              }}
            >
              <Trash2 />
              Delete
            </button>
          </div>
        )}
        <img
          src={childAvatarUrl}
          alt={`Kid Name photo`}
          className={styles['kid-tile__photo']}
        />
        <h3
          className={styles['kid-tile__names']}
        >{`${childData.firstName} ${childData.lastName}`}</h3>
        <div className={styles['kid-tile__class']}>
          <School className={styles['class__icon']} />

          {childData?.schoolClass?.id && (
            <h4
              className={styles['class__name']}
            >{`${childData.schoolClass.name} (${childData.schoolClass.year})`}</h4>
          )}

          {!childData?.schoolClass?.id && (
            <h4 className={styles['class__name']}>No class</h4>
          )}
        </div>
      </div>
      <ConfirmationModal
        text={`Are you sure you want to DELETE ${childData.firstName} ${childData.lastName}?`}
        warningSubtext="This operation is irreversible!"
        highlightedPart={`${childData.firstName} ${childData.lastName}`}
        isOpen={isDeleteConfirmationOpen}
        onOverlayClick={handleDeleteCancel}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isConfirming={false}
      />
    </>
  );
}

type NewKidTileProps = {
  handleOpenChildModal: React.MouseEventHandler<HTMLDivElement>;
};

function NewKidTile({ handleOpenChildModal }: NewKidTileProps) {
  return (
    <div onClick={handleOpenChildModal} className={styles['new-kid-tile']}>
      <Plus className={styles['new-kid-tile__icon']} />
      <h2 className={styles['new-kid-tile__text']}>Add Child</h2>
    </div>
  );
}

type ChildModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  childData?: ChildData | null;
};

function ChildModal({ onClose, onConfirm, childData }: ChildModalProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<boolean>(false);
  const fetcher = useFetcher();
  const formMethods = useForm<NewChildValues>({
    resolver: zodResolver(NewChildSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: childData?.firstName ?? '',
      lastName: childData?.lastName ?? '',
      birthday: childData?.birthday ?? '',
      invitationCode: '',
    },
  });
  const hasSchoolClass = childData?.schoolClass?.id ? true : false;

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchAvatar = async (childId: string) => {
      try {
        const response = await axiosInstance.get(
          `/v1/children/${childId}/avatar`,
          { responseType: 'blob' }
        );

        if (response.data?.size == 0) return;

        objectUrl = URL.createObjectURL(response.data);
        setPhotoUrl(objectUrl);
      } catch (error) {
        console.error(error);
        setPhotoUrl(null);
      }
    };

    if (childData && childData.id) {
      fetchAvatar(childData.id);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: NewChildValues) => {
    const childId = childData?.id ?? 'no-id';
    const invitationCode = values.invitationCode ?? '';

    const formData = new FormData();
    formData.append('childId', childId);
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('birthday', values.birthday);
    formData.append('invitationCode', invitationCode);
    formData.append('deletePhoto', String(deletePhoto));

    if (values.avatarFile) {
      formData.append('avatarFile', values.avatarFile);
    }

    fetcher.submit(formData, {
      method: 'post',
      action: '/kids',
      encType: 'multipart/form-data',
    });

    onConfirm();
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['new-child-modal']}>
      <div className={styles['new-child-modal__top']}>
        <h2 className={styles['top__title']}>ADD NEW CHILD</h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['new-child-modal__form']}
        >
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
          <CustomInputWithLabel label="Birthday" type="date" name="birthday" />
          {!hasSchoolClass && (
            <CustomInputWithLabel
              label="Invitation Code"
              name="invitationCode"
              placeholder="XXXXXXXXXX"
              autoComplete="off"
            />
          )}
          <DragAndDropPhotoInput
            name="avatarFile"
            photoUrl={photoUrl}
            onAdd={() => {
              setDeletePhoto(false);
            }}
            onDelete={() => {
              setDeletePhoto(true);
            }}
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
