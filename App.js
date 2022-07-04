import React from 'react';
import { StyleSheet, View } from 'react-native';
import Dictionary from "./components/Dictionary";

//The main function App
export default function App() {

  //Returns the Dictionary Component
  return (
    <View style={styles.container}>
          <Dictionary/>
    </View>
  );
}

//Style for View
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
