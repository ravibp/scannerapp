import React, { Component } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput
} from "react-native";
import axios from "axios";

export default class Dashboard extends Component {
  state = {
    hasPermission: null,
    scanned: false,
    productID: ""
  };
  getScannerPermissions = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({
      hasPermission: status === "granted"
    });
  };
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({
      scanned: true
    });
    let productDetails = JSON.parse(data).productDetails;
    console.log("productDetails", productDetails);

    let productID = productDetails.id ? productDetails.id : null;
    this.handleProductVerification(productID);
  };
  handleProductVerification = productID => {
    console.log("api calling");
    axios
      // .get("https://jsonplaceholder.typicode.com/todos/1")
      .get(`http://192.168.2.102:5000/product/${productID}`)
      .then(res => {
        if (res.data.valid) {
          return alert(`
            Product is Valid.
            Product Details: 
            ${JSON.stringify(res.data)}
          `);
        }
        return alert("Product is Invalid");
      })
      .catch(error => {
        console.log("Error", error);
        return alert("Product is Invalid");
      });
  };
  handleInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  showBarCodeScanner = async () => {
    await this.getScannerPermissions();
    if (!this.state.hasPermission) {
      alert("No access granted to BarCode Scanner.");
    } else {
    }
  };
  render() {
    let { hasPermission, scanned, status } = this.state;
    // if (hasPermission === null) {
    //   return <Text>Requesting for camera permission</Text>;
    // }
    // if (hasPermission === false) {
    //   return <Text>No access to camera</Text>;
    // }
    if (hasPermission) {
      return (
        <>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          {scanned && (
            <Button
              title={"Tap to Scan Again"}
              onPress={() =>
                this.setState({
                  scanned: false
                })
              }
            />
          )}
        </>
      );
    }
    return (
      <View>
        <Text>Scanner App</Text>
        <View>
          <Text>Enter Product Id:</Text>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={this.handleInputChange}
            name="productID"
            value={this.state.productID}
          />
          <TouchableOpacity
            onPress={() => this.handleProductVerification(this.state.productID)}
          >
            <Text style={styles.button}>Verify Product</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={this.showBarCodeScanner}>
            <Text style={styles.button}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});
