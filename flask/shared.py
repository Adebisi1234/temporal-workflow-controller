# @@@SNIPSTART python-money-transfer-project-template-shared
from dataclasses import dataclass

TASK_QUEUE_NAME = "SAMPLE_TASK_QUEUE"


@dataclass
class PaymentDetails:
    source_account: str
    target_account: str
    amount: int
    reference_id: str


# @@@SNIPEND
