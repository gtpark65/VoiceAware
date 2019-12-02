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
        // const data = [50, 30, 40, 85, 50, 65, 85, 91, 35, 53, 24, 50, 75, 80]
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
            <View style={{ flex: 1, justifyContent: "center"}}>
                <View style={{alignItems: "center"}}>
                    <Text style={{fontSize: 20}} >Vocal SPL Readings</Text>
                </View>

                {/* <LineChart
                    style={{ height: 600 }}
                    data={data}
                    svg={{ stroke: 'rgb(0, 51, 160)' }}
                    contentInset={{ top: 20, left: 20, right: 20, bottom: 20 }}
                    numberOfTicks={20}
                >
                <Grid />
                </LineChart> */}

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