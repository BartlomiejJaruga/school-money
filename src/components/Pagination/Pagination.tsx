import styles from './Pagination.module.scss';
import clsx from 'clsx';
import { MoveLeft, MoveRight } from 'lucide-react';
import { useId } from 'react';
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

  const getVisiblePages = () => {
    const range: (number | string)[] = [];
    const delta = 1;

    const start = Math.max(0, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    if (start > 0) {
      range.push(0);
    }

    if (start > 1) {
      range.push('...');
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages - 2) {
      range.push('...');
    }

    if (end < totalPages - 1) {
      range.push(totalPages - 1);
    }

    return range;
  };

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

  const pages = getVisiblePages();
  const ellipsisUniqueId = useId();

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
        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={ellipsisUniqueId + index}
              className={styles['pages__ellipsis']}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              className={clsx(
                styles['pages__page'],
                currentPage === page && styles['pages__page--active']
              )}
              onClick={() => handlePageChange(page as number)}
            >
              {(page as number) + 1}
            </button>
          )
        )}
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
