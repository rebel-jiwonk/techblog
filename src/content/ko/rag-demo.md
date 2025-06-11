---
title: "RBLNCloud에서 RAG 데모 구축하기"
slug: "rag-demo"
description: "vLLM, BGE 임베딩, 벡터 데이터베이스를 활용한 RAG 파이프라인 구축 사례"
date: "2024-06-11"
lang: "ko"
tags: ["솔루션", "툴", "최적화"]
authors: ["낚시꾼"]
---

[RBLNCloud 데모 페이지](https://demo.rblncloud.com)에 RAG(Retrieval-Augmented Generation) 파이프라인을 구축했습니다.  
Kubernetes 환경에서 Postgres 기반 벡터 데이터베이스를 연동하고, `vLLM`을 통해 BGE 기반 임베딩 및 리랭킹 모델을 서빙하고 있습니다.