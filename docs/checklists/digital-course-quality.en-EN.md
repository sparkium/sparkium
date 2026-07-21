Digital Course Quality Checklist

Sparkium's mission: Sparkium is built for organizing digital learning materials.

- Use consistency terminology:
  - In Sparkium schema:
    - `Course`: The root folder which contains all the `Blocks` and `Materials`.
    - `Block`: The direct child folder of `Course`, which can also contain more `Blocks` or a single digital learning `Material`.
    - `Material`: A single `Material` is the leaf node in the Sparkium course schema. It holds the actual information which will be used for teaching.
  - In general course:
    - `Learners`: people taking part in a course.
    - `Task`: individual activities or steps that learners must complete.
    - `Suggestion`: solutions or approaches that learners can use to complete a task.
    - `Quiz`: questions that learners must answer to test their understanding.
- Make components referenceable:
  - Every task, suggestion and quiz should have a unique ID so that they can be easily referenced.
  - Sub-steps, questions and other individual components should also be referenceable to ensure a clear structure.
- Consistent structuring of content:
  1. Introduction, objectives, overview
  2. Content, tasks, steps
  3. Further information, in-depth study, next steps