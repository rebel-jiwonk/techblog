---
title: "Rebellions NPU 성능 튜닝 가이드"
slug: "rebellions-npu-guide"
description: "CPU governor, NUMA 최적화 등 시스템 레벨에서 성능을 끌어올리는 방법"
date: "2024-06-09"
lang: "ko"
authors: ["임지은", "권민재"]
tags: ["퍼포먼스"]
---

NPU 성능이 기대만큼 나오지 않는다고 느껴질 때, 가장 먼저 확인해야 할 것은 소프트웨어 최적화나 모델 구조가 아닌, **시스템 레벨의 기본 설정**입니다.  
특히 `CPU governor 설정`과 `NUMA 기반의 CPU affinity 조정`은 단순하지만 강력한 성능 향상 포인트입니다.

---

### 1. CPU governor 설정 확인 및 변경

운영체제는 CPU의 소비 전력을 조절하기 위해 governor 정책을 사용합니다.  
기본값이 `powersave`로 설정되어 있는 경우, CPU는 최대 클럭으로 작동하지 않아 병목이 발생할 수 있습니다.  
이를 `performance`로 변경하면 CPU가 항상 고클럭 상태로 유지됩니다.

```bash
# 현재 governor 상태 확인
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor

# 모든 코어를 performance로 변경
for CPU in /sys/devices/system/cpu/cpu[0-9]*; do
  echo performance | sudo tee $CPU/cpufreq/scaling_governor
done
```

### 2. NUMA 최적화: NPU와 동일한 노드에 연산 고정

NUMA(Non-Uniform Memory Access) 시스템에서는 각 노드가 CPU 코어와 메모리를 함께 구성합니다.
NPU가 연결된 NUMA 노드의 리소스를 우선 사용하면 성능이 개선됩니다.

장점:
 • 메모리 접근 속도 향상
 • DMA 전송 지연 최소화
 • 전체 추론 처리량 개선

 ```
 # NUMA 노드 정보 확인
lscpu | grep "NUMA node"

# 예시: NPU가 NUMA node 1에 연결된 경우
numactl --cpunodebind=1 --membind=1 ./run_inference
```