# Why One EC2 Instance Is Not Enough

A single EC2 instance has finite compute resources, including CPU, memory, storage, and network bandwidth.

As application traffic increases, every incoming request consumes a portion of these resources. Under heavy load, several issues may occur:

* CPU utilization reaches 100%, increasing request processing time.
* Memory usage grows until the operating system begins terminating processes to recover memory.
* Incoming requests accumulate in network queues, causing latency and timeouts.
* Database connection pools become exhausted, increasing response times.
* Overall application availability and user experience degrade.

These limitations are not caused by incorrect application logic, but by the physical resource limits of a single server.

## Engineering Decision

Instead of relying on a larger server indefinitely (vertical scaling), CloudTask Pro is designed to support horizontal scaling.

Multiple EC2 instances can run identical Docker containers, allowing incoming traffic to be distributed across several servers using an Application Load Balancer.

This architecture improves availability, scalability, and fault tolerance while reducing the impact of individual server failures.
