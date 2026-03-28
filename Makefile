

.PHONY: runb
runb:
	uv --directory backend run python main.py

.PHONY: runf
runf:
	npm --prefix frontend run dev

.PHONY: run
run:
	make runb & make runf &

.PHONY: formatpy
formatpy:
	@uv --directory backend run ruff format
	@uv --directory backend run ruff check --fix --fix-only

.PHONY: formatjs
formatjs:
	npm --prefix frontend run format

.PHONY: format
format:
	make formatpy & make formatjs

.PHONY: docker
docker:
	podman run \
	--env-file=.env \
    --restart always \
    --publish=7474:7474 --publish=7687:7687 \
	--tls-verify=false \
    neo4j:2026.02.2
