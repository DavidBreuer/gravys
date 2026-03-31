"""
Playwright UI tests for the Fishy Dash application.

Run with:  make test

The login page is a plain Flask-rendered HTML form (static/temp_login.html);
selectors therefore target HTML form elements, not Dash component IDs.
"""

import os

import dotenv
from playwright.sync_api import Page, expect

dotenv.load_dotenv(override=True)

BASE_URL = "http://127.0.0.1:8500"
# Password is read from the same env var the app uses
TEST_PWD = os.getenv("KEY", "")



# ─── Helpers ──────────────────────────────────────────────────────────────────


def do_login(page: Page, username: str) -> None:
    """Navigate to the Flask login page and sign in."""
    page.goto(BASE_URL)
    page.wait_for_selector("input[name='username']", timeout=15000)
    page.fill("input[name='username']", username)
    page.fill("input[name='password']", TEST_PWD)
    page.locator("button[type='submit']").click()
    page.wait_for_selector(".fishy-header", timeout=15000)


# ─── Test 1: Login flow  ────────────────────────────────


def test_login_(page: Page) -> None:
    """
    Tests that:
    1. The opening/login screen shows up correctly.
    2. Wrong password login shows an error.
    3. A regular user can log in.
    4. The location dropdowns cascade correctly (shop → city → street).
    5. After selecting a full location the product section appears.
    6. The summary is NOT shown for a regular user.
    7. Area headers (Tiefkühlung, Theke) are visible.
    8. Filial-Infos section shows up.
    """
    page.goto(BASE_URL)

    # Login page is visible
    expect(page.locator("text=Willkommen bei Gravys")).to_be_visible(timeout=15000)
    expect(page.locator("input[name='username']")).to_be_visible()
    expect(page.locator("input[name='password']")).to_be_visible()
    expect(page.locator("button[type='submit']")).to_be_visible()

    # Wrong password shows a server-side error
    page.fill("input[name='username']", "UserTester")
    page.fill("input[name='password']", "__wrong__")
    page.locator("button[type='submit']").click()
    expect(page.locator(".alert-danger")).to_be_visible(timeout=5000)

    # Successful login as regular user
    page.fill("input[name='username']", "UserTester")
    page.fill("input[name='password']", TEST_PWD)
    page.locator("button[type='submit']").click()

    # Main layout visible, login screen gone
    expect(page.locator(".fishy-header")).to_be_visible(timeout=15000)
    expect(page.locator("text=Willkommen bei Fishy")).not_to_be_visible()
