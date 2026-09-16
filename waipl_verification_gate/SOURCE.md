# SOURCE OF TRUTH

This directory vendors **WAIPL Verification Gate v1.0** Python modules from:

- Repo: `wmejiasbcn-tech/SENTINEL`
- Path: `07_ACCIONES_Y_VERIFICACIONES/GATE/`
- Commit: `f877f2e20b65de64a68ff98aff752b1bc3c23d2c`

**Do not reimplement** evaluate/close/receipt here. Sync from SENTINEL when the Gate changes.
Will App only adapts *input shaping* and *transport* (see `will_app_adapter.py`, `api/verificationGate.ts`).
