import * as wf from '@temporalio/workflow';
import type * as activities from './activities';

export const unblockSignal = wf.defineSignal('unblock');
export const isBlockedQuery = wf.defineQuery<boolean>('isBlocked');
export const shouldRetrySignal = wf.defineSignal<[string]>('shouldRetry');
export const queryActivities = wf.defineQuery<
  {
    name: string;
    status: string;
  }[]
>('activities');
export async function unblockOrCancel(): Promise<void> {
  const { activity1, activity2, activity3, activity4 } = wf.proxyActivities<typeof activities>({
    // Dont retry
    retry: {
      backoffCoefficient: 1,
      maximumAttempts: 1,

      nonRetryableErrorTypes: [''],
    },
    startToCloseTimeout: '10s',
  });
  let retry = '';

  let activitiesQuery = [
    { name: 'activity1', status: 'pending' },
    { name: 'activity2', status: 'pending' },
    { name: 'activity3', status: 'pending' },
    { name: 'activity4', status: 'pending' },
  ];
  wf.setHandler(queryActivities, () => activitiesQuery);
  wf.setHandler(shouldRetrySignal, (value) => {
    retry = value;
  });
  try {
    await wf.sleep(3000);
    activitiesQuery[0].status = 'in progress';
    activity1();
    activitiesQuery[0].status = 'successful';
  } catch (err) {
    if (err instanceof wf.CancelledFailure) {
      throw err;
    }
    activitiesQuery[0].status = 'failed';
    await wf.condition(() => retry === 'activity1');
    activitiesQuery[0].status = 'in progress';
    activity1();
    activitiesQuery[0].status = 'successful';
  }

  try {
    await wf.sleep(3000);
    activitiesQuery[1].status = 'in progress';
    activity2();
    activitiesQuery[1].status = 'successful';
  } catch (err) {
    if (err instanceof wf.CancelledFailure) {
      throw err;
    }
    activitiesQuery[1].status = 'failed';
    await wf.condition(() => retry === 'activity2');
    activitiesQuery[1].status = 'in progress';
    activity2();
    activitiesQuery[1].status = 'successful';
  }

  try {
    await wf.sleep(3000);
    activitiesQuery[2].status = 'in progress';
    await activity3();
    activitiesQuery[2].status = 'successful';
  } catch (err) {
    if (err instanceof wf.CancelledFailure) {
      throw err;
    }
    activitiesQuery[2].status = 'failed';

    await wf.condition(() => retry === 'activity3');
    activitiesQuery[2].status = 'in progress';
    await activity3(true);
    activitiesQuery[2].status = 'successful';
  }

  try {
    await wf.sleep(3000);
    activitiesQuery[3].status = 'in progress';
    await activity4();
    activitiesQuery[3].status = 'successful';
  } catch (err) {
    if (err instanceof wf.CancelledFailure) {
      throw err;
    }
    activitiesQuery[2].status = 'failed';
    await wf.condition(() => retry === 'activity4');
    activitiesQuery[2].status = 'in progress';
    activity4();
    activitiesQuery[2].status = 'successful';
  }
}
