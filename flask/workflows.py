# @@@SNIPSTART python-money-transfer-project-template-workflows
from datetime import timedelta
import asyncio
from temporalio import workflow
from temporalio.common import RetryPolicy
from temporalio.exceptions import ActivityError

with workflow.unsafe.imports_passed_through():
    from activities import SampleActivities


@workflow.defn
class SampleWorkflow:
     
    def __init__(self) -> None:
        self._runningActivites = [
            {
            "name": "Activity 1",
            "desc": "Some description",
            "status": "pending"
        },
            {
            "name": "Activity 2",
            "desc": "Some description",
            "status": "pending"
        },
            {
            "name": "Activity 3",
            "desc": "Some description",
            "status": "pending"
        },
            {
            "name": "Activity 4",
            "desc": "Some description",
            "status": "pending"
        },
        ]
        self._retryActivities = set()
    
    @workflow.run
    async def run(self) -> str:
        retry_policy = RetryPolicy(
            maximum_attempts=1,
            maximum_interval=timedelta(seconds=1),
            non_retryable_error_types=["Exception"],
        )

# Activiy 1
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 1':
                obj["status"] = "in progress"
                break        

        await workflow.execute_activity_method(
            SampleActivities.activity1,
            start_to_close_timeout=timedelta(seconds=5),
            retry_policy=retry_policy,
        )
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 1':
                obj["status"] = "successful"
                break        

# Activity 2
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 2':
                obj["status"] = "in progress"
                break        

        await workflow.execute_activity_method(
            SampleActivities.activity2,
            start_to_close_timeout=timedelta(seconds=5),
            retry_policy=retry_policy,
        )
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 2':
                obj["status"] = "successful"
                break        

# Activity 3
        try:
            for obj in self._runningActivites:
                if obj.get("name") == 'Activity 3':
                    obj["status"] = "in progress"
                    break                    
            await workflow.execute_activity_method(
                SampleActivities.activity3,
                start_to_close_timeout=timedelta(seconds=5),
                retry_policy=retry_policy,
            )
        except ActivityError:
            try:
                
                for obj in self._runningActivites:
                    if obj.get("name") == 'Activity 3':
                        obj["status"] = "failed"
                        break  

                await workflow.wait_condition(lambda: "Activity 3" in self._retryActivities)
                self._retryActivities.remove("Activity 3")
                await workflow.execute_activity_method(
                    SampleActivities.activity3,
                    "retry",
                    start_to_close_timeout=timedelta(seconds=5),
                    retry_policy=retry_policy,
                )

            except ActivityError:
                raise
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 3':
                obj["status"] = "successful"
                break   


# Activity 4
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 4':
                obj["status"] = "in progress"
                break        

        await workflow.execute_activity_method(
            SampleActivities.activity4,
            start_to_close_timeout=timedelta(seconds=5),
            retry_policy=retry_policy,
        )
        
        for obj in self._runningActivites:
            if obj.get("name") == 'Activity 4':
                obj["status"] = "successful"
                break        
        await workflow.wait_condition(workflow.all_handlers_finished)
        return "workflow-result"
        
     

    @workflow.query
    def getRunningActivites(self) -> str:
        return self._runningActivites
        
    @workflow.signal
    async def retryActivity(self, name: str):      
            print(f"retrying {name}")
            self._retryActivities.add(name)
        



# @@@SNIPEND
