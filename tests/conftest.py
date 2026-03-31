"""
pytest configuration for the test suite.

Adds the project root directory to sys.path so that ``import app`` works
whether pytest is invoked from the project root or from inside the tests/
directory.
"""

import sys
import os
from pathlib import Path

import dotenv

# Insert project root (parent of this file's directory) at the front of sys.path
sys.path.insert(0, str(Path(__file__).parent.parent))

dotenv.load_dotenv(Path(__file__).parent.parent / ".env", override=False)
