import React, { Component } from 'react';
import { Text, View, Button, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit'
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer'

export class DashboardScreen extends Component {
  constructor(props) {
    super(props);
    this.manager = new BleManager()
    this.state = {
      info: "Not Connected", 
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
    this.connectedDevice = {},
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

  static navigationOptions = {
    title: 'Dashboard',
  };  

  uploadData () {
    alert("Cannot connect to the network.")
    console.log("Attempted to upload data")
  }

  componentDidMount() {
    console.log("Dashboard Component Mounted")
    this.interval = setInterval(() => this.readFromDevice(this.connectedDevice), 5000);
  }

  componentWillUnmount() {
    console.log("Dashboard Component Mounted")
    clearInterval(this.interval);
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

  error(message) {
    this.setState({info: "ERROR: " + message})
  }

  postInfo(message) {
    this.setState({info: message})
  }

  scan() { 
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      
      //For change the device local name.
      this.setState({
        curDevice: device.name
      }) 

      if (error) {
          this.error(error.message)
          return
        }

      if (device.name === 'Simple Peripheral' || device.name === 'SimpleBLEPeripheral') {
        this.postInfo("Connecting to Voice Aware Device")
        this.connectedDevice = device
        
        this.manager.stopDeviceScan()
        
        device.connect()
          .then((device) => {
            this.postInfo("Discovering services and characteristics")
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

    // Write Threshold to Device
    const writeCharacteristic = await device.writeCharacteristicWithResponseForService(
      service, characteristicW, "AQ==" /* decode base64 0x01*/
    )
  }

  //async readFromDevice(device)
  readFromDevice = async (device) => {
    
    this.postInfo("Reading from the Device...")

    const service = this.serviceUUID(0)
    const characteristicR = this.readUUID(0)
    
    try {
      var readCharacteristic = await device.readCharacteristicForService(service, characteristicR);
    } catch(err) {
      console.log(err)
    }
    // Read values variables
    var readValue1 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(0);
    var readValue2 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(2);
    var readValue3 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(4);
    var readValue4 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(6);
    var readValue5 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(8);
    var readValue6 = Buffer.from(readCharacteristic.value, 'base64').readUInt16LE(10);

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
  }
  
  render() {
    const dataLine = {
      labels: ['12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
      datasets: [
        {
          data: [40, 45, 30, 80, 85, 60, 55],
          strokeWidth: 3, // optional
        },
      ],
    };

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around'}}>
        <View style={{flex: 1, alignSelf: 'flex-start', justifyContent: 'space-around', margin: 10}}>
          <Text>Info: {this.state.info}</Text>
          <Text>Timestamp: {this.state.values.timeStamp} sec</Text>
          <Text>SPL: {this.state.values.spl} dB</Text>
          <Text>Pitch: {this.state.values.pitch}</Text>
          <Text>Average Pitch: {this.state.values.AVGPitch}</Text>
          <Text>Min Pitch: {this.state.values.min}</Text>
          <Text>Max Pitch: {this.state.values.max}</Text>

          {/* pitch values should be between 85 - 120 Hz */}
          
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start'}}>
          <LineChart
            data={dataLine}
            width={Dimensions.get('window').width} // from react-native
            height={300}
            yAxisLabel={''}
            xAxisLabel={''}
            chartConfig={{
                backgroundColor: '#rgb(255,255,255)',
                backgroundGradientFrom: 'rgb(0, 51, 160)',
                backgroundGradientTo: 'rgb(0, 40, 100)',
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                }
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}
            />
        </View>

        <View style={{flex: 1, alignSelf: 'stretch', justifyContent: 'flex-end'}}>
          <Button
              title="Access Graph History"
              color="rgb(0, 51, 160)"
              onPress={() => this.props.navigation.navigate('Graph')}
            />
          <Button
              title="Device Setup"
              color="rgb(176, 198, 217)"
              onPress={() => this.props.navigation.navigate('Setup')}
            />
          <Button
              title="Upload Data"
              color="rgb(200, 200, 200)"
              onPress={this.uploadData}
            />
        </View>     
      </View>
    );
  }
}