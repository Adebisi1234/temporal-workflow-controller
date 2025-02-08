from flask import Flask,jsonify
import traceback
from temporalio.client import Client, WorkflowFailureError

from shared import TASK_QUEUE_NAME
from workflows import SampleWorkflow
import datetime
from flask_cors import CORS
import urllib.parse
app = Flask(__name__)
CORS(app)


@app.route("/workflow/start")

async def start_workflow():
   # Create client connected to server at the given address
    client: Client = await Client.connect("localhost:7233")
    workflow_id =  str(datetime.datetime.now())
    try:
        handle = await client.start_workflow(
            SampleWorkflow.run,
            id=workflow_id,
            task_queue=TASK_QUEUE_NAME,
        )
        activities = await handle.query("getRunningActivites")
        
        response = {"name": workflow_id,"status": 'started', "activities": activities
        }

        return jsonify(response)

    except WorkflowFailureError:
        print("Got expected exception: ", traceback.format_exc())
        return "error"

@app.route("/workflow/<id>/query")
async def query_workflow(id):
    try:
        client: Client = await Client.connect("localhost:7233")
        handle = client.get_workflow_handle(id)
        result = await handle.query("getRunningActivites")
        return jsonify(result)
    except WorkflowFailureError:
        print("Got expected exception: ", traceback.format_exc())
        return "error"

@app.route("/workflow/terminate/<id>")
async def terminate_workflow(id):
    try:
        client: Client = await Client.connect("localhost:7233")
        handle = client.get_workflow_handle(id)
        await handle.terminate()
        return "Terminating workflow"
    except Exception as error:
        print("Couldn't terminate workflow")
        return jsonify({"error": str(error)})


@app.route("/workflow/<id>/activity/retry/<activity_name>")

async def retry_workflow(id, activity_name):
    try:
        client: Client = await Client.connect("localhost:7233")
        handle = client.get_workflow_handle(id)
        print("retrying: " + activity_name)
        await handle.signal(SampleWorkflow.retryActivity, urllib.parse.unquote(activity_name))
        return f"Retrying activity {activity_name}"
    except Exception as err:
        print(err)
        return err

# @@@SNIPEND

if __name__ == "__main__":

    app.run(debug=True)