# Course Structure

This document describes the reason behind the files system design.

## Overview

A course consists of the following components:
- course metadata file (`content.md`)
- multiple sections
- learning materials associated with each section

## Example of a course structure

Example:

```
course-make-fire/
│
├─ course-meta.yml
│
└─ sections/
   ├─ 01_first-section/
   │  ├─ content.yml
   │  ├─ 010-material.pdf.yml
   │  ├─ 010-material.pdf
   │  ├─ 020-material.pptx.yml
   │  └─ 020-material.pptx
   │
   ├─ 02_second-section/
   │  ├─ content.yml
   │  ├─ 010-material.mp4.yml
   │  └─ 010-material.mp4
   │
   └─ 03_third-section/
      ├─ content.yml
      ├─ 010-material.pdf.yml
      └─ 010-material.pdf
```

## Sections

Each folder inside sections represents a course section.

A section contains:
- a `content.md` file containing the section metadata and section introduction description.
- learning materials which will be used in the section
- multiple `.yml` files storing metadata for the corresponding material files.

## Metadata files

As an example, the course `content.md` file contains metadata such as:

```
---
course_id: FIRE-101
title: How to Make a Fire?
subtitle: From Spark to Flame Safely
language: en
level: beginner
estimated_duration_seconds: 5400
prerequisites:
  - Comfortable being outdoors
learning_goals:
  - Understand the fire triangle
  - Choose safe ignition tools
  - Light a fire without matches
  - Extinguish and leave-no-trace
sections:
  - 01-preparation
  - 02-fire-starting
  - 03-cleanup
author: John Doe
---
```

Each material file used in the course will also have its own meta.yml file to store its metadata. For example:

```
010-material.pdf
010-material.pdf.yml
```

This avoids ambiguity and keeps metadata separate from the file itself.


