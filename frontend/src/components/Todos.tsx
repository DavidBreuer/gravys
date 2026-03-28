import React, { useEffect, useState, createContext, useContext } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../contexts/AuthContext";
import { RefreshContext } from "../contexts/RefreshContext";

interface Todo {
  id: string;
  item: string;
}

interface UpdateTodoProps {
  item: string;
  id: string;
  fetchTodos: () => void;
}

interface TodoHelperProps {
  item: string;
  id: string;
  fetchTodos: () => void;
}

interface DeleteTodoProps {
  id: string;
  fetchTodos: () => void;
}

const TodosContext = createContext({
  todos: [] as Todo[],
  fetchTodos: () => {},
  authHeader: "",
  bump: () => {},
});

function AddTodo() {
  const [item, setItem] = React.useState("");
  const { todos, fetchTodos, authHeader, bump } = React.useContext(TodosContext);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodo = { id: String(todos.length + 1), item };
    fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify(newTodo),
    }).then(() => {
      fetchTodos();
      bump();
    });
    setItem("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          fullWidth
          value={item}
          placeholder="Add a todo item"
          onChange={(e) => setItem(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ whiteSpace: "nowrap" }}>
          Add
        </Button>
      </Stack>
    </form>
  );
}

const UpdateTodo = ({ item, id, fetchTodos }: UpdateTodoProps) => {
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState(item);
  const { authHeader } = useContext(AuthContext);
  const { bump } = useContext(RefreshContext);

  const updateTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ item: todo }),
    });
    setOpen(false);
    await fetchTodos();
    bump();
  };

  return (
    <>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Todo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={updateTodo} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const DeleteTodo = ({ id, fetchTodos }: DeleteTodoProps) => {
  const { authHeader } = useContext(AuthContext);
  const { bump } = useContext(RefreshContext);
  const deleteTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: authHeader },
      body: JSON.stringify({ id }),
    });
    await fetchTodos();
    bump();
  };

  return (
    <IconButton size="small" onClick={deleteTodo} color="error">
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
};

function TodoHelper({ item, id, fetchTodos }: TodoHelperProps) {
  return (
    <ListItem
      divider
      secondaryAction={
        <Stack direction="row" spacing={0.5}>
          <UpdateTodo item={item} id={id} fetchTodos={fetchTodos} />
          <DeleteTodo id={id} fetchTodos={fetchTodos} />
        </Stack>
      }
    >
      <ListItemText primary={item} />
    </ListItem>
  );
}

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { authHeader } = useContext(AuthContext);
  const { bump } = useContext(RefreshContext);
  const fetchTodos = React.useCallback(async () => {
    const response = await fetch("http://localhost:8000/todo", {
      headers: { Authorization: authHeader },
    });
    const data = await response.json();
    setTodos(data.data);
  }, [authHeader]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <TodosContext.Provider value={{ todos, fetchTodos, authHeader, bump }}>
      <Container maxWidth="md" sx={{ pt: "80px" }}>
        <AddTodo />
        <Box mt={2}>
          {todos.length === 0 && (
            <Typography color="text.secondary" mt={2}>
              No todos yet. Add one above!
            </Typography>
          )}
          <List disablePadding>
            {todos.map((todo) => (
              <TodoHelper key={todo.id} item={todo.item} id={todo.id} fetchTodos={fetchTodos} />
            ))}
          </List>
        </Box>
      </Container>
    </TodosContext.Provider>
  );
}
