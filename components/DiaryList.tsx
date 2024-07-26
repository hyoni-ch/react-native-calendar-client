import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getDiary } from "@/services/diary";

export default function DiaryList() {
  const { data, isLoading } = useQuery({
    queryKey: ["diary"],
    queryFn: () => getDiary(),
  });

  if (isLoading) return <ActivityIndicator size="large" color="#FFA842" />;

  return (
    <View style={styles.container}>
      <Text>다이어리 추가하기</Text>
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemName}>{item.title}</Text>
              <Text>{item.description}</Text>
            </View>
          )}
        />
      ) : (
        <Text>❤️ 작성한 다이어리가 없습니다 ❤️</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  item: {
    marginBottom: 10,
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
