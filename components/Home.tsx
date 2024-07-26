import { StyleSheet, View, Text } from "react-native";
import React from "react";
import MyCalendar from "./MyCalendar";
import TodoList from "./TodoList";

export default function Home() {
  const date = new Date();

  return (
    <View>
      <Text style={styles.year}>{date.getFullYear()}</Text>
      <MyCalendar />
      <TodoList />
    </View>
  );
}

const styles = StyleSheet.create({
  year: {
    textAlign: "center",
    fontSize: 20,
  },
});
