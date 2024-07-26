import { StyleSheet, View, ScrollView, SafeAreaView, Text } from "react-native";
import React from "react";
import DiaryHome from "@/components/DiaryHome";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Diary() {
  return (
    <SafeAreaView>
      <ScrollView>
        <QueryClientProvider client={queryClient}>
          <DiaryHome />
        </QueryClientProvider>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
