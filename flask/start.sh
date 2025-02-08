#!/usr/bin/sh

temporal server start-dev --headless --log-level fatal & gunicorn --worker-class=gevent --worker-connections=1000 --workers=5 app:app & python3 ./run_worker.py
