#!/usr/bin/env python3
"""Pruebas A/B — Will App consume Gate SENTINEL vía adaptador (sin duplicar lógica)."""

from __future__ import annotations

import json
import unittest
from pathlib import Path

from receipt import verify_receipt
from will_app_adapter import close_will_cycle, will_cycle_to_case

HERE = Path(__file__).resolve().parent
CASES = HERE / "will_app_cases"


class TestWillAppGateIntegration(unittest.TestCase):
    def test_A_incompleto_amarillo(self):
        cycle = json.loads((CASES / "WILL_AUDIT_A_INCOMPLETO.json").read_text(encoding="utf-8"))
        out = close_will_cycle(cycle)
        self.assertEqual(out["state"], "AMARILLO")
        self.assertTrue(out["open"])
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_A_force_verde_blocked(self):
        cycle = json.loads((CASES / "WILL_AUDIT_A_INCOMPLETO.json").read_text(encoding="utf-8"))
        out = close_will_cycle(cycle, force_verde=True)
        self.assertFalse(out["closed"])
        self.assertEqual(out["gate_status"], "BLOCKED")

    def test_B_completo_verde_receipt(self):
        cycle = json.loads((CASES / "WILL_AUDIT_B_COMPLETO.json").read_text(encoding="utf-8"))
        out = close_will_cycle(cycle)
        self.assertEqual(out["state"], "VERDE")
        self.assertFalse(out["open"])
        self.assertTrue(out["closed"])
        self.assertEqual(out["gate_status"], "AUTHORIZED")
        self.assertIn("receipt", out)
        check = verify_receipt(will_cycle_to_case(cycle), out["receipt"])
        self.assertTrue(check["valid"])
        self.assertTrue(check["authorized_closure"])


if __name__ == "__main__":
    unittest.main()
