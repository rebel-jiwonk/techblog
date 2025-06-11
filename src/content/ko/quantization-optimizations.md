---
title: "저전력 NPU 추론을 위한 양자화 최적화"
slug: "quantization-optimizations"
description: "Rebellions NPU에서 양자화를 통해 성능을 높이는 방법을 소개합니다."
date: "2024-06-10"
lang: "ko"
tags: ["양자화", "퍼포먼스"]
authors: ["김희준"]
---

정적 양자화와 동적 양자화를 활용하면 모델 크기와 지연 시간을 효과적으로 줄일 수 있습니다.  
Rebellions NPU는 PyTorch 및 Hugging Face 기반의 사후 학습 양자화(PTQ)를 지원합니다.

정확도 저하를 방지하려면 대표적인 데이터셋으로 벤치마크를 진행하는 것이 중요합니다.