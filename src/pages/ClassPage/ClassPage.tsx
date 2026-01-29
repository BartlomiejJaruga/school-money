import { Baby, FileChartColumn, MoveLeft, User } from 'lucide-react';
import styles from './ClassPage.module.scss';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import defaultUserImage from '@assets/default-user.png';
import { FundTile } from '@components/FundTile';
import { Pagination } from '@components/Pagination';
import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import type { ClassLoaderData } from '@routes/class.route';
import type { ChildWithParentInfoResponseDto } from '@dtos/ChildWithParentInfoResponseDto';
import type { SchoolClassResponseDto } from '@dtos/SchoolClassResponseDto';
import { FundTileSkeletonLoader } from '@components/FundTileSkeletonLoader';
import { NothingToShowInformation } from '@components/NothingToShowInformation';
import axiosInstance from '@services/axiosInstance';
import { formatISOToDate } from '@lib/utils';

export function ClassPage() {
  const classLoaderData = useLoaderData() as ClassLoaderData;
  const classData = classLoaderData.classData;
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isFetchingFunds =
    navigation.state == 'loading' &&
    navigation.location.search.includes('fundsPage');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [treasurerPhotoUrl, setTreasurerPhotoUrl] = useState<string | null>(
    null
  );

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchAvatar = async (treasurerId: string) => {
      try {
        const response = await axiosInstance.get(
          `/v1/parents/${treasurerId}/avatar`,
          { responseType: 'blob' }
        );

        if (response.data?.size == 0) return;

        objectUrl = URL.createObjectURL(response.data);
        setTreasurerPhotoUrl(objectUrl);
      } catch (error) {
        console.error(error);
        setTreasurerPhotoUrl(null);
      }
    };

    if (classData?.treasurer && classData.treasurer.user_id) {
      fetchAvatar(classData.treasurer.user_id);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  const handleFundReportDownload = async () => {
    if (classData == null) return;

    try {
      setIsGeneratingReport(true);
      const response = await axiosInstance.get(
        `/v1/school-classes/${classData.school_class_id}/report`,
        {
          responseType: 'blob',
        }
      );

      const today = new Date();
      const formattedToday = formatISOToDate(today.toISOString());

      const schoolClassName = `${classData.school_class_name}_${classData.school_class_year}`;

      const contentDisposition = response.headers['content-disposition'];
      let fileName = `Report-${schoolClassName.replaceAll(' ', '_')}-${formattedToday}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      setIsGeneratingReport(false);
    } catch (error) {
      console.error('Error:', error);
      setIsGeneratingReport(false);
    }
  };

  return (
    <>
      <div className={styles['page']}>
        <div className={styles['grid-container']}>
          <div className={styles['grid-container__top-bar']}>
            <button
              className={styles['top-bar__return-btn']}
              onClick={() => {
                navigate(-1);
              }}
            >
              <MoveLeft />
              Return
            </button>
            <button
              className={styles['top-bar__generate-report-btn']}
              onClick={handleFundReportDownload}
              disabled={isGeneratingReport}
            >
              <FileChartColumn />
              Generate report
            </button>
            <div
              className={styles['top-bar__class-name']}
            >{`${classData?.school_class_name} ${classData?.school_class_year}`}</div>
          </div>
          <div className={styles['grid-container__fund-list']}>
            {isFetchingFunds && <FundTileSkeletonLoader skeletonsNumber={3} />}

            {!isFetchingFunds &&
              classLoaderData.funds &&
              classLoaderData.funds.content.length > 0 && (
                <>
                  {classLoaderData.funds.content.map((fundTileInfo) => {
                    return (
                      <FundTile
                        fundData={fundTileInfo}
                        key={
                          fundTileInfo.fund.fund_id +
                          fundTileInfo.child.child_id
                        }
                      />
                    );
                  })}
                  <Pagination
                    urlPagesName="fundsPage"
                    totalPages={classLoaderData.funds.page.totalPages}
                    currentPage={classLoaderData.funds.page.number}
                  />
                </>
              )}

            {!isFetchingFunds &&
              classLoaderData.funds &&
              classLoaderData.funds.content.length < 1 && (
                <NothingToShowInformation
                  message="Class has no active funds or you have already paid all of them."
                  className={styles['fund-list__no-funds-info']}
                />
              )}
          </div>
          <div className={styles['grid-container__treasurer']}>
            <h5 className={styles['treasurer__label']}>Treasurer</h5>
            <div className={styles['treasurer__card-and-class-code']}>
              <div className={styles['treasurer__card']}>
                <img
                  className={styles['treasurer__photo']}
                  src={treasurerPhotoUrl || defaultUserImage}
                  alt="treasurer photo"
                />
                <div className={styles['treasurer__info']}>
                  <h4>{`${classData?.treasurer.first_name} ${classData?.treasurer.last_name}`}</h4>
                  <span>{classData?.treasurer.email}</span>
                </div>
              </div>
              <ClassCode
                code={classData?.invitation_code ?? 'Failed to load'}
              />
            </div>
          </div>
          <div className={styles['grid-container__class-info']}>
            <ClassInfo
              classData={classData}
              children={classLoaderData.children}
            />
          </div>
          <div className={styles['grid-container__children']}>
            <div className={styles['children__label']}>
              <h5>Child</h5>
              <h5>Parent</h5>
            </div>

            {classLoaderData?.children &&
              classLoaderData?.children?.length > 0 &&
              classLoaderData.children.map((childRowData) => {
                return (
                  <ChildRow
                    childRowData={childRowData}
                    key={childRowData.child_id}
                  />
                );
              })}

            {classLoaderData?.children &&
              classLoaderData?.children?.length < 1 && (
                <NothingToShowInformation
                  message="No children yet."
                  className={styles['children__no-children-info']}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
}

type ClassCodeProps = {
  code: string;
};

function ClassCode({ code }: ClassCodeProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const revealCode = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsRevealed(true);
  };

  return (
    <div className={styles['class-code-tile']}>
      <h5 className={styles['class-code-tile__label']}>Class code</h5>
      <div
        onClick={revealCode}
        className={clsx(
          styles['class-code-tile__code'],
          isRevealed && styles['class-code-tile__code--visible']
        )}
      >
        {isRevealed ? code : 'XXXXXXXXXX'}
      </div>
    </div>
  );
}

type ClassInfoProps = {
  classData: SchoolClassResponseDto | null;
  children: ChildWithParentInfoResponseDto[] | null;
};

function ClassInfo({ classData, children }: ClassInfoProps) {
  const classFundsInCents = classData?.active_funds_current_balance_in_cents;
  const classFunds =
    typeof classFundsInCents == 'number'
      ? (classFundsInCents / 100).toFixed(2)
      : 'Unknown';

  const activeFundsCounter =
    typeof classData?.number_of_active_funds == 'number'
      ? classData?.number_of_active_funds
      : 'Unknown';

  const parentsCounter = children
    ? new Set(children.map((child) => child.parent.user_id)).size
    : 0;

  const childrenCounter =
    typeof classData?.number_of_children == 'number'
      ? classData?.number_of_children
      : 'Unknown';

  return (
    <>
      <div className={styles['class-info__top-row']}>
        <div>
          <span>Class balance</span>
          <h2>{`${classFunds} PLN`}</h2>
        </div>
        <div>
          <span>Active Funds</span>
          <h2>{activeFundsCounter}</h2>
        </div>
      </div>
      <div className={styles['class-info__bottom-row']}>
        <div>
          <span>Kids</span>
          <div>
            <h2>{childrenCounter}</h2>
            <Baby />
          </div>
        </div>
        <div>
          <span>Parents</span>
          <div>
            <h2>{parentsCounter > 0 ? parentsCounter : 1}</h2>
            <User />
          </div>
        </div>
      </div>
    </>
  );
}

type ChildRowProps = {
  childRowData: ChildWithParentInfoResponseDto;
};

function ChildRow({ childRowData }: ChildRowProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchAvatar = async (childId: string) => {
      try {
        const response = await axiosInstance.get(
          `/v1/children/${childId}/avatar`,
          { responseType: 'blob' }
        );

        if (response.data?.size == 0) return;

        objectUrl = URL.createObjectURL(response.data);
        setPhotoUrl(objectUrl);
      } catch (error) {
        console.error(error);
        setPhotoUrl(null);
      }
    };

    fetchAvatar(childRowData.child_id);

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className={styles['child-row']}>
      <div className={styles['child-row__parent']}>
        <img
          src={photoUrl || defaultUserImage}
          alt="parent photo"
          className={styles['parent__photo']}
        />
        <span
          className={styles['parent__name']}
        >{`${childRowData.first_name} ${childRowData.last_name}`}</span>
      </div>
      <span
        className={styles['child-row__child']}
      >{`${childRowData.parent.first_name} ${childRowData.parent.last_name}`}</span>
    </div>
  );
}
