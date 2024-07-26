import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { useCalendarContext } from "./CalendarContext";
import { useQuery } from "@tanstack/react-query";
import { getTodosAll } from "@/services/todos";

LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

export default function MyCalendar() {
  const { handleDayPress } = useCalendarContext();

  const today = moment().format("YYYY-MM-DD");
  const { selectedDate } = useCalendarContext();
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodosAll,
  });

  useEffect(() => {
    const markedDatesObj: { [key: string]: any } = {};
    markedDatesObj[today] = {
      selected: true,
      selectedColor: "white",
      selectedTextColor: "#FFA842",
      dotColor: "orange",
      selectedDotColor: "white",
    };

    if (selectedDate) {
      markedDatesObj[selectedDate] = {
        selected: true,
        selectedColor: "#FFA842",
      };
    }

    if (data && data.length > 0) {
      data.forEach((todo: any) => {
        if (!markedDatesObj[todo.date]) {
          markedDatesObj[todo.date] = {};
        }
        markedDatesObj[todo.date].marked = true;
      });
    }
    setMarkedDates(markedDatesObj);
  }, [selectedDate, data]);

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        monthFormat="M월"
        theme={{
          arrowColor: "black",
          textSectionTitleColor: "black",
          dotColor: "orange",
        }}
        onDayPress={(day: any) => {
          handleDayPress(day.dateString);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    margin: 10,
    padding: 10,
  },

  calendar: {},
});
