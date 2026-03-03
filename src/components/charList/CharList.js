import { Component } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import imageNotAvailable from '../../resources/img/image_not_available.webp'

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

	onImageError = (event) => {
		event.currentTarget.onerror = null
		event.currentTarget.src = imageNotAvailable
		event.currentTarget.style.objectFit = 'unset'
	}

	itemRefs = []

	setItemRef = (element, index) => {
		this.itemRefs[index] = element
	}

	focusOnItem = (index) => {
		this.itemRefs.forEach((item) => item && item.classList.remove('char__item_selected'))
		this.itemRefs[index]?.classList.add('char__item_selected')
		this.itemRefs[index]?.focus()
	}

	handleItemSelect = (id, index) => {
		this.props.onCharSelected(id)
		this.focusOnItem(index)
	}

	handleItemKeyDown = (event, id, index) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			this.handleItemSelect(id, index)
		}
	}

	renderItems = (arr) => {
		const items = arr.map((item, index) => {
			const {id, name, thumbnail} = item
			return (
				<li
					key={id}
					className="char__item"
					tabIndex={0}
					ref={(element) => this.setItemRef(element, index)}
					onClick={() => this.handleItemSelect(id, index)}
					onKeyDown={(event) => this.handleItemKeyDown(event, id, index)}
				>
					<img src={thumbnail} alt={name} onError={this.onImageError} />
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
					style={{display: charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList