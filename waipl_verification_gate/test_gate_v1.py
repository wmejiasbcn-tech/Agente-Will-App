#!/usr/bin/env python3
from __future__ import annotations

import json
import unittest
from pathlib import Path

from final_state import REQUIRED_FIELDS, build_final_state
from gate_close import assert_no_alternate_close_api, close_case
from receipt import case_fingerprint

HERE = Path(__file__).resolve().parent
CASES = HERE / "cases"


class TestFinalStateContract(unittest.TestCase):
    def test_aud_lab_carla_01_contract(self):
        case = json.loads((CASES / "AUD-LAB-CARLA-01.json").read_text(encoding="utf-8"))
        out = close_case(case)
        for f in REQUIRED_FIELDS:
            self.assertIn(f, out)
        self.assertEqual(out["state"], "AMARILLO")
        self.assertFalse(out["closed"])
        self.assertTrue(out["open"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_all_conforme_contract(self):
        case = json.loads((CASES / "CASE_ALL_CONFORME.json").read_text(encoding="utf-8"))
        out = close_case(case)
        self.assertEqual(out["state"], "VERDE")
        self.assertTrue(out["closed"])
        self.assertEqual(out["gate_status"], "AUTHORIZED")
        self.assertEqual(out["receipt"]["case_fingerprint"], case_fingerprint(case))

    def test_bypass_blocked(self):
        case = json.loads((CASES / "AUD-LAB-CARLA-01.json").read_text(encoding="utf-8"))
        out = close_case(case, force_verde=True, force_closed=True, desired_semaforo="VERDE")
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_injected_closed_ignored(self):
        case = json.loads((CASES / "AUD-LAB-CARLA-01.json").read_text(encoding="utf-8"))
        case["closed"] = True
        case["state"] = "VERDE"
        out = close_case(case)
        self.assertFalse(out["closed"])

    def test_rojo_cannot_close(self):
        case = {
            "id": "fail",
            "resultado": True,
            "evidencia": True,
            "verificacion": True,
            "dictamen": True,
            "confirmed_failure": True,
            "requisitos_obligatorios": [{"id": "x", "estado": "CONFORME"}],
        }
        out = close_case(case)
        self.assertEqual(out["state"], "ROJO")
        self.assertFalse(out["closed"])

    def test_fail_safe_ambiguous(self):
        out = build_final_state({"id": "amb", "ambiguous_final_state": True})
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_human_acceptance_required_blocks(self):
        case = json.loads((CASES / "CASE_ALL_CONFORME.json").read_text(encoding="utf-8"))
        case["human_acceptance_required"] = True
        case["human_acceptance"] = False
        out = close_case(case)
        self.assertFalse(out["closed"])

    def test_no_forbidden_apis(self):
        assert_no_alternate_close_api()


if __name__ == "__main__":
    unittest.main()
