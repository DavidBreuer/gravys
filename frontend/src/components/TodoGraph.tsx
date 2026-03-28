import { useContext, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Graph from "graphology";
import { Sigma } from "sigma";
import { AuthContext } from "../contexts/AuthContext";
import { RefreshContext } from "../contexts/RefreshContext";

interface Todo {
  id: string;
  item: string;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "in", "on", "at", "to",
  "for", "of", "and", "or", "but", "it", "its", "i", "me", "my",
]);

function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

export default function TodoGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { authHeader } = useContext(AuthContext);
  const { version } = useContext(RefreshContext);
  const sigmaRef = useRef<InstanceType<typeof Sigma> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    fetch("http://localhost:8000/todo", {
      headers: { Authorization: authHeader },
    })
      .then((r) => r.json())
      .then((data: { data: Todo[] }) => {
        const todos = data.data;
        const graph = new Graph();

        todos.forEach((todo, i) => {
          const angle = (2 * Math.PI * i) / Math.max(todos.length, 1);
          graph.addNode(todo.id, {
            label: todo.item.length > 30 ? todo.item.substring(0, 30) + "…" : todo.item,
            todoItem: todo.item,
            todoId: todo.id,
            x: Math.cos(angle),
            y: Math.sin(angle),
            size: 12,
            color: "#27d644",
          });
        });

        for (let i = 0; i < todos.length; i++) {
          for (let j = i + 1; j < todos.length; j++) {
            const wordsI = new Set(getWords(todos[i].item));
            const wordsJ = getWords(todos[j].item);
            if (wordsJ.some((w) => wordsI.has(w))) {
              graph.addEdge(todos[i].id, todos[j].id, { color: "#94a3b8", size: 2 });
            }
          }
        }

        if (containerRef.current) {
          if (sigmaRef.current) sigmaRef.current.kill();
          const isDark = theme.palette.mode === "dark";
          sigmaRef.current = new Sigma(graph, containerRef.current, {
            renderEdgeLabels: false,
            defaultEdgeColor: "#94a3b8",
            labelColor: { color: isDark ? "#ffffff" : "#111111" },
          });

          const showTooltip = (node: string) => {
            const attrs = graph.getNodeAttributes(node);
            if (tooltipRef.current) {
              tooltipRef.current.innerHTML =
                `<strong>${attrs.todoItem}</strong><div style="margin-top:3px;opacity:0.7;font-size:11px">ID: ${attrs.todoId}</div>`;
              tooltipRef.current.style.display = "block";
            }
          };

          sigmaRef.current.on("enterNode", ({ node }) => {
            showTooltip(node);
            if (containerRef.current) containerRef.current.style.cursor = "pointer";
          });

          sigmaRef.current.on("leaveNode", () => {
            if (tooltipRef.current) tooltipRef.current.style.display = "none";
            if (containerRef.current) containerRef.current.style.cursor = "default";
          });

          sigmaRef.current.on("clickNode", ({ node }) => {
            showTooltip(node);
          });
        }
      })
      .catch(console.error);

    return () => {
      if (sigmaRef.current) {
        sigmaRef.current.kill();
        sigmaRef.current = null;
      }
    };
  }, [authHeader, version, theme.palette.mode]);

  const isDark = theme.palette.mode === "dark";

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        Todo Graph
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Nodes are todos. Edges connect todos sharing at least one common word.
      </Typography>
      <div style={{ position: "relative" }}>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "400px",
            border: `1px solid ${isDark ? "#444" : "#e2e8f0"}`,
            borderRadius: "8px",
            background: isDark ? "#1e1e1e" : "#f8fafc",
          }}
        />
        <div
          ref={tooltipRef}
          style={{
            display: "none",
            position: "absolute",
            top: "10px",
            right: "10px",
            background: isDark ? "rgba(30,30,30,0.95)" : "rgba(255,255,255,0.95)",
            color: isDark ? "#fff" : "#111",
            border: `1px solid ${isDark ? "#555" : "#ddd"}`,
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "13px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        />
      </div>
    </Box>
  );
}

