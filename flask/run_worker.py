import asyncio

from temporalio.client import Client
from temporalio.worker import Worker

from activities import SampleActivities
from shared import TASK_QUEUE_NAME
from workflows import SampleWorkflow


async def main() -> None:
    client: Client = await Client.connect("localhost:7233", namespace="default")
    # Run the worker
    activities = SampleActivities()
    worker: Worker = Worker(
        client,
        task_queue=TASK_QUEUE_NAME,
        workflows=[SampleWorkflow],
        activities=[activities.activity1,activities.activity2, activities.activity3, activities.activity4],
    )
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())
