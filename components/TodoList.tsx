import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, deleteTodo, updateTodo, Todo } from "../services/todos";
import { useCalendarContext } from "./CalendarContext";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import TodoCreate from "@/components/TodoCreate";
import TodoUpdate from "@/components/TodoUpdate";

export default function TodoList() {
  const { selectedDate, clickTodo, toggleVisible } = useCalendarContext();
  const today = moment().format("YYYY-MM-DD");

  const queryClient = useQueryClient();

  const queryKey = selectedDate ? ["todos", selectedDate] : ["todos", today];
  const { data, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => getTodos(selectedDate || today),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: Todo }) =>
      updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleCompleted = (
    id: string | undefined,
    description: string | undefined,
    completed: boolean,
    date: string | undefined,
    start_time: string | undefined,
    end_time: string | undefined,
    group_id: string | number[]
  ) => {
    const updatedTodo: Todo = {
      description,
      completed: !completed,
      date,
      start_time,
      end_time,
      group_id,
    };
    if (id && description && date && start_time && end_time) {
      updateMutation.mutate({ id, todo: updatedTodo });
    }
  };

  const handleDelete = (group_id: string | number[]) => {
    if (group_id) {
      Alert.alert("삭제 확인", "관련된 일정을 전부 삭제하시겠습니까?", [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          onPress: () => {
            deleteMutation.mutate(group_id);
          },
        },
      ]);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" color="#FFA842" />;

  return (
    <View style={styles.centeredView}>
      <Pressable onPress={toggleVisible} style={{ marginBottom: 20 }}>
        <Text>일정 추가하기</Text>
      </Pressable>
      {data && data.length > 0 ? (
        data.map((todo: Todo) => (
          <View key={todo.id} style={styles.todos}>
            <View>
              <BouncyCheckbox
                isChecked={todo.completed}
                onPress={() => {
                  toggleCompleted(
                    todo.id,
                    todo.description,
                    todo.completed,
                    todo.date,
                    todo.start_time,
                    todo.end_time,
                    todo.group_id
                  );
                }}
              />
            </View>
            <View>
              <Text>시작 시간 {todo.start_time}</Text>
            </View>
            <View>
              <Text>종료 시간 {todo.end_time}</Text>
            </View>
            <View>
              <Text>{todo.description}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Pressable
                onPress={() => {
                  clickTodo(todo.group_id);
                }}
              >
                <FontAwesome size={20} name="edit" />
              </Pressable>
              <Pressable
                onPress={() => {
                  handleDelete(todo.group_id);
                }}
              >
                <FontAwesome size={20} name="trash" />
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <View>
          <Text>❤️ 일정이 없습니다 ❤️</Text>
        </View>
      )}

      <TodoCreate />
      <TodoUpdate />
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  todos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});
