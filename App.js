import React from 'react';
import {View, TextInput, Button, FlatList, Image, Text, TouchableOpacity, Linking} from 'react-native';
import {parseString} from 'react-native-xml2js';
import styles from './styles';

export default class AtomFeedReader extends React.PureComponent {
	constructor(props) {
		super(props);
		this.atomFeedURL = 'https://www.heise.de/newsticker/heise-atom.xml';
		this.state = {
			data: [],
			refreshing: false,
			filterText: ''
		};
		this.filteredData = [];
	};

	componentDidMount() {
    console.log('App mounted', (new Date).toLocaleString());
		this.requestData();
	};

	requestData() {
		fetch(this.atomFeedURL)
		.then(response => response.text())
		.then(xml => {
			parseString(xml, {explicitArray: false, trim: true, mergeAttrs: true}, (err, json) => {
				let now = new Date();
				json.feed.entry.forEach(item => {
					item.title = this.cleanHTML(item.title._);
					item.summary = this.cleanHTML(item.summary._);
					let pub = item.published.split(/[T+]/);
					let pubDate = pub[0].split('-');
					let pubTime = pub[1].split(':');
					let date = (pubDate[0] == now.getFullYear() && pubDate[1] == now.getMonth() + 1 && pubDate[2] == now.getDate())?
						'Heute' :
						pubDate[2] + '.' + pubDate[1] + '.';
					date += ', ' + pubTime[0] + ':' + pubTime[1];
					item.date = date;
				});
				this.setState({
					data: json.feed.entry,
					refreshing: false
        }, () => console.log('Loaded data'));
			});
		})
		.catch(err => console.error(err));
	};

	renderSearchbox = () => {
		return(
			<View style={styles.header}>
				<TextInput
					style={styles.searchbox}
					onChangeText={filterText => this.setState({filterText})}
					value={this.state.filterText}
					placeholder="Suche ..."
					underlineColorAndroid="transparent"
				/>
				<Button
					style={styles.reset}
					onPress={this.handleFilterReset}
					title="Zurücksetzen"
				/>
			</View>
		);
	};

	renderListItem = entry => {
		return(
			<TouchableOpacity onPress={() => this.handleTouch(entry.link.href)}>
				<View style={styles.textbox}>
					<Text style={styles.title}>{entry.title}</Text>
					<View style={styles.itembody}>
						<View style={styles.itembodyImg}>
							<Image style={styles.img} source={{uri: entry.content.div.a.img.src}}/>
							<Text style={styles.date}>{entry.date}</Text>
						</View>
						<Text style={styles.summary}>{entry.summary}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}

	renderSeparator = () => {
		return(
			<View style={styles.separator}/>
		);
	};

	renderFooter = () => {
		let loadedItems = this.state.data.length?
			'Zeige ' + this.filteredData.length + ' von ' + this.state.data.length + ' Einträgen' :
			'Lade Daten ...';
		return(
			<View style={styles.footer}>
				<Text>{loadedItems}</Text>
				<Text style={styles.copyright}>{"Demo-App in React Native von Herbert Braun (2017) als Tutorial für c't Magazin"}</Text>
			</View>
		);
	};

	cleanHTML = text => text
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/--/g, '–');

	handleRefresh = () => {
		console.info('Refreshing data');
		this.setState({
			refreshing: true
		}, () => this.requestData());
	};

	handleTouch = url => {
		console.info('Opening ' + url);
		Linking.openURL(url).catch(err => console.error('Konnte ' + url + ' nicht öffnen'));
	};

	handleFilterReset = () => {
		console.info('Resetting filter');
		this.setState({filterText: ''});
	};

	render() {
		if (this.state.filterText) {
			const filterRegex = new RegExp(String(this.state.filterText), 'i');
			const filter = item => (
				filterRegex.test(item.title) || filterRegex.test(item.summary)
			);
			this.filteredData = this.state.data.filter(filter);
		} else {
			this.filteredData = this.state.data;
		}
		return(
			<FlatList
				data={this.filteredData}
				initialNumToRender="5"
				keyExtractor={entry => entry.id}
				renderItem={entry => this.renderListItem(entry.item)}
				ItemSeparatorComponent={this.renderSeparator}
				ListHeaderComponent={this.renderSearchbox}
				ListFooterComponent={this.renderFooter}
				refreshing={this.state.refreshing}
				onRefresh={this.handleRefresh}
			/>
		);
	};
};
