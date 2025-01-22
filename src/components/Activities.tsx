import { useEffect, useState } from "react";
import { pollWorkflow, retryActivity } from "../services/fetch";

export default function Activities({
  activities,
  id,
  setWorkflowStatus,
  workflowStatus,
}: {
  activities: any;
  id: string;
  setWorkflowStatus: any;
  workflowStatus: any;
}) {
  const [Activities, setActivities] = useState<
    {
      name: string;
      status: "successful" | "pending" | "in progress" | "failed";
      id: string;
    }[]
  >(activities ?? []);

  useEffect(() => {
    let intervalId: any;
    function pollServerEveryFiveSeconds() {
      intervalId = setInterval(async () => {
        const data = await pollWorkflow(id);
        if (data.status < 400 && data.data) {
          if (
            data.data.every((activity: any) => activity.status === "successful")
          ) {
            clearInterval(intervalId);
            setWorkflowStatus("Successful");
          }
          if (
            workflowStatus === "Terminated" ||
            workflowStatus === "Successful"
          ) {
            console.log(workflowStatus);
            clearInterval(intervalId);
          }
          setActivities(data.data);
        }
      }, 500);
    }

    pollServerEveryFiveSeconds();

    return () => {
      // cleanup
      clearInterval(intervalId);
    };
  }, []);
  const activitiesElements = Activities.map(
    (activity) =>
      activity.status !== "pending" && (
        <div
          key={activity.name}
          className="flex sm:items-center gap-3 justify-between w-full h-[78px] p-4 bg-[#E8E8E8] flex-col sm:flex-row items-start min-h-fit"
        >
          <h2 className="max-w-[100px] font-medium text-lg">{activity.name}</h2>
          <div className="w-full ">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus,
            consectetur fugit. Ad non quaerat laborum asperiores tenetur
          </div>
          <div
            className={`px-5 py-2 ${
              activity.status === "in progress"
                ? "bg-[#5DFF5D]"
                : activity.status === "failed"
                ? "bg-red-500"
                : "bg-green-500"
            } rounded-lg badge w-[180px] ${
              workflowStatus !== "Terminated" ? "cursor-pointer" : ""
            } text-center text-white p-2`}
            onClick={async () => {
              if (
                activity.status === "failed" &&
                workflowStatus !== "Terminated"
              ) {
                await retryActivity(activity.name, id);
                setActivities((prevActivities) => {
                  return prevActivities.map((prevActivity) => {
                    if (prevActivity.name === activity.name) {
                      return { ...prevActivity, status: "in progress" };
                    }
                    return prevActivity;
                  });
                });
              }
            }}
          >
            {activity.status === "failed" ? "Failed / Retry" : activity.status}
          </div>
        </div>
      )
  );
  return (
    <div className="w-full">
      <div className="p-3 flex justify-between text-start gap-4 font-semibold text-2xl">
        <div className="name min-w-[100px]">S/N</div>
        <div className="w-full">Details</div>
        <div className="status min-w-[160px]">Status</div>
      </div>

      {activitiesElements}
    </div>
  );
}
