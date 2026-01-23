import { useRef } from 'react';
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
  const mouseDownTarget = useRef<EventTarget | null>(null);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTarget.current = e.target;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      mouseDownTarget.current === e.currentTarget &&
      e.target === e.currentTarget
    ) {
      onOverlayClick();
    }

    mouseDownTarget.current = null;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={styles['overlay']}
    >
      {children}
    </div>
  );
}
