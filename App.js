import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, Button } from 'react-native';
import { Constants, BarCodeScanner, Permissions } from 'expo';

export default class App extends Component {
  state = {
    hasCameraPermission: null,
    barcodeValue: null,
    barcodeType: null
  };

  componentDidMount() {
    this._requestCameraPermission();
  }

  _requestCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  _handleBarCodeRead = ({ type, data }) => {
    const barcodeValue = data;
    const barcodeType = type;

    this.setState({ barcodeValue, barcodeType });
  };

  _handleClearBarcode = () => {
    this.setState({ barcodeValue: null, barcodeType: null });
  }

  render() {
    const { barcodeValue, barcodeType, hasCameraPermission } = this.state;
    const barcodeFriendly = barcodeValue ? barcodeValue : "Scan barcode";
    const barcodeFound = !!barcodeValue;

    let containerStyles = [ styles.container ];

    if (barcodeFound) {
      containerStyles.push({ backgroundColor: "#2ecc71" });
    }

    return (
      <View style={containerStyles}>
        <View style={styles.barcode}>
          { barcodeFound && (
            <Text style={styles.barcodeResult}>
              ✔︎
            </Text>
          )}

          <Text style={styles.barcodeText}>
            { barcodeFriendly }
          </Text>
          <Text style={styles.barcodeType}>
            { barcodeType }
          </Text>
        </View>

        {hasCameraPermission === null ?
          <Text>Requesting for camera permission</Text> :
          hasCameraPermission === false ?
            <Text>Camera permission is not granted</Text> :
            !barcodeFound && (
              <BarCodeScanner
                onBarCodeRead={this._handleBarCodeRead}
                style={{ height: 200, width: 200 }}
              />
            )

        }

        { barcodeFound && (<Button onPress={this._handleClearBarcode } title="Clear" color="#fff" />) }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#2c3e50'
  },
  barcode: {
    marginVertical: 24
  },
  barcodeText: {
    fontSize: 48,
    color: "#fff",
    textAlign: "center",
    marginVertical: 24
  },
  barcodeResult: {
    fontSize: 64,
    textAlign: "center",
    color: "#fff"
  },
  barcodeType: {
    color: "#fff",
    textAlign: "center"
  }
});
