import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  Button,
} from "react-native";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [date, setDate] = useState("1");

  const getData = async () => {
    try {
      const existingData = await AsyncStorage.getItem("data");
      if (existingData) {
        const existingDataArray = JSON.parse(existingData);
        if (existingDataArray && existingDataArray.length) {
          const foundData = existingDataArray.filter(
            (data) => data.date === date
          );
          if (foundData && foundData.length) {
            const userData = foundData[0];
            console.log("FOUND USER DATA : ", userData);
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            return existingDataArray;
          } else {
            setFirstName("");
            setLastName("");
          }
        }
      } else {
        setFirstName("");
        setLastName("");
      }
    } catch (e) {
      console.log("store error: ", e);
    }
  };

  const storeData = async (value) => {
    try {
      const userData = {
        firstName: firstName,
        lastName: lastName,
        date: date,
      };
      console.log("userDAtra : ", userData);
      const existingData = await AsyncStorage.getItem("data");
      if (existingData) {
        const existingDataArray = JSON.parse(existingData);
        existingDataArray.push(userData);
        await AsyncStorage.setItem("data", JSON.stringify(existingDataArray));
      } else {
        const userDataArray = [userData];
        await AsyncStorage.setItem("data", JSON.stringify(userDataArray));
      }
    } catch (e) {
      console.log("store error: ", e);
    }
  };

  const showAsyncData = () => {
    getData();
  };

  const updateData = async () => {
    try {
      const existingData = await AsyncStorage.getItem("data");

      if (existingData) {
        const existingDataArray = JSON.parse(existingData);

        const newArr = existingDataArray.map((obj) => {
          if (obj.date === date) {
            return { ...obj, firstName: firstName, lastName: lastName };
          }

          return obj;
        });
        await AsyncStorage.setItem("data", JSON.stringify(newArr));
        alert("update succesful");
      } else {
        const userDataArray = [userData];
        await AsyncStorage.setItem("data", JSON.stringify(userDataArray));
      }
    } catch (error) {
      console.log("update error", error);
    }
  };

  const deleteData = async () => {
    try {
      const existingData = await AsyncStorage.getItem("data");

      if (existingData) {
        let existingDataArray = JSON.parse(existingData);

        const itemIndex = existingDataArray.findIndex(
          (data) => data.date === date
        );
        if (itemIndex !== -1) {
          existingDataArray.splice(itemIndex, 1);
        }
        await AsyncStorage.setItem("data", JSON.stringify(existingDataArray));
        setFirstName("");
        setLastName("");
        alert("Delete succesful");
      }
    } catch (error) {
      console.log("update error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalendarProvider
        style={styles.calendarProvider}
        date={date}
        onDateChanged={(date) => {
          // console.log("date:", date);
          setDate(date);
          showAsyncData();
        }}
      >
        <WeekCalendar />
      </CalendarProvider>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="First Name"
          style={styles.input}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
        <TextInput
          placeholder="Last Name"
          style={styles.input}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
        <Button title="Store" onPress={storeData} />
        <Button title="Update" onPress={updateData} />
        <Button title="Delete" onPress={deleteData} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    width: "80%",
    height: 40,
    marginVertical: 10,
    borderRadius: 20,
    padding: 10,
    fontSize: 18,
  },
  calendarProvider: {
    backgroundColor: "red",
    height: 400,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 500,
  },
});
