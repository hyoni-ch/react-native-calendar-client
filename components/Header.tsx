import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <AntDesign name="user" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "flex-end" },
  user: { marginRight: 10 },
});
