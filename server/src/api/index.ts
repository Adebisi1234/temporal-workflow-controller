import { Client } from '@temporalio/client';
import express from 'express';
import cors from 'cors';
import { shouldRetrySignal, unblockOrCancel } from '../temporal/workflows';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get('/workflow/:id/activity/retry/:name', async (req, res) => {
  try {
    const client = new Client();
    const handle = client.workflow.getHandle(req.params.id);
    await handle.signal(shouldRetrySignal, req.params.name);

    res.send(`Retrying activity ${req.params.name}`);
  } catch (err) {
    console.log(err);
  }
});

app.get('/workflow/terminate/:id', async (req, res) => {
  try {
    const client = new Client();
    const handle = client.workflow.getHandle(req.params.id);
    console.log('Canceling workflow');
    await handle.terminate();
    res.json('Terminating workflow');
  } catch (err) {
    console.log(err);
  }
});

app.get('/workflow/:id/query', async (req, res) => {
  try {
    const client = new Client();
    const handle = client.workflow.getHandle(req.params.id);
    const activities = await handle.query('activities');
    res.json(activities);
  } catch (err) {
    console.log(err);
  }
});

app.get('/workflow/start', async (req, res) => {
  try {
    let id = crypto.randomUUID();
    const client = new Client();
    const handle = await client.workflow.start(unblockOrCancel, {
      taskQueue: 'signals-queries',
      workflowId: id,
    });
    const activities = await handle.query('activities');
    res.json({
      name: id,
      status: 'started',
      activities,
    });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
