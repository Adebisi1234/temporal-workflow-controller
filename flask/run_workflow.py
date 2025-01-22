# @@@SNIPSTART python-project-template-run-workflow
import asyncio
import traceback

from temporalio.client import Client, WorkflowFailureError

from shared import TASK_QUEUE_NAME, PaymentDetails
from workflows import SampleWorkflow


async def main() -> None:
    # Create client connected to server at the given address
    client: Client = await Client.connect("localhost:7233")

    try:
        result = await client.execute_workflow(
            SampleWorkflow.run,
            id="pay-invoice-701",
            task_queue=TASK_QUEUE_NAME,
        )

        print(f"Result: {result}")

    except WorkflowFailureError:
        print("Got expected exception: ", traceback.format_exc())


# @@@SNIPEND
