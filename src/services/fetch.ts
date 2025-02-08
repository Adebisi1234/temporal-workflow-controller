import axios from "axios";
export async function retryActivity(activityName: string, id: string) {
  return axios.get(
    `https://temporal-workflow-controller.onrender.com/workflow/${id}/activity/retry/${activityName}`
  );
}

export async function terminateWorkflow(id: string) {
  return axios.get(
    `https://temporal-workflow-controller.onrender.com/workflow/terminate/${id}`
  );
}

export async function pollWorkflow(id: string) {
  return axios.get(
    `https://temporal-workflow-controller.onrender.com/workflow/${id}/query`
  );
}

export async function startWorkflow() {
  return axios.get(
    "https://temporal-workflow-controller.onrender.com/workflow/start"
  );
}
