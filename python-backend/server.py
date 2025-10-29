import grpc
from concurrent import futures
import time
import example_pb2
import example_pb2_grpc

class ExampleServiceServicer(example_pb2_grpc.ExampleServiceServicer):
    """Implementation of ExampleService"""
    
    def SayHello(self, request, context):
        """Handle SayHello RPC"""
        print(f"[Python Server] Received: {request.name} says '{request.message}'")
        
        reply = f"Hello {request.name}! I received: '{request.message}'. This is from Python server."
        
        return example_pb2.HelloResponse(
            reply=reply,
            timestamp=time.strftime('%Y-%m-%d %H:%M:%S')
        )
    
    def ProcessImage(self, request, context):
        """Handle ProcessImage RPC"""
        print(f"[Python Server] Processing image: {request.image_name}")
        print(f"[Python Server] Image size: {len(request.image_data)} bytes")
        print(f"[Python Server] Context: {request.context}")
        
        # Simulate processing
        start_time = time.time()
        time.sleep(0.1)  # Simulate work
        processing_time = time.time() - start_time
        
        return example_pb2.ImageResponse(
            result=f'Image "{request.image_name}" processed by Python. Context: {request.context}',
            success=True,
            processing_time=processing_time
        )

def serve():
    """Start gRPC server"""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Add servicer
    example_pb2_grpc.add_ExampleServiceServicer_to_server(
        ExampleServiceServicer(), server
    )
    
    # Listen on port
    port = '50052'
    server.add_insecure_port(f'[::]:{port}')
    server.start()
    
    print(f'🚀 Python gRPC Server running on port {port}')
    
    try:
        server.wait_for_termination()
    except KeyboardInterrupt:
        server.stop(0)

if __name__ == '__main__':
    serve()