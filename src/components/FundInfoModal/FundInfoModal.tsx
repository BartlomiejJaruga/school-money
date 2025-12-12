import styles from './FundInfoModal.module.scss';
import { FormProvider, useForm } from 'react-hook-form';
import { useFetcher } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { CustomInputWithLabel } from '@components/CustomInputWithLabel';
import {
  FundInfoModalSchema,
  type FundInfoModalValues,
} from '@schemas/components/fundInfoModal.schema';
import type { SimpleDateString } from '@lib/constants';

type ClassData = {
  // delete and change all placed used when DTO of class is established
  classId: string;
  name: string;
  children: number;
};

type FundInfoModalData = Omit<FundInfoModalValues, 'startDate' | 'endDate'> & {
  startDate: SimpleDateString;
  endDate: SimpleDateString;
};

type FundInfoModalProps = {
  type: 'create' | 'edit';
  onClose: () => void;
  onConfirm: () => void;
  classData: ClassData;
  defaultData?: FundInfoModalData;
};

const TODAY = new Date();
const padDate = (num: number) => {
  return num.toString().padStart(2, '0');
};
const today = `${TODAY.getFullYear()}-${padDate(TODAY.getMonth() + 1)}-${padDate(TODAY.getDate())}`;

export function FundInfoModal({
  type,
  onClose,
  onConfirm,
  classData,
  defaultData,
}: FundInfoModalProps) {
  const fetcher = useFetcher();
  const formMethods = useForm<FundInfoModalValues>({
    resolver: zodResolver(FundInfoModalSchema),
    mode: 'onChange',
    defaultValues: {
      title: defaultData?.title ?? '',
      description: defaultData?.description ?? '',
      startDate: defaultData?.startDate ?? today,
      endDate: defaultData?.endDate ?? '',
      costPerChild: defaultData?.costPerChild ?? undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = formMethods;

  const onSubmit = (values: FundInfoModalValues) => {
    onConfirm();
    fetcher.submit(values, { method: 'post', action: '/created-funds' });
  };

  const costPerChildValue = watch('costPerChild');
  const trueCostPerChild =
    costPerChildValue && !isNaN(costPerChildValue) ? costPerChildValue : 0;
  const totalCost = trueCostPerChild * classData.children;
  const busy = isSubmitting || fetcher.state != 'idle';

  return (
    <div className={styles['fund-info-modal']}>
      <div className={styles['fund-info-modal__top']}>
        <h2 className={styles['top__title']}>
          {type == 'create' ? 'CREATE NEW FUND' : 'EDIT FUND'}
        </h2>
        <X onClick={onClose} className={styles['top__close-icon-button']} />
      </div>
      <FormProvider {...formMethods}>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className={styles['fund-info-modal__form']}
        >
          <div>PHOTO</div>
          <CustomInputWithLabel
            label="Title"
            name="title"
            placeholder="Enter fund title"
            autoComplete="off"
          />
          <CustomInputWithLabel
            label="Description"
            name="description"
            placeholder="Enter fund description"
            autoComplete="off"
          />
          {type == 'create' && (
            <>
              <div className={styles['form__dates']}>
                <CustomInputWithLabel
                  type="date"
                  label="Start date"
                  name="startDate"
                />
                <CustomInputWithLabel
                  type="date"
                  label="End date"
                  name="endDate"
                />
              </div>
              <CustomInputWithLabel
                type="number"
                label="Cost per child"
                name="costPerChild"
                placeholder="Enter cost per child"
                autoComplete="off"
                min={1}
              />
              <div className={styles['form__payment-info']}>
                <h5 className={styles['payment-info__label']}>Payment info</h5>
                <span>{`Cost per child: ${trueCostPerChild.toFixed(2)} PLN`}</span>
                <span>{`Participants: ${classData.children}`}</span>
                <span>{`Total cost: ${totalCost.toFixed(2)} PLN`}</span>
              </div>
            </>
          )}
          <div className={styles['form__actions']}>
            <button
              type="button"
              onClick={onClose}
              className={styles['actions__cancel']}
              disabled={busy}
            >
              Cancel
            </button>
            <button className={styles['actions__confirm']} disabled={busy}>
              Confirm
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
