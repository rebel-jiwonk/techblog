---
title: "Quick Tips for Model Quantization"
slug: "quantization-tips"
description: "Learn how to quantize deep learning models effectively for Rebellions NPU."
date: "2024-05-18"
lang: "en"
tags: ["Quantization", "Optimization"]
authors: ["Paul Kuper", "Jo Gwi-hyun"]
---

Quantization can drastically reduce model size and latency. Use per-channel quantization for convolutional layers, and be mindful of accuracy loss with activation quantization. 

Tools like `optimum-rbln` help automate the process.