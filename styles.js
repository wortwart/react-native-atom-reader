import {StyleSheet} from 'react-native';

const leftMargin = 14;
const styles = StyleSheet.create({
	header: {
		marginTop: 28,
		marginLeft: 4,
		marginRight: 4,
		flexDirection: 'row'
	},
	searchbox: {
		paddingLeft: 4,
		borderColor: '#ccc',
		borderRadius: 4,
		borderWidth: 1,
		flex: 1
	},
	reset: {
		borderRadius: 4,
		width: 120
	},
	textbox: {
		padding: 4
	},
	title: {
		fontSize: 16,
		lineHeight: 18,
		fontWeight: 'bold'
	},
	itembody: {
		flexDirection: 'row'
	},
	itembodyImg: {},
	date: {
		fontStyle: 'italic',
		color: '#777'
	},
	img: {
		width: 132,
		height: 74.5,
		marginRight: 4
	},
	summary: {
		flex: 1,
		marginTop: 0
	},
	separator: {
		height: 1,
		width: '100%',
		backgroundColor: '#ccc',
		marginTop: 4,
		marginBottom: 4
	},
	footer: {
		paddingVertical: 20,
		borderTopWidth: 1,
		borderColor: '#ccc'
	},
	copyright: {
		marginTop: 20,
		marginLeft: '15%',
		marginRight: '15%',
		borderTopWidth: 1,
		borderColor: '#ccc',
		fontSize: 12,
		textAlign: 'center'
	}
});

export default styles;