import styles from './ModalTemplate.module.scss';

export type ModalTemplateProps = {
  isOpen: boolean;
  onOverlayClick: () => void;
  children?: React.ReactNode;
};

export function ModalTemplate({
  isOpen,
  onOverlayClick,
  children,
}: ModalTemplateProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOverlayClick();
    }
  };

  return (
    <>
      <div onClick={handleOverlayClick} className={styles['overlay']}>
        {children}
      </div>
    </>
  );
}
