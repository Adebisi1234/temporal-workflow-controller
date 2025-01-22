import axios from "axios";

export async function retryActivity(activityName: string, id: string) {
  return axios.get(
    `http://localhost:5000/workflow/${id}/activity/retry/${activityName}`
  );
}

export async function terminateWorkflow(id: string) {
  return axios.get(`http://localhost:5000/workflow/terminate/${id}`);
}

export async function pollWorkflow(id: string) {
  return axios.get(`http://localhost:5000/workflow/${id}/query`);
}

export async function startWorkflow() {
  return axios.get("http://localhost:5000/workflow/start");
}
