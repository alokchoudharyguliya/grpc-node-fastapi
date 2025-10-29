#!/bin/bash

echo "🔧 Setting up gRPC trial..."

# Setup Node.js backend
echo "\n📦 Installing Node.js dependencies..."
cd node-backend
npm install
cd ..

# Setup Python backend
echo "\n📦 Installing Python dependencies..."
cd python-backend
# pip install -r requirements.txt

# Generate Python gRPC code from proto
echo "\n🔨 Generating Python gRPC code..."
# Copy proto file from node-backend
cp ../node-backend/protos/example.proto .

# Generate Python code
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. example.proto

cd ..

echo "\n✅ Setup complete!"
echo "\nTo run:"
echo "1. Terminal 1: cd node-backend && npm start"
echo "2. Terminal 2: cd python-backend && python server.py"
echo "3. Terminal 3: cd node-backend && npm run client"
echo "4. Terminal 4: cd python-backend && python client.py"