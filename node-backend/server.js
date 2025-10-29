const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const express = require('express');

// Load proto file
const PROTO_PATH = path.join(__dirname, 'protos', 'example.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

// gRPC Server Implementation
const server = new grpc.Server();

// Implement the service methods
const serviceImpl = {
  SayHello: (call, callback) => {
    const { name, message } = call.request;
    console.log(`[Node Server] Received: ${name} says "${message}"`);
    
    const reply = `Hello ${name}! I received your message: "${message}". This is from Node.js server.`;
    
    callback(null, {
      reply: reply,
      timestamp: new Date().toISOString()
    });
  },

  ProcessImage: (call, callback) => {
    const { image_data, image_name, context } = call.request;
    console.log(`[Node Server] Processing image: ${image_name}`);
    console.log(`[Node Server] Image size: ${image_data.length} bytes`);
    console.log(`[Node Server] Context: ${context}`);
    
    // Simulate processing
    const startTime = Date.now();
    
    // Dummy processing
    setTimeout(() => {
      const processingTime = (Date.now() - startTime) / 1000;
      
      callback(null, {
        result: `Image "${image_name}" processed successfully. Detected context: ${context}`,
        success: true,
        processing_time: processingTime
      });
    }, 100);
  }
};

// Add service to server
server.addService(exampleProto.ExampleService.service, serviceImpl);

// Start gRPC server
const GRPC_PORT = '50051';
server.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Failed to start gRPC server:', error);
      return;
    }
    console.log(`🚀 Node.js gRPC Server running on port ${port}`);
    server.start();
  }
);

// Optional: Express HTTP server for health check
const app = express();
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-grpc-server' });
});
app.listen(3001, () => {
  console.log('🌐 HTTP health check server on port 3001');
});