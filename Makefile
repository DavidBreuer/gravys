.PHONY: stop
stop:
	lsof -ti:8500 | xargs kill -9 2>/dev/null; sleep 2;

.PHONY: run
run:
	uv run python app.py

# uv run playwright install
# uv run playwright codegen localhost:8500

# Run ALL tests: unit first (fast), then E2E (requires running app)
.PHONY: test
test:
	DEBUG=false uv run python app.py & sleep 5 &
	uv run pytest tests/test_ui.py -s -v --headed; \
	make stop

.PHONY: format
format:
	@uv run ruff format
	@uv run ruff check --fix --fix-only

.PHONY: gc
gc: stop
	gunicorn -b 0.0.0.0:8500 app:server

.PHONY: docker
docker:
	podman run \
	--env-file=.env \
    --restart always \
    --publish=7474:7474 --publish=7687:7687 \
	--tls-verify=false \
    neo4j:2026.02.2