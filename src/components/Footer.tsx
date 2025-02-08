import { terminateWorkflow } from "../services/fetch";

export default function Footer({
  workflowStatus,
  setWorkflowStatus,
  id,
}: {
  workflowStatus: string;
  setWorkflowStatus: any;
  id: string;
}) {
  return (
    <footer className="mt-20">
      {workflowStatus === "Successful" ? (
        <p className="text-green-600 font-bold text-lg">Workflow completed</p>
      ) : workflowStatus === "Terminated" ? (
        <p className="text-red-600 font-bold text-lg">Workflow terminated</p>
      ) : (
        <button
          onClick={async () => {
            await terminateWorkflow(id);
            setWorkflowStatus("Terminated");
          }}
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-60 h-14 p-2 border-2"
        >
          End Workflow
        </button>
      )}
    </footer>
  );
}
