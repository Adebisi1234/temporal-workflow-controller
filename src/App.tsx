import { useEffect, useState } from "react";
import "./App.css";
import Activities from "./components/Activities";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { startWorkflow } from "./services/fetch";

function App() {
  const [workflow, setWorkflow] = useState<
    | {
        name: string;
        status: "started";
        activities: any;
      }
    | undefined
  >(undefined);
  const [workflowStatus, setWorkflowStatus] = useState("In progress");
  useEffect(() => {
    (async () => setWorkflow((await startWorkflow()).data))();
  }, []);

  return (
    <>
      {workflow && (
        <main>
          <Header />
          <Activities
            activities={workflow.activities}
            id={workflow.name}
            setWorkflowStatus={setWorkflowStatus}
            workflowStatus={workflowStatus}
          />
          <Footer
            workflowStatus={workflowStatus}
            id={workflow.name}
            setWorkflowStatus={setWorkflowStatus}
          />
        </main>
      )}
    </>
  );
}

export default App;
