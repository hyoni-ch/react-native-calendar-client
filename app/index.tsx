import React from "react";
import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
import Home from "@/components/Home";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CalendarProvider } from "@/components/CalendarContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <QueryClientProvider client={queryClient}>
          <Header />
          <CalendarProvider>
            <Home />
          </CalendarProvider>
        </QueryClientProvider>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
  },
});

export default App;
