---
title: "ATOM 칩에서의 양자화 실전 가이드"
slug: "quant-guide-atom"
description: "Rebellions ATOM에서 양자화를 적용하는 실전 팁을 모았습니다."
date: "2024-06-06"
lang: "ko"
tags: ["양자화", "최적화"]
authors: ["낚시꾼"]
---

양자화 시 정밀도 손실을 최소화하려면 calibration 데이터셋을 충분히 확보해야 합니다.  
8-bit 정수 기반의 weight-only quantization이 추천됩니다.