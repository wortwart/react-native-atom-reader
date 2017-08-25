import React from 'react';
import {Text, View, FlatList} from 'react-native';
import {parseString} from 'react-native-xml2js'
import styles from './styles';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: false,
      filterText: '',
    };
  };

  componentDidMount() {
    console.log('App mounted', (new Date).toLocaleString())
    this.requestData();
  };

  requestData() {
    fetch('https://www.heise.de/newsticker/heise-atom.xml')
    .then(response => response.text())
    .then(xml =>
      parseString(xml, {explicitArray: false, trim: true, mergeAttrs: true}, (err, json) => {
        this.setState({
          data: json.feed.entry,
          refreshing: false
        }, () => console.log('Loaded data'));
      })
    )
    .catch(err => console.error(err));
  };

  handleRefresh = () => {
    this.setState({refreshing: true},
      () => this.requestData());
  };

  renderListItem(entry) {
    return(
      <View>
        <Text>{entry.title._}</Text>
        <Text>{entry.summary._}</Text>
      </View>
    )
  };

  render() {
    return(
      <FlatList
        data={this.state.data}
        initialNumToRender="5"
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        keyExtractor={entry => entry.id}
        renderItem={entry => this.renderListItem(entry.item)}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
      />
    );
  }
}
