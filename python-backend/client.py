import grpc
import example_pb2
import example_pb2_grpc
import time

def run():
    """Test gRPC client"""
    
    # Create channel
    channel = grpc.insecure_channel('localhost:50051')  # Connect to Node.js server
    stub = example_pb2_grpc.ExampleServiceStub(channel)
    
    # Test 1: SayHello
    print('\n📤 Testing SayHello...')
    try:
        response = stub.SayHello(
            example_pb2.HelloRequest(
                name='Python Client',
                message='Hello from Python!'
            )
        )
        print(f'✅ Response: {response.reply}')
        print(f'⏰ Timestamp: {response.timestamp}')
    except grpc.RpcError as e:
        print(f'❌ Error: {e.code()} - {e.details()}')
    
    time.sleep(1)
    
    # Test 2: ProcessImage
    print('\n📤 Testing ProcessImage...')
    try:
        dummy_image = b'fake-image-data-' + str(int(time.time())).encode()
        
        response = stub.ProcessImage(
            example_pb2.ImageRequest(
                image_data=dummy_image,
                image_name='test-image.jpg',
                context='crop_analysis'
            )
        )
        print(f'✅ Result: {response.result}')
        print(f'✅ Success: {response.success}')
        print(f'⏱️  Processing Time: {response.processing_time} seconds')
    except grpc.RpcError as e:
        print(f'❌ Error: {e.code()} - {e.details()}')
    
    channel.close()

if __name__ == '__main__':
    # Wait a bit for servers to start
    time.sleep(2)
    run()