import { useRef, useState } from 'react';
import styles from './DragAndDropPhotoInput.module.scss';
import clsx from 'clsx';
import { X } from 'lucide-react';

type DragAndDropPhotoInputProps = {
  className?: string;
};

export function DragAndDropPhotoInput({
  className,
}: DragAndDropPhotoInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!file) return;

    if (!isFileTypeValid(file)) return;

    handlePhotoPreview(file);

    console.log(file); // TO DO handle file saving in form
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isFileTypeValid(file)) return;

    handlePhotoPreview(file);

    console.log(file); // TO DO handle file saving in form
  };

  const handlePhotoPreview = (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
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
            onClick={() => setPreview(null)}
          />
        </div>
      )}
    </div>
  );
}
