import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { RefreshContext } from "../contexts/RefreshContext";

interface Neo4jNode {
  [key: string]: unknown;
}

export default function Neo4jNodes() {
  const { authHeader } = useContext(AuthContext);
  const { version } = useContext(RefreshContext);
  const [nodes, setNodes] = useState<Neo4jNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/neo4j/nodes", {
      headers: { Authorization: authHeader },
    })
      .then((r) => r.json())
      .then((data) => {
        setNodes(data.data ?? []);
        if (data.error) setError(data.error);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [authHeader, version]);

  return (
    <Box mt={3} mb={8}>
      <Typography variant="h6" gutterBottom>
        Neo4j Nodes
      </Typography>
      {loading && <CircularProgress size={24} />}
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Neo4j unavailable: {error}
        </Alert>
      )}
      {!loading && nodes.length === 0 && !error && (
        <Typography variant="body2" color="text.secondary">
          No nodes found.
        </Typography>
      )}
      <Stack spacing={1}>
        {nodes.map((node, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
            {Object.entries(node).map(([k, v], j) => (
              <Box key={k}>
                {j > 0 && <Divider sx={{ my: 0.5 }} />}
                <Typography variant="body2" fontFamily="monospace">
                  <strong>{k}:</strong> {String(v)}
                </Typography>
              </Box>
            ))}
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
