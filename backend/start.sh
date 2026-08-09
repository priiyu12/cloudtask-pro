#!/bin/bash

# Run migrations with retries
max_retries=5
count=0ww
until alembic upgrade head; do
  count=$((count+1))
  if [ $count -ge $max_retries ]; then
    echo "Migrations failed after $max_retries attempts. Exiting."
    exit 1
  fi
  echo "Migration failed. Retrying in 2 seconds..."
  sleep 2
done

# Start the app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4