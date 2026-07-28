#!/bin/bash
export PATH=$HOME/google-cloud-sdk/bin:$PATH

echo "Bundling local code..."
tar --exclude="node_modules" \
    --exclude=".git" \
    --exclude="frontend/dist" \
    --exclude="backend/__pycache__" \
    --exclude=".DS_Store" \
    -czf /tmp/cloudtask-pro.tar.gz -C /Users/prii/Desktop cloudtask-pro

echo "Uploading code to VM..."
gcloud compute scp /tmp/cloudtask-pro.tar.gz cloudtask-vm:~/ --zone=us-central1-a

echo "Extracting code and starting Docker containers on VM..."
gcloud compute ssh cloudtask-vm --zone=us-central1-a --command="tar -xzf cloudtask-pro.tar.gz && cd cloudtask-pro && sudo docker compose up --build -d"

echo "Deployment triggered!"
