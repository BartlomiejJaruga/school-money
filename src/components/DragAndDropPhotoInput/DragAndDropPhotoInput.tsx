import { useEffect, useRef, useState } from 'react';
import styles from './DragAndDropPhotoInput.module.scss';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

type DragAndDropPhotoInputProps = {
  name: string;
  photoUrl?: string | null;
  className?: string;
  onAdd?: () => void;
  onDelete?: () => void;
};

export function DragAndDropPhotoInput({
  name,
  photoUrl = null,
  className,
  onAdd,
  onDelete,
}: DragAndDropPhotoInputProps) {
  const formContext = useFormContext();
  if (!formContext) {
    throw new Error(
      'DragAndDropPhotoInput should be used inside of FormProvider'
    );
  }
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(photoUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setValue, register } = formContext;

  useEffect(() => {
    register(name);
  }, [register]);

  useEffect(() => {
    if (photoUrl) {
      setPreview(photoUrl);
    }
  }, [photoUrl]);

  const isFileTypeValid = (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Accepted file types: .png, .jpg');
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file || !isFileTypeValid(file)) return;

    handlePhotoPreview(file);

    setValue(name, file, { shouldValidate: true });
    onAdd?.();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isFileTypeValid(file)) return;

    handlePhotoPreview(file);

    setValue(name, file, { shouldValidate: true });
    onAdd?.();
  };

  const handlePhotoPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handlePhotoRemove = () => {
    setPreview(null);
    setValue(name, null);
    onDelete?.();
  };

  return (
    <div className={clsx(styles['photo-input-wrapper'], className ?? '')}>
      <h3 className={styles['photo-input-wrapper__title']}>Photo</h3>

      {!preview && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            inputRef.current?.click();
          }}
          className={clsx(
            styles['photo-input-wrapper__dropzone'],
            isDragging && styles['photo-input-wrapper__dropzone--dragging']
          )}
        >
          <label htmlFor="file-input">
            Drag & drop file here or click to choose from disk
          </label>
          <input
            type="file"
            id="file-input"
            ref={inputRef}
            accept=".png, .jpeg, .jpg"
            onChange={handleFileChange}
          />
        </div>
      )}

      {preview && (
        <div className={styles['photo-input-wrapper__preview']}>
          <img
            src={preview}
            alt="preview"
            className={styles['preview__photo']}
          />
          <X
            className={styles['preview__delete']}
            onClick={handlePhotoRemove}
          />
        </div>
      )}
    </div>
  );
}
