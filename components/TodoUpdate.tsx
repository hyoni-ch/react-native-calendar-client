import {
  StyleSheet,
  Alert,
  View,
  TextInput,
  Pressable,
  Modal,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodoOne, updateTodo, Todo } from "../services/todos";
import { useCalendarContext } from "./CalendarContext";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

export default function TodoUpdate() {
  const { todoId, selectedDate, isEditVisible, toggleEditVisible } =
    useCalendarContext();
  const [todoData, setTodoData] = useState<Todo | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState({
    startDate: false,
    endDate: false,
  });
  const [isTimePickerVisible, setTimePickerVisibility] = useState({
    start: false,
    end: false,
  });
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const currentDate = new Date();
  const today =
    currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    currentDate.getDate().toString().padStart(2, "0");

  const { data } = useQuery({
    queryKey: ["todo", todoId],
    queryFn: () => getTodoOne(todoId),
  });

  const togglePickerVisibility = (
    picker: "startDate" | "endDate" | "start" | "end",
    visible: boolean
  ) => {
    if (picker === "startDate" || picker === "endDate") {
      setDatePickerVisibility((prev) => ({ ...prev, [picker]: visible }));
    } else {
      setTimePickerVisibility((prev) => ({ ...prev, [picker]: visible }));
    }
  };

  const mutation = useMutation({
    mutationFn: ({ id, todo }: { id: string; todo: Todo }) =>
      updateTodo(id, todo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleConfirm = (
    picker: "startDate" | "endDate" | "start" | "end",
    value: Date
  ) => {
    if (picker === "startDate" || picker === "endDate") {
      const formattedDate = moment(value).format("YYYY-MM-DD");
      if (picker === "startDate") {
        setStartDate(formattedDate);
        if (!endDate || moment(formattedDate).isAfter(moment(endDate))) {
          setEndDate(formattedDate);
        }
      } else if (picker === "endDate") {
        if (startDate && moment(formattedDate).isBefore(moment(startDate))) {
          Alert.alert("종료 날짜는 시작 날짜보다 이전일 수 없습니다!");
          return;
        }
        setEndDate(formattedDate);
      }
      togglePickerVisibility(picker, false);
    } else {
      const formattedTime = moment(value).format("HH:mm");
      if (
        picker === "end" &&
        startTime &&
        moment(formattedTime, "HH:mm").isBefore(moment(startTime, "HH:mm"))
      ) {
        if (startDate === endDate) {
          Alert.alert("종료 시간은 시작 시간보다 이전일 수 없습니다!");
          return;
        }
      }
      if (picker === "start") {
        setStartTime(formattedTime);
      } else {
        setEndTime(formattedTime);
      }
      togglePickerVisibility(picker, false);
    }
  };

  const handleSubmit = () => {
    if (description === "") {
      Alert.alert("내용을 입력해주세요!");
      return;
    }
    const updatedTodo: Todo = {
      ...todoData!,
      description: description || "",
    };
    mutation.mutate({ id: todoId.toString(), todo: updatedTodo });
    Alert.alert("수정이 완료되었습니다.");
  };

  useEffect(() => {
    if (data) {
      setTodoData({ ...data });
      setDescription(data.description);
      setEndTime(data.end_time);
      setStartTime(data.start_time);
    } else {
      setTodoData(null);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      {todoData !== null && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditVisible}
          onRequestClose={toggleEditVisible}
          style={{ height: 300 }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Pressable onPress={toggleEditVisible}>
                  <Text style={styles.button}>취소</Text>
                </Pressable>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  일정 수정
                </Text>
                <Pressable
                  onPress={() => {
                    handleSubmit();
                    toggleEditVisible();
                  }}
                >
                  <Text style={styles.button}>수정</Text>
                </Pressable>
              </View>
              <View style={styles.inputBox}>
                <View>
                  <TextInput
                    style={styles.input}
                    value={description || ""}
                    onChangeText={setDescription}
                    placeholder="할 일을 입력하세요"
                  />
                </View>

                {/* <View>
                <TextInput
                  style={styles.input}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="장소"
                />
              </View> */}

                <View style={styles.pickerContainer}>
                  <View>
                    <Text>시작</Text>
                  </View>

                  <View style={styles.row}>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.startDate}
                      mode="date"
                      onConfirm={(value) => handleConfirm("startDate", value)}
                      onCancel={() =>
                        togglePickerVisibility("startDate", false)
                      }
                      locale="ko"
                      confirmTextIOS="확인"
                      cancelTextIOS="취소"
                    />

                    <Pressable
                      onPress={() => togglePickerVisibility("startDate", true)}
                    >
                      <View style={styles.dateBtn}>
                        <FontAwesome size={20} name="calendar" />
                        <Text>
                          {startDate
                            ? startDate
                            : selectedDate
                            ? selectedDate
                            : today}
                        </Text>
                      </View>
                    </Pressable>

                    <DateTimePickerModal
                      isVisible={isTimePickerVisible.start}
                      // date={start_time}
                      mode="time"
                      onConfirm={(value) => handleConfirm("start", value)}
                      onCancel={() => togglePickerVisibility("start", false)}
                      locale="ko"
                      confirmTextIOS="확인"
                      cancelTextIOS="취소"
                    />

                    <Pressable
                      onPress={() => togglePickerVisibility("start", true)}
                    >
                      <View style={styles.dateBtn}>
                        <AntDesign
                          name="clockcircleo"
                          size={20}
                          color="black"
                        />
                        <Text>{startTime ? startTime : "시작 시간"}</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.pickerContainer}>
                  <View>
                    <Text>종료</Text>
                  </View>

                  <View style={styles.row}>
                    <DateTimePickerModal
                      isVisible={isDatePickerVisible.endDate}
                      mode="date"
                      onConfirm={(value) => handleConfirm("endDate", value)}
                      onCancel={() => togglePickerVisibility("endDate", false)}
                      locale="ko"
                      confirmTextIOS="확인"
                      cancelTextIOS="취소"
                    />

                    <Pressable
                      onPress={() => togglePickerVisibility("endDate", true)}
                    >
                      <View style={styles.dateBtn}>
                        <FontAwesome size={20} name="calendar" />
                        <Text>
                          {endDate
                            ? endDate
                            : selectedDate
                            ? selectedDate
                            : today}
                        </Text>
                      </View>
                    </Pressable>

                    <DateTimePickerModal
                      isVisible={isTimePickerVisible.end}
                      mode="time"
                      // date={end_time}
                      onConfirm={(value) => handleConfirm("end", value)}
                      onCancel={() => togglePickerVisibility("end", false)}
                      locale="ko"
                      confirmTextIOS="확인"
                      cancelTextIOS="취소"
                    />

                    <Pressable
                      onPress={() => togglePickerVisibility("end", true)}
                    >
                      <View style={styles.dateBtn}>
                        <AntDesign
                          name="clockcircleo"
                          size={20}
                          color="black"
                        />
                        <Text>{endTime ? endTime : "종료 시간"}</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "#FDDFA5",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inputBox: {
    gap: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  button: {
    color: "#DF0101",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  dateBtn: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
  },
});
