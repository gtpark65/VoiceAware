import React, { Component } from 'react';
import { Platform, View, Text, StyleSheet, Button, ListView } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Header from './components/Header'
import { Buffer } from 'buffer'


export default class SensorsComponent extends Component {

  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {info: "", values: 0, curDevice: ""}
    //this.prefixUUID = "F000AA"
    this.servicePrefixUUID = "AA0"
    this.prefixUUID = "F000AA"
    this.suffixUUID = "-0451-4000-B000-000000000000"
    this.sensors = {
      0: "read value"
    } 
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

  updateValue(key, value) {
    this.setState({values: {...this.state.values, [key]: value}})
  }
   
  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scan()
      })
    } else {
      this.scan()
    }
  }
  scan() { 
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      this.info("Scanning...")
      console.log(device)
      
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
          this.info("reading...")
          return this.read(device)
        })
        .then(() => {
        }, (error) => {
          this.error(error.message)
        })
      }
    });
  }

  async read(device) {
    
      const service = this.serviceUUID(0)
      const characteristicW = this.writeUUID(0)
      const characteristicR = this.readUUID(0)

      this.info("readable: " + characteristicR.isReadable)
      //write
      //const characteristic = await device.writeCharacteristicWithResponseForService(
      //   service, characteristicW, "AQ==" /* 0x01*/
      //)
      //read
      const readCharacteristic = await device.readCharacteristicForService(service,characteristicR);
      const readValueInRawBytes = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(0);
      
      this.setState({
        values: readCharacteristic.value
      });
      /*
      device.monitorCharacteristicForService(service, characteristicR, (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, readValueInRawBytes)
      })*/
    
  }
  render() {
    
    
    return (
      //header
      <View style = {styles.screen}>
        <Header title = "DEVICE SYNC"/>
        <View style = {styles.deviceList}>
          <Text>{this.state.curDevice}</Text>
          <Button title = "connect" onPress={this.connect} />
          
          
        </View>

        <View>
        <Text>{this.state.info}</Text>
        <Text>{this.state.values}</Text>
        
        { 
          /* {{{Object.keys(this.sensors).map((key) => { } }
          return <Text key={key}>
                   {this.sensors[key] + ": " + this.state.values}
                 </Text>
        })} */}
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


