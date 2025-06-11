---
title: "RAG Demo on RBLNCloud"
slug: "rag-demo"
description: "End-to-end RAG setup on Kubernetes using vLLM, BGE embeddings, and a vector database."
date: "2024-06-11"
lang: "en"
tags: ["Solution", "Tools", "Optimization"]
authors: ["Jeon Chan-yong"]
---

We've deployed a full RAG (Retrieval-Augmented Generation) pipeline at [demo.rblncloud.com](https://demo.rblncloud.com).  
The system connects to a Postgres-backed vector database on Kubernetes and uses `vLLM` to serve BGE-based embedding and reranking models.
