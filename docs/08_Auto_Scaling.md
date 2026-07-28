# Vertical Scaling vs Horizontal Scaling

## Problem Statement

As CloudTask Pro grows, a single EC2 instance eventually reaches the limits of its CPU, memory, and network capacity. Additional user traffic increases response times and may eventually cause application failures.

To support growth, the infrastructure must scale.

---

# Vertical Scaling

Vertical scaling increases the resources of a single server.

Example:

* 2 vCPU → 8 vCPU
* 2 GB RAM → 32 GB RAM

## Advantages

* Simple to implement
* No architectural changes
* Suitable for small workloads

## Limitations

* Single point of failure
* Hardware limits eventually reached
* Downtime may be required for upgrades
* Large instances are significantly more expensive

---

# Horizontal Scaling

Horizontal scaling increases capacity by adding more servers instead of making one server larger.

Example:

1 EC2 Instance

↓

2 EC2 Instances

↓

4 EC2 Instances

↓

8 EC2 Instances

Each server runs the same Dockerized application.

Incoming requests are distributed by an Application Load Balancer.

## Advantages

* High availability
* Improved fault tolerance
* Better scalability
* Easier maintenance
* Incremental growth
* Supports Auto Scaling

## Engineering Decision

CloudTask Pro uses horizontal scaling because it provides better long-term scalability and reliability.

If one EC2 instance becomes unhealthy, the Application Load Balancer automatically routes traffic to healthy instances, minimizing downtime.

As user traffic increases, new EC2 instances can be launched automatically through an Auto Scaling Group instead of upgrading a single server.
