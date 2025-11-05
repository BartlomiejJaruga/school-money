import styles from './ErrorPage.module.scss';
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    // HTTP Errors (e.g. 404, 500, ...)
    return (
      <>
        <div className={styles['http-error']}>
          <h1 className={styles['http-error__status']}>
            {error.status} {error.statusText}
          </h1>
          <p className={styles['http-error__data']}>{error.data}</p>
          <button
            className={styles['http-error__return']}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Go Back
          </button>
        </div>
      </>
    );
  } else if (error instanceof Error) {
    // Thrown errors (JS, TS)
    return (
      <>
        <div className={styles['js-error']}>
          <h1 className={styles['js-error__title']}>ERROR</h1>
          <p className={styles['js-error__message']}>{error.message}</p>
          <div className={styles['js-error__stack-trace']}>
            <p className={styles['stack-trace__title']}>Stack trace:</p>
            <pre className={styles['stack-trace__stack']}>{error.stack}</pre>
          </div>
          <button
            className={styles['js-error__return']}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft />
            Go Back
          </button>
        </div>
      </>
    );
  } else {
    // Default error
    return (
      <>
        <div className={styles['default-error']}>
          <h1 className={styles['default-error__title']}>Unknown Error!</h1>
        </div>
      </>
    );
  }
}
