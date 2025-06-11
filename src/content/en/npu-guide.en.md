---
title: "Rebellions Performance Tuning Guide"
slug: "rebellions-npu-guide-en"
description: "System-level optimizations via CPU governor, NUMA settings"
date: "2024-06-09"
lang: "en"
authors: ["Lim Jee-un", "Kwon Min-jae"]
tags: ["Performance"]
---

When NPU performance doesn’t meet expectations, the root cause is often not in software or model design — but rather in **low-level system configuration**.  
Two often overlooked yet highly impactful tuning steps are:

- CPU governor mode
- NUMA-based CPU and memory binding

---

### 1. Checking and Changing CPU Governor Mode

Most Linux systems use CPU frequency governors to balance power and performance.  
If the default is set to `powersave`, your CPU may not ramp up to its full clock speed, creating a bottleneck before or during inference.  
Setting it to `performance` forces maximum frequency for all cores.

```bash
# Check current governor mode
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# Set all CPU cores to performance mode
for CPU in /sys/devices/system/cpu/cpu[0-9]*; do
  echo performance | sudo tee $CPU/cpufreq/scaling_governor
done
```

### 2. NUMA Optimization: Pin Workloads to the NPU’s NUMA Node

In NUMA (Non-Uniform Memory Access) systems, each node includes both CPUs and memory.
To reduce memory latency and avoid costly cross-node memory transfers, it’s critical to bind your workload to the same NUMA node as the NPU.

Benefits include:

- Lower memory access latency
- Reduced DMA transfer delays
- Improved end-to-end throughput

```
# Check NUMA node layout
lscpu | grep "NUMA node"

# Example: Run inference on NUMA node 1
numactl --cpunodebind=1 --membind=1 ./run_inference
```