

.PHONY: runb
runb:
	uv --directory backend run python main.py

.PHONY: runf
runf:
	npm --prefix frontend run dev

.PHONY: docker
docker:
	podman run \
	--env-file=.env \
    --restart always \
    --publish=7474:7474 --publish=7687:7687 \
	--tls-verify=false \
    neo4j:2026.02.2


