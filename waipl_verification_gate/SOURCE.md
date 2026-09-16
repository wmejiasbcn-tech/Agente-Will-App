# SOURCE OF TRUTH — WAIPL Verification Gate v1.0

- **Canonical repo:** `wmejiasbcn-tech/SENTINEL`
- **Canonical path:** `07_ACCIONES_Y_VERIFICACIONES/GATE/`
- **Pinned commit:** `f877f2e20b65de64a68ff98aff752b1bc3c23d2c`
- **Distribution:** vendor sync into Will App (`waipl_verification_gate/`)
- **Rule:** Do **not** modify Gate logic in Will App. Sync from SENTINEL only.
- **CI:** `.github/workflows/gate-sync-check.yml` fails if file hashes ≠ `GATE_MANIFEST.json`.

Runtime modules (must match SENTINEL pin):
`gate_close.py`, `gate_evaluate.py`, `final_state.py`, `receipt.py`

Will App–only adapter (not part of SENTINEL Gate core):
`will_app_adapter.py`
