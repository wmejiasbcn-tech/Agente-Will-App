# GATE v1.0

- Cierre: `gate_close.close_case`
- Aceptación persistida: `accept_closure(case, receipt)`
- Binding: `receipt.py` (`case_fingerprint` + `seal`)

```bash
python3 -m unittest test_gate_v1.py test_adversarial_bypass.py -v
```
