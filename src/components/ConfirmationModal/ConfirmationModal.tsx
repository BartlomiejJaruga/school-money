import styles from './ConfirmationModal.module.scss';
import {
  ModalTemplate,
  type ModalTemplateProps,
} from '@components/ModalTemplate';

type ConfirmationModalProps = Omit<ModalTemplateProps, 'children'> & {
  text: string;
  subtext?: string;
  warningSubtext?: string;
  highlightedPart?: string;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
};

export function ConfirmationModal({
  isOpen,
  onOverlayClick,
  text,
  subtext,
  warningSubtext,
  highlightedPart,
  onCancel,
  onConfirm,
  isConfirming,
}: ConfirmationModalProps) {
  const renderMessage = () => {
    if (!highlightedPart || !text.includes(highlightedPart)) {
      return <>{text}</>;
    }

    const [before, after] = text.split(highlightedPart);
    return (
      <>
        {before}
        <span className={styles['modal__text--highlight']}>
          {highlightedPart}
        </span>
        {after}
      </>
    );
  };

  return (
    <>
      <ModalTemplate isOpen={isOpen} onOverlayClick={onOverlayClick}>
        <div className={styles['modal']}>
          <p className={styles['modal__text']}>{renderMessage()}</p>
          {subtext && <p className={styles['modal__subtext']}>{subtext}</p>}
          {warningSubtext && (
            <p className={styles['modal__warning-subtext']}>{warningSubtext}</p>
          )}
          <div className={styles['modal__buttons']}>
            <button
              className={styles['buttons__cancel']}
              onClick={onCancel}
              disabled={isConfirming}
            >
              Cancel
            </button>
            <button
              className={styles['buttons__confirm']}
              onClick={onConfirm}
              disabled={isConfirming}
            >
              Confirm
            </button>
          </div>
        </div>
      </ModalTemplate>
    </>
  );
}
