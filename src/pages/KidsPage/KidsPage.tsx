import styles from './KidsPage.module.scss';
import defaultImage from '@assets/default-user.png';
import { School, Ellipsis, Plus, Pencil, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

export function KidsPage() {
  return (
    <>
      <div className={styles['page']}>
        <KidTile />
        <KidTile />
        <NewKidTile />
      </div>
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

function NewKidTile() {
  return (
    <div className={styles['new-kid-tile']}>
      <Plus className={styles['new-kid-tile__icon']} />
      <h2 className={styles['new-kid-tile__text']}>Add Child</h2>
    </div>
  );
}
