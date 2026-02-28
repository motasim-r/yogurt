# Baseline Screenshots

## Captures

- `dashboard-reference.png`: current Granola dashboard reference capture.
- `prototype-dashboard.png`: current `granola-prototype` dashboard capture.
- `dashboard-vs-prototype.diff.png`: pixel diff output.

## Visual diff run

Command:

```bash
npm run test:visual -- --baseline ../analysis/granola/recon/runtime/baselines/dashboard-reference.png --actual ../analysis/granola/recon/runtime/baselines/prototype-dashboard.png --diff ../analysis/granola/recon/runtime/baselines/dashboard-vs-prototype.diff.png --threshold 0.03
```

Result:

- `diff_ratio=0.066670`
- threshold: `0.03`
- status: fail (prototype not yet within target parity)
