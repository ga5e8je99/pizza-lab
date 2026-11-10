#!/bin/bash

# Script to start both Pizza Lab Customer Website and Standalone Admin Dashboard
echo "=================================================="
echo "Starting Pizza Lab Restaurant & Admin Dashboard"
echo "=================================================="

# Cleanup function to kill child processes on exit
cleanup() {
  echo ""
  echo "Stopping all Pizza Lab services..."
  kill $(jobs -p) 2>/dev/null
  exit
}
trap cleanup SIGINT SIGTERM

# Start Customer Website on port 3000
echo "Starting Customer Website on http://localhost:3000..."
cd /home/gamal-ahmed/Desktop/pizaa-lab && npm run dev &

# Start Standalone Admin Dashboard on port 3001
echo "Starting Standalone Admin Dashboard on http://localhost:3001..."
cd /home/gamal-ahmed/Desktop/pizza-dashboard && npm run dev &

echo ""
echo "Both Pizza Lab services are starting up!"
echo "Customer Website: http://localhost:3000"
echo "Admin Dashboard:  http://localhost:3001"
echo "Dashboard PIN:    pizza2026"
echo ""
echo "Press Ctrl+C to stop all servers."

wait
