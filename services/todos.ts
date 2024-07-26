import axios from "axios";

const apiUrl = "http://192.168.219.48:8000/todo";

export type Todo = {
  id?: string | undefined;
  description: string | undefined;
  completed: boolean;
  date: string | undefined;
  start_time: string | undefined;
  end_time: string | undefined;
  group_id: string | number[];
};

export async function createTodo(todo: Todo) {
  try {
    await axios.post(apiUrl, todo);
  } catch (error) {
    console.error("Todo Create Error!!!", error);
  }
}

export async function getTodosAll() {
  try {
    const res = await axios.get(`${apiUrl}s`);
    return res.data;
  } catch (error) {
    console.error("Todo List Error!!!", error);
  }
}

export async function getTodos(date: string) {
  try {
    const res = await axios.get(`${apiUrl}`, {
      params: {
        date: date,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Todo List Error!!!", error);
  }
}

export async function getTodoOne(group_id: string | number[]) {
  try {
    const res = await axios.get(`${apiUrl}/${group_id}`);
    return res.data;
  } catch (error) {
    console.error("Todo get Id Error!!!", error);
  }
}

export async function updateTodo(group_id: string | number[], todo: Todo) {
  try {
    await axios.put(`${apiUrl}/${group_id}`, todo);
  } catch (error) {
    console.error("Todo Update Error!!!", error);
  }
}

export async function deleteTodo(group_id: string | number[]) {
  try {
    await axios.delete(`${apiUrl}/${group_id}`);
  } catch (error) {
    console.error("Todo Delete Error!!!", error);
  }
}
