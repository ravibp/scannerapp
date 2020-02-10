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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
    console.log("error line???", data);
    try {
      let productDetails = JSON.parse(data).productDetails;
      let productID = productDetails.id ? productDetails.id : null;
      this.handleProductVerification(productID);
    } catch {
      this.handleProductVerification(null);
    }
  };
  handleProductVerification = productID => {
    axios
      .get(`http://192.168.2.102:5000/product/${productID}`)
      .then(res => {
        console.log("response", res);

        if (res.data.validProduct) {
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
  handleInputChange = productID => {
    this.setState({
      productID
    });
  };
  handleBackPress = () => {
    this.setState({
      hasPermission: false
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
    let { hasPermission, scanned } = this.state;
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.handleBackPress(this.state.productID)}
          >
            <Ionicons name="ios-arrow-round-back" size={38} color="white" />
          </TouchableOpacity>
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
      <View style={styles.dashboard}>
        <Text style={styles.title}>Scanner App</Text>
        <View style={styles.textBoxContainer}>
          <Text>Enter Product Id:</Text>
          <TextInput
            style={styles.inputText}
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
        <Text style={{ textAlign: "center", marginBottom: 20 }}>OR</Text>
        <View>
          <Text style={{ marginBottom: 10 }}>Scan Product's Barcode:</Text>
          <TouchableOpacity onPress={this.showBarCodeScanner}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={50}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dashboard: {},
  title: {
    fontWeight: "bold",
    fontSize: 30,
    marginBottom: 10
  },
  textBoxContainer: {
    marginVertical: 40
  },
  button: {
    alignItems: "center",
    backgroundColor: "#004ced",
    padding: 10,
    color: "white",
    fontWeight: "bold",
    margin: 5
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20
  },
  inputText: {
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    marginVertical: 10
  }
});
