#!/bin/bash

export PATH=$HOME/google-cloud-sdk/bin:$PATH

echo "Creating firewall rules for HTTP/HTTPS..."
gcloud compute firewall-rules create default-allow-http \
    --direction=INGRESS --priority=1000 --network=default \
    --action=ALLOW --rules=tcp:80 --source-ranges=0.0.0.0/0 \
    --target-tags=http-server || true

gcloud compute firewall-rules create default-allow-https \
    --direction=INGRESS --priority=1000 --network=default \
    --action=ALLOW --rules=tcp:443 --source-ranges=0.0.0.0/0 \
    --target-tags=https-server || true

echo "Creating the Compute Engine VM (cloudtask-vm)..."
gcloud compute instances create cloudtask-vm \
    --project=cloudtask-pro-503717 \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --tags=http-server,https-server \
    --image-family=ubuntu-2404-lts-amd64 \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --metadata startup-script='#!/bin/bash
apt-get update
apt-get install -y docker.io docker-compose-v2 git
systemctl enable docker
systemctl start docker
# The default user created by gcloud is usually based on the email or "ubuntu"
# We add both to be safe
usermod -aG docker ubuntu || true
usermod -aG docker $(getent passwd "1000" | cut -d: -f1) || true
'
