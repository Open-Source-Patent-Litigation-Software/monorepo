import redis


def connect_to_redis(host, port, ssl=True):
    """Establish a connection to Redis."""
    client = redis.Redis(
        host=host,
        port=port,
        db=0,
    )
    return client


if __name__ == "__main__":
    cluster_name = "your-cluster-name"
    region = "us-east-2"  # Change this to your cluster's region

    try:
        # Get the ElastiCache endpoint
        endpoint = "dulany-mockup-pvm32x.serverless.use2.cache.amazonaws.com:6379"
        host, port = endpoint.split(":")

        # Connect to Redis
        redis_client = connect_to_redis(host, int(port), ssl=True)
        redis_client.ping()

    except redis.ConnectionError as e:
        print(f"Redis connection error: {str(e)}")
    except redis.RedisError as e:
        print(f"Redis error: {str(e)}")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")
    finally:
        print("Script execution completed")
