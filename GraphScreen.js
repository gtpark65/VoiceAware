import React from 'react'
import { Text, View, Dimensions } from 'react-native';
import {LineChart} from 'react-native-chart-kit'

export class GraphScreen extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }
    
    static navigationOptions = {
        title: 'Graph History',
    };
    
    render() {
        const dataLine = {
            labels: ['1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45', '3:00', '3:15', '3:30'],
            datasets: [
              {
                data: [43.2, 32.4, 50.6, 57.6, 73.2, 68.1, 43.2, 48.3, 35.6, 37.8],
                strokeWidth: 3, // optional
              },
            ],
          };
        return (
            <View style={{ flex: 1, justifyContent: "center"}}>
                <View style={{alignItems: "center"}}>
                    <Text style={{fontSize: 20}} > Avg. SPL Readings (dB) vs Time</Text>
                </View>

                <LineChart
                data={dataLine}
                width={Dimensions.get('window').width} // from react-native
                height={600}
                yAxisLabel={''}
                xAxisLabel={''}
                chartConfig={{
                    backgroundColor: '#rgb(255,255,255)',
                    backgroundGradientFrom: 'rgb(0, 51, 160)',
                    backgroundGradientTo: 'rgb(0, 40, 100)',
                    decimalPlaces: 2, // optional, defaults to 2dp
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
        )
    }
}