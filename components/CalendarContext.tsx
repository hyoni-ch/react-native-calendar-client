import React, { createContext, useContext, useState, ReactNode } from "react";

interface CalendarContextType {
  selectedDate: string | null;
  isModalVisible: boolean;
  isEditVisible: boolean;
  todoId: string;
  clickTodo: (e: any) => void;
  handleDayPress: (date: string) => void;
  toggleVisible: () => void;
  toggleEditVisible: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
  children,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false);
  const [todoId, setTodoId] = useState<string>("");

  const clickTodo = (id: string) => {
    setTodoId(id);
    console.log(id);
    toggleEditVisible();
  };

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
  };

  const toggleVisible = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleEditVisible = () => {
    setIsEditVisible(!isEditVisible);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        isModalVisible,
        isEditVisible,
        todoId,
        clickTodo,
        toggleVisible,
        handleDayPress,
        toggleEditVisible,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
