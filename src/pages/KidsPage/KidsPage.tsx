import styles from './KidsPage.module.scss';
import defaultImage from '@assets/default-user.png';
import { School, Ellipsis, Plus, Pencil, Trash2, X } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ModalTemplate } from '@components/ModalTemplate';
import { FormProvider, useForm } from 'react-hook-form';
import { useFetcher } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  NewChildSchema,
  type NewChildValues,
} from '@schemas/kids/newChild.schema';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';

export function KidsPage() {
  const [isAddNewChildModalOpen, setIsAddNewChildModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsAddNewChildModalOpen(false);
  };

  const handleModalOpen = () => {
    setIsAddNewChildModalOpen(true);
  };

  return (
    <>
      <div className={styles['page']}>
        <KidTile />
        <KidTile />
        <NewKidTile handleModalOpen={handleModalOpen} />
      </div>
      <ModalTemplate
        isOpen={isAddNewChildModalOpen}
        onOverlayClick={handleModalClose}
      >
        <AddNewChildModal handleClose={handleModalClose} />
      </ModalTemplate>
    </>
  );
}

function KidTile() {
  const actionMenuRef = useRef<HTMLDivElement | null>(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

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

  return (
    <div className={styles['kid-tile']}>
      <Ellipsis
        onClick={() => {
          setIsActionMenuOpen(true);
        }}
        className={styles['kid-tile__ellipsis']}
      />
      {isActionMenuOpen && (
        <div ref={actionMenuRef} className={styles['kid-tile__action-menu']}>
          <button className={styles['action-menu__button']}>
            <Pencil />
            Edit
          </button>
          <button
            className={clsx(
              styles['action-menu__button'],
              styles['action-menu__button--red']
            )}
          >
            <Trash2 />
            Delete
          </button>
        </div>
      )}
      <img
        src={defaultImage}
        alt={`Kid Name photo`}
        className={styles['kid-tile__photo']}
      />
      <h3 className={styles['kid-tile__names']}>FirstName LastName</h3>
      <div className={styles['kid-tile__class']}>
        <School className={styles['class__icon']} />
        <h4 className={styles['class__name']}>{`Class (16/17)`}</h4>
      </div>
    </div>
  );
}

type NewKidTileProps = {
  handleModalOpen: React.MouseEventHandler<HTMLDivElement>;
};

function NewKidTile({ handleModalOpen }: NewKidTileProps) {
  return (
    <div onClick={handleModalOpen} className={styles['new-kid-tile']}>
      <Plus className={styles['new-kid-tile__icon']} />
      <h2 className={styles['new-kid-tile__text']}>Add Child</h2>
    </div>
  );
}

type AddNewChildModalProps = {
  handleClose: React.MouseEventHandler<HTMLElement | SVGSVGElement>;
};

function AddNewChildModal({ handleClose }: AddNewChildModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<NewChildValues>({
    resolver: zodResolver(NewChildSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const onSubmit = (values: NewChildValues) => {
    fetcher.submit(values, { method: 'post', action: '/kids' });
  };

  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['new-child-modal']}>
      <div className={styles['new-child-modal__top']}>
        <h2 className={styles['top__title']}>ADD NEW CHILD</h2>
        <X onClick={handleClose} className={styles['top__close-icon-button']} />
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
          <DragAndDropPhotoInput />
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={handleClose}
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

function DragAndDropPhotoInput() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;

    const url = URL.createObjectURL(files[0]);
    setPreview(url);

    console.log([...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handlePhotoPreview(file);
  };

  const handlePhotoPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(styles['dropzone'], isDragging && styles['dragging'])}
    >
      <label htmlFor="file-input">
        Drag & drop file here or click to choose from disk
      </label>
      <input
        type="file"
        id="file-input"
        accept=".png, .jpeg, .jpg"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {preview && <img src={preview} alt="preview" style={{ width: 200 }} />}
    </div>
  );
}
