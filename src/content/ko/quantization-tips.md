---
title: "모델 양자화 꿀팁"
slug: "quantization-tips"
description: "Rebellions NPU에서 딥러닝 모델 양자화하는 법을 알려드립니다."
date: "2024-05-18"
lang: "ko"
tags: ["양자화", "최적화"]
authors: [낚시꾼", "낚시꾼"]
---

양자화는 모델 크기와 지연 시간을 크게 줄일 수 있습니다. 컨볼루션 레이어에는 채널별 양자화를 사용하고, 활성화 양자화에서는 정확도 손실에 유의하세요.

'optimum-rbln'과 같은 도구는 이 과정을 자동화하는 데 도움이 됩니다.