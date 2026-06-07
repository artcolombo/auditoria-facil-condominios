import sys
from pathlib import Path

# Ensure backend package is importable when running tests from the repository root.
# This appends the 'backend' directory to sys.path so tests can import 'app' directly.

ROOT = Path(__file__).resolve().parent
BACKEND_PATH = str(ROOT / "backend")

if BACKEND_PATH not in sys.path:
    sys.path.insert(0, BACKEND_PATH)
