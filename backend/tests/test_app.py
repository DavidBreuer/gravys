import os

from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:5173"


def test_login_page_renders(page: Page):
    """The login page should show username and password fields."""
    page.goto(BASE_URL)
    expect(page.get_by_placeholder("Username")).to_be_visible()
    expect(page.get_by_placeholder("Password")).to_be_visible()


def test_login_success_shows_app(page: Page):
    """A valid login should show the main app header."""
    key = os.getenv("KEY", "secret")
    page.goto(BASE_URL)
    page.get_by_placeholder("Username").fill("testuser")
    page.get_by_placeholder("Password").fill(key)
    page.get_by_role("button", name="Login").click()
    expect(page.get_by_text("Todos")).to_be_visible()
