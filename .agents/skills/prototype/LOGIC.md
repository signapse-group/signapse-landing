# Logic Prototype in Pen

Use this branch when the question concerns a business rule, state transition, lifecycle, or data shape. For questions about visual layout, use [UI.md](UI.md).

## Process

### 1. State the question

Name the rule or state model being explored and the cases that could change the decision in chat. Do not put research questions, open decisions or review notes on the canvas.

### 2. Draw the walkthrough

Only create this walkthrough when the user explicitly requests a logic or state-model prototype. Use the smallest number of Pen frames needed to show each relevant scenario:

- Show the full state needed to reason about the case.
- Connect states with arrows labeled by the action, event, or condition.
- Include expected outcomes and invalid or terminal transitions when they matter.
- If examining data shape, show a representative example and mark it illustrative rather than an accepted API contract.
- Reuse the existing layout and components where the walkthrough is presented. Do not create feature-specific error or permission screens for common patterns unless requested.

Choose the smallest number of frames that makes the scenarios understandable. Do not create an executable reducer/module, terminal UI, application route, or runtime simulation. A viewer follows the arrows manually.

### 3. Review the cases

Take screenshots and inspect labels, transitions, and state values. Walk through each requested case in order and note missing, ambiguous, or conflicting rules. Pen presents the proposed model; it does not run or verify transitions.

### 4. Capture the learning

Report the question, scenarios reviewed, findings, evidence limits, and unresolved decisions in chat or requested documentation. A Pen walkthrough can support product discussion and requirement clarification, but it does not prove runtime behavior. Runtime proof belongs to implementation and testing. Do not treat the drawn model as an accepted implementation contract unless its requirements are separately accepted and recorded.

After the review, remove temporary logic walkthrough frames from the product canvas once a recoverable copy exists, unless the user explicitly keeps them as a reference. Do not attach a logic walkthrough as a UI design image to an FE Task.
