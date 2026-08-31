<!-- BEGIN:nextjs-agent-rules -->

**# This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PROJECT AGENT INSTRUCTIONS

## 1. Project Overview

This project is a modern web dashboard application.

The application should prioritize:

- Reliability
- Maintainability
- Security
- Clear architecture
- Consistent UI/UX
- Type safety
- Good developer experience
- Minimal unnecessary complexity

The application is expected to evolve over time.

Do not implement temporary shortcuts that create unnecessary technical debt unless explicitly requested.

---

# 2. Core Development Principles

Always follow these principles:

1. Inspect the existing implementation before modifying it.
2. Reuse existing components before creating new ones.
3. Reuse existing utilities, hooks, types, and services when appropriate.
4. Do not duplicate logic unnecessarily.
5. Keep components focused on a single responsibility.
6. Keep business logic separate from presentation logic where practical.
7. Prefer explicit and readable code over clever code.
8. Prefer type-safe solutions.
9. Avoid unnecessary dependencies.
10. Do not introduce breaking changes without explicit approval.
11. Do not remove existing functionality unless explicitly requested.
12. Do not replace working implementations merely because another approach looks cleaner.
13. Preserve existing conventions unless there is a strong technical reason to change them.

---

# 3. Before Making Changes

Before editing code:

1. Inspect the relevant directory.
2. Identify the existing architecture.
3. Identify related components.
4. Identify existing types and interfaces.
5. Identify existing API/service functions.
6. Check how the affected feature is currently implemented.
7. Check whether a reusable component already exists.
8. Check the installed package versions.
9. Read relevant local Next.js documentation when the change involves Next.js APIs or conventions.
10. Determine the smallest safe set of files that need modification.

Do not immediately create new files without checking the existing project structure.

---

# 4. Next.js Rules

Follow the conventions of the installed Next.js version, not assumptions based on older versions.

Before using a Next.js API that may have changed, inspect:

```text
node_modules/next/dist/docs/
```

Pay particular attention to:

- App Router conventions
- Server Components
- Client Components
- Server Actions
- Route Handlers
- Metadata
- Middleware/proxy conventions
- Caching
- Data fetching
- Dynamic rendering
- Static rendering
- Error handling
- Loading states
- Navigation
- Image handling
- Font handling

Never assume that an API behaves exactly like a previous Next.js version.

---

# 5. React Rules

Prefer functional components.

Use hooks only when necessary.

Avoid:

- unnecessary `useEffect`
- unnecessary client components
- duplicated state
- derived state stored unnecessarily
- deeply nested prop drilling
- large monolithic components

Prefer:

```text
Server Component
    ↓
Data / Server Logic
    ↓
Client Component only when interaction is required
```

Use Client Components only when the component actually requires browser-side interactivity.

Examples that may require Client Components:

- interactive forms
- dropdown state
- modal state
- tabs
- drag and drop
- browser APIs
- client-side event handlers
- interactive charts

Do not add `"use client"` automatically.

---

# 6. TypeScript Rules

TypeScript should be used consistently.

Avoid:

```ts
any;
```

unless there is a documented technical reason.

Prefer:

```ts
unknown;
```

with proper narrowing when the type is genuinely unknown.

Define explicit types for:

- API responses
- database entities
- component props
- form values
- table rows
- filters
- pagination
- authentication state
- error responses

Avoid excessive type assertions:

```ts
as SomeType
```

Do not use type assertions to hide actual type problems.

Prefer fixing the underlying type.

---

# 7. Project Structure

Follow the existing project structure.

Do not reorganize the entire application unless explicitly requested.

A preferred conceptual structure is:

```text
app/
components/
  ui/
  layout/
  dashboard/
  forms/
  tables/
  charts/

lib/
  api/
  auth/
  db/
  utils/

hooks/
types/
services/
config/
public/
```

The actual project structure takes priority over this recommendation.

Do not move files simply to make the structure look cleaner.

---

# 8. Component Architecture

Create reusable components when:

- the component is used more than once
- the component represents a reusable UI pattern
- the component contains meaningful independent behavior

Examples:

```text
Button
Modal
Dropdown
DataTable
Pagination
SearchInput
FilterPanel
StatusBadge
EmptyState
LoadingState
ErrorState
ConfirmDialog
```

Avoid creating a component for every small HTML element.

Do not over-engineer.

---

# 9. UI/UX Rules

The dashboard should have a consistent visual language.

Maintain consistency for:

- spacing
- typography
- border radius
- colors
- shadows
- buttons
- form controls
- tables
- cards
- navigation
- alerts
- status indicators
- empty states
- loading states

Do not introduce random colors or styles.

Before creating a new visual pattern, inspect existing components.

Prefer existing design tokens and utility classes.

---

# 10. Responsive Design

All pages must be considered for:

- desktop
- tablet
- mobile

Do not design only for a large desktop screen.

Check:

- sidebar behavior
- navigation
- tables
- cards
- forms
- modal width
- horizontal overflow
- text wrapping
- buttons
- charts

Tables should not unintentionally break mobile layouts.

Use horizontal scrolling when appropriate rather than allowing the entire page to overflow.

---

# 11. Accessibility

All interactive UI must be accessible.

Use:

- semantic HTML
- proper labels
- accessible buttons
- keyboard navigation
- visible focus states
- meaningful `aria-*` attributes when needed
- sufficient contrast
- descriptive error messages

Do not use a `<div>` as a button when a `<button>` is appropriate.

Images must have appropriate alternative text unless they are purely decorative.

---

# 12. Forms

Forms must provide:

- clear labels
- validation
- useful error messages
- loading states
- disabled states during submission when appropriate
- success feedback
- accessible fields

Do not rely only on placeholder text as a label.

Validate user input on the server for security-sensitive operations.

Client validation improves UX but does not replace server validation.

---

# 13. Authentication

Authentication is a security-sensitive area.

Never:

- expose passwords
- expose secret tokens
- store plaintext passwords
- trust client-provided roles
- trust client-provided permissions
- expose authentication secrets in browser code
- hardcode credentials

Authorization must be enforced server-side.

The UI may hide unauthorized actions for usability, but hiding a button is not security.

Every protected operation must verify authorization independently.

---

# 14. Authorization and Roles

When roles or permissions exist:

```text
Authentication
    ↓
Identity
    ↓
Role / Permission
    ↓
Authorization
    ↓
Action
```

Do not rely solely on frontend checks.

For example, this is insufficient:

```ts
if (user.role === "admin") {
  // show button
}
```

The corresponding backend/server operation must also enforce the permission.

Use a centralized authorization approach when possible.

---

# 15. API Rules

API logic should be centralized where practical.

Do not duplicate fetch logic across many components.

Handle:

- loading
- success
- empty result
- validation errors
- authentication errors
- authorization errors
- server errors
- network errors

Do not silently swallow errors.

Bad:

```ts
try {
  ...
} catch {}
```

Prefer meaningful error handling.

Never expose internal stack traces or secrets to users.

---

# 16. Database Rules

Database operations must be treated as sensitive.

Do not:

- delete production data casually
- modify schemas without migrations
- bypass validation
- construct unsafe SQL
- expose database credentials
- return unnecessary database fields to the client

Prefer parameterized queries or the project's established ORM/query builder.

When changing database structure:

1. Create the appropriate migration.
2. Update types/models.
3. Update affected services.
4. Update API behavior.
5. Update UI where necessary.
6. Test existing functionality.

---

# 17. Data Fetching

Do not fetch the same data repeatedly without reason.

Before adding a fetch:

1. Check whether the data already exists.
2. Check whether a server component can fetch it.
3. Check whether an existing service already handles it.
4. Check caching requirements.
5. Check whether the data is user-specific.

Avoid unnecessary client-side fetching for data that can safely be obtained server-side.

---

# 18. Tables and Dashboard Data

Tables should support appropriate states:

```text
Loading
Empty
Success
Error
```

For larger datasets, consider:

- pagination
- filtering
- searching
- sorting
- server-side querying

Do not load massive datasets into the browser unnecessarily.

Use stable keys.

Avoid using array indexes as keys when records have stable IDs.

---

# 19. Dashboard Cards and Metrics

Dashboard metrics must have clear meaning.

Each metric should have:

- label
- value
- appropriate unit
- optional comparison
- meaningful status
- loading state
- empty state where applicable

Do not fabricate statistics.

Do not display fake production metrics as if they were real.

If data is unavailable, clearly indicate that it is unavailable.

---

# 20. Audit Logs

Administrative actions should be auditable when the application requires auditability.

Relevant events may include:

- login
- logout
- failed login
- creation
- update
- deletion
- permission changes
- API key changes
- configuration changes
- security-sensitive actions

Audit logs should capture only information that is necessary.

Avoid storing:

- passwords
- authentication secrets
- private tokens
- unnecessary sensitive payloads

Audit records should be difficult for ordinary users to modify or delete.

---

# 21. Security

Treat all external input as untrusted.

Protect against:

- XSS
- SQL injection
- CSRF where applicable
- authentication bypass
- authorization bypass
- insecure direct object references
- sensitive information exposure
- unsafe redirects
- insecure file uploads
- injection attacks

Do not implement custom cryptography when established libraries are available.

Never commit secrets.

Check for:

```text
.env
.env.local
credentials
API keys
tokens
private keys
```

Use environment variables for secrets.

---

# 22. Environment Variables

Never hardcode:

- API keys
- database passwords
- private tokens
- authentication secrets
- deployment credentials

Use environment variables.

Public browser-exposed variables must contain only information that is safe to expose.

Do not prefix a secret with a public environment-variable prefix merely to make it accessible to the browser.

---

# 23. Error Handling

Every major user operation should have predictable error behavior.

Use appropriate:

```text
Loading
Success
Empty
Error
```

Error messages should be:

- understandable
- actionable
- concise

Do not expose internal implementation details.

For developers, log enough information to diagnose the problem without leaking secrets.

---

# 24. Performance

Avoid unnecessary performance optimization.

First make the implementation correct.

Then optimize measurable problems.

Watch for:

- unnecessary re-renders
- excessive client-side JavaScript
- large bundles
- unnecessary API calls
- duplicate requests
- unoptimized images
- expensive database queries
- large client-side datasets

Do not add memoization everywhere without evidence.

---

# 25. Dependencies

Before adding a dependency:

1. Check whether the functionality already exists.
2. Check whether the project already uses a similar package.
3. Check compatibility with the installed Next.js version.
4. Consider bundle size.
5. Consider maintenance status.
6. Consider security implications.

Do not add dependencies for trivial functionality.

---

# 26. File Modification Rules

Do not modify unrelated files.

A change should have a clear reason.

Avoid:

- mass formatting unrelated files
- renaming unrelated components
- changing configuration without necessity
- rewriting working code
- deleting apparently unused files without verification

Keep diffs focused.

---

# 27. Existing Features Are Protected

Assume existing functionality is intentional.

Before changing an existing feature:

1. Understand its purpose.
2. Identify dependencies.
3. Check related routes/components.
4. Check whether other pages use it.
5. Preserve backward compatibility where possible.

Do not remove functionality simply because it is not currently visible.

---

# 28. Routing

Follow the existing routing architecture.

Before creating a route:

- check whether a similar route exists
- check route naming conventions
- check authentication requirements
- check authorization requirements
- check loading/error handling
- check navigation integration

Do not create duplicate routes.

---

# 29. Navigation

When adding a page:

1. Create the page.
2. Add appropriate navigation if required.
3. Ensure active navigation state works.
4. Check responsive behavior.
5. Check authorization visibility.

Do not expose restricted pages through navigation to unauthorized users.

Remember that navigation visibility is not authorization.

---

# 30. State Management

Prefer the simplest state-management solution that fits the problem.

Use:

```text
local state
```

for local UI state.

Use shared state only when multiple unrelated components genuinely need the same state.

Do not introduce a global state library without a clear requirement.

---

# 31. Testing

After meaningful changes, test the affected functionality.

At minimum check:

- TypeScript errors
- lint errors
- build errors
- affected routes
- affected interactions
- authentication behavior if relevant
- responsive behavior when UI changes

Prefer running the project's existing commands rather than inventing new ones.

Check `package.json` for available scripts.

---

# 32. Build Verification

Before declaring a major implementation complete, verify the project can build.

Typical checks may include:

```bash
npm run lint
npm run build
```

Use the actual scripts defined in `package.json`.

Do not claim that a build or test passed if it was not actually executed.

---

# 33. Git Rules

Keep changes focused.

Before committing:

- inspect changed files
- inspect the diff
- remove accidental changes
- ensure no secrets are included
- ensure generated files are handled correctly

Do not rewrite Git history unless explicitly requested.

Do not force-push unless explicitly requested.

Do not delete branches or tags without explicit approval.

---

# 34. Documentation

When implementing a non-obvious architectural decision, document the reason.

Do not document obvious code unnecessarily.

Documentation should explain:

- why something exists
- important constraints
- security considerations
- unusual implementation decisions

Avoid comments that merely repeat the code.

Bad:

```ts
// Set loading to true
setLoading(true);
```

Good:

```ts
// Prevent duplicate submissions while the server action is processing.
setLoading(true);
```

---

# 35. AI Agent Behavior

The AI agent must:

1. Inspect before modifying.
2. Ask for clarification when requirements conflict.
3. Never invent unavailable data.
4. Never claim that a feature works without verification.
5. Never fabricate test results.
6. Never fabricate API responses.
7. Never fabricate database records.
8. Never expose secrets.
9. Never remove working functionality without approval.
10. Prefer minimal changes.
11. Explain important architectural changes.
12. Keep the project consistent.

---

# 36. When Requirements Are Ambiguous

If a request is ambiguous but a safe interpretation exists:

- choose the smallest reasonable implementation
- preserve existing behavior
- avoid irreversible changes

If the ambiguity could affect:

- authentication
- authorization
- database structure
- data deletion
- security
- deployment
- billing
- public data exposure

stop and ask for clarification.

---

# 37. Public Data Rules

Only expose information that is intentionally public.

Do not expose:

- passwords
- tokens
- API keys
- private user information
- internal database fields
- administrative secrets
- confidential business information

If a dataset contains both public and private fields, explicitly select only the public fields.

Never return entire database records by default when only a subset is required.

---

# 38. Privacy

Follow data minimization.

Only collect and display information required for the feature.

Avoid logging sensitive user data.

When implementing logs, errors, analytics, or monitoring, ensure sensitive values do not accidentally appear.

---

# 39. UI Content

Use clear Indonesian or English terminology consistently with the existing application.

Do not mix languages randomly.

Avoid unnecessary placeholder content.

Do not use fake names, fake statistics, or fake operational data unless the interface explicitly represents a demo state.

---

# 40. Empty States

Every data-driven page should handle an empty state.

Example:

```text
No data available
```

Provide an appropriate action when useful:

```text
Create your first provider
```

Do not leave blank screens when data is empty.

---

# 41. Loading States

Avoid showing blank content while data loads.

Use:

- skeletons
- loading indicators
- disabled controls
- appropriate suspense/loading UI

Do not create unnecessarily complicated loading animations.

---

# 42. Confirmation for Destructive Actions

Destructive operations should require appropriate confirmation.

Examples:

- delete
- revoke
- disable
- remove member
- reset configuration
- permanently modify important data

The confirmation should clearly state what will happen.

Avoid ambiguous actions such as:

```text
Are you sure?
```

Prefer:

```text
Delete this API key?
This action cannot be undone.
```

---

# 43. API Keys and Secrets

API keys must be treated as secrets.

Never display full secret keys after creation unless explicitly required by the security model.

Prefer:

```text
••••••••••••abcd
```

or another masked representation.

Provide copy functionality only when appropriate.

Never include secret keys in logs.

Never expose secret keys in URLs.

---

# 44. Monitoring and Activity Data

Monitoring data should distinguish between:

```text
real data
demo data
sample data
unavailable data
```

Never present sample data as real operational data.

Time-series charts should clearly indicate the period and unit.

---

# 45. Changes to Existing Design

When modifying an existing UI:

1. Preserve the overall design language.
2. Preserve existing spacing patterns.
3. Preserve existing interaction behavior.
4. Improve consistency rather than replacing everything.
5. Avoid introducing unrelated visual changes.

If the request is specifically a redesign, then larger visual changes are allowed.

---

# 46. Avoid Overengineering

Do not introduce:

- unnecessary abstractions
- unnecessary design patterns
- unnecessary state libraries
- unnecessary services
- unnecessary wrappers
- unnecessary configuration
- unnecessary dependencies

The simplest correct solution is preferred.

---

# 47. Final Verification Checklist

Before finishing a task, verify:

```text
[ ] Existing functionality was preserved
[ ] No unnecessary files were changed
[ ] No secrets were added
[ ] TypeScript is valid
[ ] Lint passes when applicable
[ ] Build passes when applicable
[ ] Authentication is preserved
[ ] Authorization is preserved
[ ] API behavior is correct
[ ] Error states are handled
[ ] Loading states are handled
[ ] Empty states are handled
[ ] Responsive layout was considered
[ ] Accessibility was considered
[ ] Database changes use the proper migration process
[ ] No fake data was presented as real data
[ ] No unsupported assumptions were made
```

---

# 48. Priority Order

When instructions conflict, follow this priority:

1. Security
2. User requirements
3. Existing project architecture
4. Installed framework/library documentation
5. Existing project conventions
6. Maintainability
7. Performance
8. Visual improvements

Never sacrifice security for convenience.

Never sacrifice user requirements merely to follow a preferred coding style.

---

# 49. Definition of Done

A task is complete only when:

1. The requested functionality has been implemented.
2. Existing functionality still works.
3. The implementation follows the existing architecture.
4. Relevant error states are handled.
5. Relevant loading states are handled.
6. Relevant empty states are handled.
7. Security implications have been considered.
8. TypeScript and lint issues are addressed where applicable.
9. Relevant tests/build checks have been performed.
10. The final implementation does not contain knowingly unfinished placeholder logic unless explicitly requested.

If verification cannot be performed, state that clearly.

Do not claim success without evidence.
