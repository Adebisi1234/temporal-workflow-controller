import axios from "axios";
const base = process.env.BASE_URL;
export async function retryActivity(activityName: string, id: string) {
  return axios.get(`${base}workflow/${id}/activity/retry/${activityName}`);
}

export async function terminateWorkflow(id: string) {
  return axios.get(`${base}workflow/terminate/${id}`);
}

export async function pollWorkflow(id: string) {
  return axios.get(`${base}workflow/${id}/query`);
}

export async function startWorkflow() {
  return axios.get("${base}workflow/start");
}
