#!/bin/sh
set -e
cd "$(dirname "$0")"
python3 -m unittest test_will_app_integration.py -v
