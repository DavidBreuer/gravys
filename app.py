import os
import io
import base64
from datetime import datetime

import dotenv

dotenv.load_dotenv(override=True)

import psycopg2
import psycopg2.extras
from PIL import Image

import flask
from flask_login import (
    LoginManager,
    UserMixin,
    login_user,
    logout_user,
    login_required,
    current_user,
)
from whitenoise import WhiteNoise

import pandas as pd
from dash import (
    Dash,
    html,
    dcc,
    callback,
    Output,
    Input,
    State,
    ALL,
    ctx,
    no_update,
)
import dash_bootstrap_components as dbc

# ─── Database helpers ──────────────────────────────────────────────────────────



# ─── App setup ─────────────────────────────────────────────────────────────────

app = Dash(
    __name__,
    external_stylesheets=[dbc.themes.BOOTSTRAP, dbc.icons.BOOTSTRAP],
    suppress_callback_exceptions=True,
    meta_tags=[
        {"name": "viewport", "content": "width=device-width, initial-scale=1"},
        {"name": "theme-color", "content": "#27d644"},
        {"name": "mobile-web-app-capable", "content": "yes"},
        {"name": "apple-mobile-web-app-capable", "content": "yes"},
        {"name": "apple-mobile-web-app-status-bar-style", "content": "default"},
        {"name": "apple-mobile-web-app-title", "content": "Gravys"},
    ],
)

server = app.server
server.wsgi_app = WhiteNoise(server.wsgi_app, root="static/")

# ─── Flask-Login setup ──────────────────────────────────────────────────────────

server.secret_key = os.getenv("SECRET_KEY", "")

login_manager = LoginManager()
login_manager.init_app(server)
login_manager.login_view = "login_page"


class User(UserMixin):
    def __init__(self, raw_name):
        self.id = raw_name
        if raw_name.startswith("!!"):
            self.role = "Reviewer"
            self.display_name = raw_name[2:].strip()
        else:
            self.role = "User"
            self.display_name = raw_name


@login_manager.user_loader
def load_user(user_id):
    return User(user_id)


@server.before_request
def require_login():
    """Redirect unauthenticated requests to /login."""
    exempt_prefixes = (
        "/login",
        "/logout",
        "/_dash-component-suites/",
        "/static/",
    )
    if any(flask.request.path.startswith(p) for p in exempt_prefixes):
        return
    if not current_user.is_authenticated:
        return flask.redirect(flask.url_for("login_page"))


_LOGIN_TEMPLATE_PATH = os.path.join(
    os.path.dirname(__file__), "static", "temp_login.html"
)


@server.route("/login", methods=["GET", "POST"])
def login_page():
    if current_user.is_authenticated:
        return flask.redirect("/")
    error = ""
    username_val = ""
    if flask.request.method == "POST":
        username = flask.request.form.get("username", "").strip()
        password = flask.request.form.get("password", "")
        expected_pwd = os.getenv("KEY", "")
        username_val = username
        if not username:
            error = "Ungültige Anmeldedaten."
        elif password != expected_pwd:
            error = "Ungültige Anmeldedaten."
        else:
            display = username[2:].strip() if username.startswith("!!") else username
            if not display:
                error = "Ungültige Anmeldedaten."
            else:
                user = User(username)
                login_user(user)
                next_url = flask.request.args.get("next", "/")
                if not next_url.startswith("/"):
                    next_url = "/"
                return flask.redirect(next_url)
    with open(_LOGIN_TEMPLATE_PATH, encoding="utf-8") as f:
        login_template = f.read()
    return flask.render_template_string(
        login_template, error=error, username_val=username_val
    )


@server.route("/logout")
def logout_page():
    logout_user()
    return flask.redirect(flask.url_for("login_page"))



# ─── Main app layout (header + location + content sections) ────────────────────


layout = html.Div(
    [
        # ── Header ──────────────────────────────────────────────────────────
        html.Div(
            [
                dbc.Container(
                    [
                        dbc.Row(
                            [
                                dbc.Col(
                                    html.Span(
                                        [
                                            html.Img(
                                                src="/favicon.svg",
                                                style={
                                                    "width": "32px",
                                                    "borderRadius": "6px",
                                                    "marginRight": "10px",
                                                    "verticalAlign": "middle",
                                                },
                                            ),
                                            html.Span(
                                                "Fishy",
                                                style={
                                                    "fontWeight": "700",
                                                    "fontSize": "1.25rem",
                                                    "verticalAlign": "middle",
                                                },
                                            ),
                                        ]
                                    ),
                                    width="auto",
                                ),
                                dbc.Col(
                                    html.Div(
                                        [
                                            html.Span(
                                                id="display-username",
                                                style={
                                                    "fontWeight": "600",
                                                    "marginRight": "4px",
                                                },
                                            ),
                                            html.Span(id="display-role-badge"),
                                            html.Span(id="connection-badge"),
                                            html.Span(id="pending-badge"),
                                            dbc.Button(
                                                [
                                                    html.I(
                                                        className="bi bi-box-arrow-right"
                                                    )
                                                ],
                                                id="btn-logout",
                                                color="light",
                                                size="sm",
                                                title="Abmelden",
                                                n_clicks=0,
                                                style={
                                                    "marginLeft": "8px",
                                                    "padding": "2px 8px",
                                                    "borderRadius": "6px",
                                                    "fontSize": "0.8rem",
                                                },
                                            ),
                                        ],
                                        className="text-end d-flex align-items-center justify-content-end gap-1",
                                    ),
                                ),
                            ],
                            align="center",
                        ),
                    ],
                    fluid=True,
                ),
            ],
            className="fishy-header",
        ),
        dbc.Container(
            [
                "asdsdsd"
            ],
            fluid=True,
            style={"maxWidth": "1200px", "paddingBottom": "40px"},
        ),
    ]
)

app.layout = layout


# ─── Run ─────────────────────────────────────────────────────────────────────────

DEBUG = os.environ.get("DEBUG", "false").lower() == "true"
if __name__ == "__main__":
    try:
        app.run(debug=DEBUG, host="0.0.0.0", port=8500)
    except Exception:
        app.run(debug=DEBUG)
