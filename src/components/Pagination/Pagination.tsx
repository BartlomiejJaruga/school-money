import styles from './Pagination.module.scss';
import clsx from 'clsx';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useLocation, useSearchParams } from 'react-router-dom';

type FundsPaginationProps = {
  urlPagesName: string;
  totalPages: number;
  currentPage: number;
  resetScrollPosition?: boolean;
  stateToPass?: Record<string, any>;
};

export function Pagination({
  totalPages,
  currentPage,
  urlPagesName,
  resetScrollPosition = true,
  stateToPass,
}: FundsPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;

    searchParams.set(urlPagesName, newPage.toString());
    setSearchParams(searchParams, {
      replace: true,
      state: {
        ...location.state,
        ...stateToPass,
      },
    });

    if (resetScrollPosition) {
      const mainScrollableContainer = document.querySelector('main');
      mainScrollableContainer?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles['pagination']}>
      <button
        className={styles['pagination__prev']}
        disabled={currentPage == 0}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <MoveLeft />
        Prev
      </button>
      <div className={styles['pagination__pages']}>
        {pages.map((page) => {
          return (
            <button
              className={clsx(
                styles['pages__page'],
                currentPage == page && styles['pages__page--active']
              )}
              onClick={() => handlePageChange(page)}
              key={page}
            >
              {page + 1}
            </button>
          );
        })}
      </div>
      <button
        className={styles['pagination__next']}
        disabled={currentPage >= totalPages - 1}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <MoveRight />
      </button>
    </div>
  );
}
