---
title: "Boosting NPU Throughput on ATOM"
slug: "npu-throughput-tweaks"
description: "Simple tweaks to improve your model throughput."
date: "2024-06-03"
lang: "en"
tags: ["Performance", "Optimization"]
authors: ["Jae Lee", "Paul Kuper"]
---

Adjusting batch size, enabling pipelining, and aligning CPU-NPU NUMA nodes can improve inference throughput by 20–40%.

Measure with consistent seeds and fixed input shapes.