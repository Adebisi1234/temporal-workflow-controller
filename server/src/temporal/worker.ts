import { Worker } from '@temporalio/worker';
import { activity1, activity2, activity3, activity4 } from './activities';

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: 'signals-queries',
    activities: {
      activity1,
      activity2,
      activity3,
      activity4,
    },
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
