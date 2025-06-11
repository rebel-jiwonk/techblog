---
title: "Rebellions NPU에서 모델 서빙하는 법"
slug: "model-serving-guide"
description: "PyTorch 모델을 Rebellions NPU에 서빙하는 간단한 방법."
date: "2024-05-22"
lang: "ko"
tags: ["툴"]
authors: ["낚시꾼", "낚시꾼"]
---

기존 PyTorch 모델을 `rbln_server`를 통해 쉽게 서빙할 수 있습니다.  
`torch.compile` 혹은 `optimum-rbln`을 통해 NPU에 맞게 모델을 최적화하세요.