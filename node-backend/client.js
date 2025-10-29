const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

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

// Create client
const client = new exampleProto.ExampleService(
  'localhost:50052', // Connect to Python server
  grpc.credentials.createInsecure()
);

// Test 1: Say Hello
function testSayHello() {
  console.log('\n📤 Testing SayHello...');
  
  client.SayHello(
    {
      name: 'Node.js Client',
      message: 'Hello from Node.js!'
    },
    (error, response) => {
      if (error) {
        console.error('❌ Error:', error.message);
        return;
      }
      console.log('✅ Response:', response.reply);
      console.log('⏰ Timestamp:', response.timestamp);
    }
  );
}

// Test 2: Process Image
function testProcessImage() {
  console.log('\n📤 Testing ProcessImage...');
  
  // Create dummy image data (or read real file)
  const dummyImageData = Buffer.from('fake-image-data-' + Date.now());
  
  client.ProcessImage(
    {
      image_data: dummyImageData,
      image_name: 'test-image.jpg',
      context: 'crop_analysis'
    },
    (error, response) => {
      if (error) {
        console.error('❌ Error:', error.message);
        return;
      }
      console.log('✅ Result:', response.result);
      console.log('✅ Success:', response.success);
      console.log('⏱️  Processing Time:', response.processing_time, 'seconds');
    }
  );
}

// Run tests after a delay (give servers time to start)
setTimeout(() => {
  testSayHello();
  setTimeout(testProcessImage, 1000);
}, 2000);