---
title: "Image Compression for the Web: JPEG, WebP and PNG Tested"
description: "Compare actual JPEG, WebP and PNG output sizes for a photo and a text screenshot. Learn which format to try first and how to check the result in your browser."
date: 2026-05-12
updated: 2026-11-24
tags: [image, compression, tutorial]
---

<div class="space-y-5 leading-7 [&_h2]:mt-9 [&_h2]:text-xl [&_h2]:font-semibold [&_table]:w-full [&_table]:text-sm [&_th]:bg-gray-100 [&_th]:align-bottom [&_td]:border-b [&_td]:border-gray-200 [&_th]:p-2 [&_td]:p-2 [&_td]:tabular-nums [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_a]:underline">

For a web photo, start with WebP at 70% quality and inspect fine detail at the size people will see it. For a screenshot, keep the original PNG as a reference and compare the smallest text. In our test, WebP reduced a photograph from 502,888 to 24,380 bytes. On a screenshot, JPEG at the same quality setting produced a file slightly **larger** than the original.

## What happened to the same two images?

We ran both files through the [ToolZen image compressor](/en/image-compress/) on November 24, 2026, in Chromium 149. Each run started with the original file and kept its pixel dimensions. JPEG and WebP used the tool’s 70% quality setting. PNG used the browser’s lossless encoder. The numbers below are exact file sizes in bytes.

| Output | Photograph, 768 × 512 | Text screenshot, 900 × 650 |
| --- | ---: | ---: |
| Original PNG | 502,888 | 40,892 |
| JPEG at 70% | 40,558 | 40,938 |
| WebP at 70% | 24,380 | 23,872 |
| Re-encoded PNG | 773,614 | 64,078 |

**For this photograph**, WebP saved 95.2% against the original PNG. JPEG also reduced the file substantially and is worth trying when a destination requires it. The percentage depends on what you start with. A phone photo already stored as JPEG may have much less room to shrink.

**For this screenshot**, WebP saved 41.6%. The English and Chinese text remained readable in our sample at its original size, although the colored edges of small letters changed. JPEG added 46 bytes and softened the same edges. When exact text and line colors matter, keep the original PNG. Re-encoding it as PNG preserved every decoded RGB pixel in this test but increased the file size.

![The same line of English and Chinese text in the original PNG, JPEG at 70% and WebP at 70%, enlarged twofold to show letter edges.](/examples/image-compression/text-detail.png)

## How to compress images for the web

1. Open the [image compressor](/en/image-compress/) and select your original. Start with WebP for photos. Try PNG or the unchanged original for diagrams and screenshots where fine edges matter. Use PNG or WebP when you need transparency.
2. Choose a format and click **Compress**. For JPEG and WebP, start at 70% quality. Compare the displayed sizes. If the result is too large, lower the quality one step and compress the original again. PNG has no quality setting.
3. Inspect the preview and the downloaded image at its intended display size. Check hair or foliage in a photograph and the smallest letters in a screenshot. Keep the smallest version that meets your quality and compatibility needs. If a site imposes a byte limit, check the downloaded file’s size before submitting it.

The tool keeps the source width and height and processes the file locally. If quality changes alone cannot meet your budget, resize the original separately to its intended display dimensions and try again.

## Repeat the comparison

Use the [Kodak test photograph, image 3](https://r0k.us/graphics/kodak/kodak/kodim03.png) and the [original ToolZen screenshot](/examples/image-compression/word-counter-screen.png) to try the same settings. A browser’s JPEG and WebP encoders interpret the quality setting separately, and another browser version may produce different files.

</div>
