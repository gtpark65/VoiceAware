import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Button, ListView } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Header from './components/Header'
import { Buffer } from 'buffer'


export default class SensorsComponent extends Component {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {
      info: "", 
      values: {
        timeStamp : 0,
        spl : 0,
        pitch : 0, 
        AVGPitch : 0,
        min:0, 
        max: 0,
      },
      curDevice: ""
    }
    this.servicePrefixUUID = "AA0"
    this.prefixUUID = "F000AA"
    this.suffixUUID = "-0451-4000-B000-000000000000"
    
    const subscription = this.manager.onStateChange((state) => {
      if (state === 'PoweredOn') {
          this.scan();
          subscription.remove();
      }
    }, true);
  }

  componentDidMount() {
    console.log("Component mounted")
  }

  serviceUUID(num) {
    return this.servicePrefixUUID + num //+ "0" + this.suffixUUID
  }

  readUUID(num) {
    return this.prefixUUID + num + "1" + this.suffixUUID
  }

  writeUUID(num) {
    return this.prefixUUID + num + "2" + this.suffixUUID
  }
  info(message) {
    this.setState({info: message})
  }

  error(message) {
    this.setState({info: "ERROR: " + message})
  }
  /*
  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }
  */

  scan() { 
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      this.info("Scanning...")
      
      //For chage the device local name.
      this.setState({
        curDevice: device.localName
      })
      
    if (error) {
        this.error(error.message)
        return
      }
    if (device.name === 'Simple Peripheral' || device.name === 'SimpleBLEPeripheral') {
      this.info("Connecting to Simple Peripheral")
      this.manager.stopDeviceScan()
      
      device.connect()
        .then((device) => {
          this.info("Discovering services and characteristics")
          return device.discoverAllServicesAndCharacteristics()
        })
        .then((device) => {
          return this.readFromDevice(device)
        })
        .then(() => {
        }, (error) => {
          this.error(error.message)
        })
      }
    });
  }


  async writeToDevice(device) {
    const service = this.serviceUUID(0)
    const characteristicW = this.writeUUID(0)

    //write
    const characteristic = await device.writeCharacteristicWithResponseForService(
      service, characteristicW, "AQ==" /* decode base64 0x01*/
    )
  }

  //async readFromDevice(device)
  //getSearchList = async (device) =>
  readFromDevice = async (device) => {
    
    this.info("Reading from Device...")

    const service = this.serviceUUID(0)
    const characteristicR = this.readUUID(0)
    
    //read
    const readCharacteristic = await device.readCharacteristicForService(service, characteristicR);
    const readValue1 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(0);
    const readValue2 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(2);
    const readValue3 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(4);
    const readValue4 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(6);
    const readValue5 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(8);
    const readValue6 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(10);

    this.setState({
      values: {
        ...this.state.values,
        timeStamp : readValue1,
        spl : readValue2,
        pitch : readValue3,
        AVGPitch : readValue4,
        min : readValue5,
        max : readValue6
      }
    })

    /*
    device.monitorCharacteristicForService(service, characteristicR, (error, characteristic) => {
      if (error) {
        this.error(error.message)
        return
      }
      this.updateValue(characteristic.uuid, characteristic.value)
    })
    */
  }

  render() {
    
    return (
      //header
      <View style = {styles.screen}>
        <Header title = "DEVICE SYNC"/>
        <View style = {styles.deviceList}>
          <Text>{this.state.curDevice}</Text>
          <Button title = "read" onPress = {() => this.props.readFromDevice()} />
          
        </View>
          <View>
          <Text>{this.state.info}</Text>
          <Text>{this.state.values.timeStamp}</Text>
          <Text>{this.state.values.spl}</Text>
          <Text>{this.state.values.pitch}</Text>
          <Text>{this.state.values.AVGPitch}</Text>
          <Text>{this.state.values.min}</Text>
          <Text>{this.state.values.max}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  deviceList: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  }
})


