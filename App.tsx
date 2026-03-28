import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { clearAndSeedMeals } from "./src/services/mealService";

export default function App(): React.JSX.Element {

  useEffect(() => {
    if (__DEV__) {
      clearAndSeedMeals();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>EasyEats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});