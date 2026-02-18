import { Component } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'

import './charList.scss'

class CharList extends Component {
	batchSize = 9

	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 0,
		charEnded: false
	}

	marvelService = new MarvelService()

	componentDidMount() {
		this.onRequest(this.state.offset)
	}

	onRequest = (offset) => {
		this.onCharListLoading()
		this.marvelService
				.getAllCharacters(offset, this.batchSize)
				.then(this.onCharListLoaded)
				.catch(this.onError)
	}

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
			error: false
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false

		if (newCharList.length < this.batchSize) {
			ended = true
		}

		this.setState(({offset, charList}) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			error: false,
			newItemLoading: false,
			offset: offset + this.batchSize,
			charEnded: ended
		}))
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true,
			newItemLoading: false
		})
	}

	renderItems = (arr) => {
		const items = arr.map((item) => {
			const {id, name, thumbnail} = item
			return (
				<li key={id} className="char__item" onClick={() => this.props.onCharSelected(id)}>
					<img src={thumbnail} alt={name} />
					<div className="char__name">{name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{items}</ul>
	}

	render() {
		const {charList, loading, error, offset, newItemLoading, charEnded} = this.state
		const errorMessage = error ? <ErrorMessage /> : null
		const spinner = loading ? <Spinner /> : null
		const items = charList.length > 0 ? this.renderItems(charList) : null

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{items}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList
