import { Component } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'

import './charList.scss'

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false
	}

	marvelService = new MarvelService()

	componentDidMount() {
		this.onRequest()
	}

	onRequest = () => {
		this.marvelService
				.getAllCharacters()
				.then(this.onCharListLoaded)
				.catch(this.onError)
	}

	onCharListLoaded = (charList) => {
		this.setState({
			charList: charList.slice(0, 9),
			loading: false
		})
	}

	onError = () => {
		this.setState({
			loading: false,
			error: true
		})
	}

	renderItems = (arr) => {
		const items = arr.map((item, i) => {
			const {name, thumbnail} = item

			return (
				<li key={i} className="char__item">
					<img src={thumbnail} alt={name} />
					<div className="char__name">{name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{items}</ul>
	}

	render() {
		const {charList, loading, error} = this.state
		const errorMessage = error ? <ErrorMessage /> : null
		const spinner = loading ? <Spinner /> : null
		const items = !(loading || error) ? this.renderItems(charList) : null

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{items}
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList