from temporalio import activity


class SampleActivities:

    @activity.defn
    async def activity1(self) -> str:
        print(f"Activity 1")
        return "done"
    
    @activity.defn
    async def activity2(self) -> str:
        print(f"Activity 2")
        return "done"

    @activity.defn
    async def activity3(self, data: str |None = None) -> str:
        
        try:
            if data:
                return data
            raise Exception("Data is None")
        except Exception:
            activity.logger.exception("Refund failed")
            raise

    @activity.defn
    async def activity4(self) -> str:
        print(f"Activity 4")
        return "done"


