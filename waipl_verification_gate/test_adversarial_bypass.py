#!/usr/bin/env python3
"""AUDITORÍA ADVERSARIAL DE BYPASS — WAIPL Verification Gate v1.0."""

from __future__ import annotations

import copy
import json
import unittest
from pathlib import Path

from gate_close import accept_closure, close_case
from receipt import bind_receipt, case_fingerprint, verify_receipt

HERE = Path(__file__).resolve().parent
CASES = HERE / "cases"


def load(name: str) -> dict:
    return json.loads((CASES / name).read_text(encoding="utf-8"))


class TestAdversarialBypass(unittest.TestCase):
    def test_A_inject_verde_closed_in_case(self):
        case = load("AUD-LAB-CARLA-01.json")
        case["state"] = "VERDE"
        case["closed"] = True
        case["CLOSED"] = True
        case["gate_status"] = "AUTHORIZED"
        out = close_case(case)
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_B_force_flags(self):
        case = load("AUD-LAB-CARLA-01.json")
        out = close_case(case, force_verde=True, force_closed=True, desired_semaforo="VERDE")
        self.assertFalse(out["closed"])
        self.assertTrue(out["bypass_attempt"]["blocked"])

    def test_C_checklist_mutation_after_good_snapshot(self):
        """Mutar checklist de un caso conforme lo invalida; no puede cerrar."""
        case = load("CASE_ALL_CONFORME.json")
        good = close_case(case)
        self.assertTrue(good["closed"])
        mutated = copy.deepcopy(case)
        mutated["requisitos_obligatorios"][0]["estado"] = "PARCIAL"
        out = close_case(mutated)
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_D_reuse_receipt_on_different_case(self):
        """BYPASS histórico: receipt de ALL_CONFORME sobre AUD-LAB-CARLA-01."""
        good_case = load("CASE_ALL_CONFORME.json")
        bad_case = load("AUD-LAB-CARLA-01.json")
        good = close_case(good_case)
        receipt = good["receipt"]
        check = verify_receipt(bad_case, receipt)
        self.assertFalse(check["valid"])
        self.assertFalse(check["authorized_closure"])
        self.assertIn("case_id_mismatch", check["reasons"] + ["case_fingerprint_mismatch"])
        # at least one mismatch reason
        self.assertTrue(
            "case_id_mismatch" in check["reasons"] or "case_fingerprint_mismatch" in check["reasons"]
        )
        acc = accept_closure(bad_case, receipt)
        self.assertFalse(acc["accepted"])
        self.assertFalse(acc["closed"])
        self.assertTrue(acc["bypass_rejected"])

    def test_E_forged_receipt_claims_closed(self):
        case = load("AUD-LAB-CARLA-01.json")
        forged = {
            "case_id": case["id"],
            "case_fingerprint": case_fingerprint(case),
            "state": "VERDE",
            "closed": True,
            "open": False,
            "result_status": "PRESENTE",
            "evidence_status": "SUFICIENTE",
            "verification_status": "CONFORME",
            "dictamen_status": "CERRABLE",
            "gate_status": "AUTHORIZED",
            "mandatory_requirements_pending": [],
            "gate_ref": "forged",
            "seal": "deadbeef",
        }
        check = verify_receipt(case, forged)
        self.assertFalse(check["authorized_closure"])
        self.assertTrue(
            "seal_invalid" in check["reasons"] or "receipt_claims_closed_but_gate_blocks" in check["reasons"]
        )
        acc = accept_closure(case, forged)
        self.assertFalse(acc["closed"])

    def test_F_tamper_seal_after_bind(self):
        case = load("CASE_ALL_CONFORME.json")
        out = close_case(case)
        receipt = copy.deepcopy(out["receipt"])
        receipt["closed"] = True
        receipt["seal"] = "tampered"
        check = verify_receipt(case, receipt)
        self.assertFalse(check["valid"])
        self.assertIn("seal_invalid", check["reasons"])

    def test_G_missing_receipt(self):
        case = load("CASE_ALL_CONFORME.json")
        acc = accept_closure(case, None)  # type: ignore
        self.assertFalse(acc["accepted"])
        self.assertFalse(acc["closed"])

    def test_H_descontextualized_receipt_same_id_different_body(self):
        case = load("CASE_ALL_CONFORME.json")
        out = close_case(case)
        receipt = out["receipt"]
        other = copy.deepcopy(case)
        other["evidence_refs"] = ["tampered-evidence"]
        check = verify_receipt(other, receipt)
        self.assertFalse(check["valid"])
        self.assertIn("case_fingerprint_mismatch", check["reasons"])
        # even if someone re-seals wrong body claiming closed — live gate still must authorize
        # change a requirement to parcial but keep id
        other["requisitos_obligatorios"][0]["estado"] = "DESCONOCIDO"
        # craft receipt with matching fingerprint of OTHER but closed from GOOD — impossible if seal binds fingerprint
        # Accept path:
        acc = accept_closure(other, receipt)
        self.assertFalse(acc["authorized_closure"] if "authorized_closure" in acc else acc["accepted"])

    def test_I_evaluate_alone_does_not_close(self):
        from gate_evaluate import evaluate

        case = load("CASE_ALL_CONFORME.json")
        ev = evaluate(case)
        self.assertNotIn("closed", ev)
        self.assertNotIn("gate_status", ev)

    def test_J_invariant_forall_known_paths(self):
        """∀ close_case outcomes: closed=true ⇒ AUTHORIZED; BLOCKED ⇒ closed=false."""
        for name in ("AUD-LAB-CARLA-01.json", "CASE_ALL_CONFORME.json"):
            out = close_case(load(name))
            if out["closed"]:
                self.assertEqual(out["gate_status"], "AUTHORIZED")
                self.assertEqual(out["state"], "VERDE")
            if out["gate_status"] == "BLOCKED":
                self.assertFalse(out["closed"])


if __name__ == "__main__":
    unittest.main()
