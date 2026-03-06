import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import imageNotAvailable from '../../resources/img/image_not_available.webp'

import './charList.scss'

const BATCH_SIZE = 9

const CharList = ({onCharSelected}) => {
	const marvelService = useRef(new MarvelService())
	const itemRefs = useRef([])

	const [charList, setCharList] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [newItemLoading, setNewItemLoading] = useState(false)
	const [offset, setOffset] = useState(0)
	const [charEnded, setCharEnded] = useState(false)

	const onCharListLoading = () => {
		setNewItemLoading(true)
		setError(false)
	}

	const onCharListLoaded = (newCharList) => {
		const ended = newCharList.length < BATCH_SIZE

		setCharList((prevCharList) => [...prevCharList, ...newCharList])
		setLoading(false)
		setError(false)
		setNewItemLoading(false)
		setOffset((prevOffset) => prevOffset + BATCH_SIZE)
		setCharEnded(ended)
	}

	const onError = () => {
		setLoading(false)
		setError(true)
		setNewItemLoading(false)
	}

	const onRequest = (currentOffset) => {
		onCharListLoading()
		marvelService.current
			.getAllCharacters(currentOffset, BATCH_SIZE)
			.then(onCharListLoaded)
			.catch(onError)
	}

	useEffect(() => {
		setNewItemLoading(true)
		setError(false)
		marvelService.current
			.getAllCharacters(0, BATCH_SIZE)
			.then((newCharList) => {
				const ended = newCharList.length < BATCH_SIZE

				setCharList(newCharList)
				setLoading(false)
				setError(false)
				setNewItemLoading(false)
				setOffset(BATCH_SIZE)
				setCharEnded(ended)
			})
			.catch(() => {
				setLoading(false)
				setError(true)
				setNewItemLoading(false)
			})
	}, [])

	const onImageError = (event) => {
		event.currentTarget.onerror = null
		event.currentTarget.src = imageNotAvailable
		event.currentTarget.style.objectFit = 'unset'
	}

	const setItemRef = (element, index) => {
		itemRefs.current[index] = element
	}

	const focusOnItem = (index) => {
		itemRefs.current.forEach((item) => item && item.classList.remove('char__item_selected'))
		itemRefs.current[index]?.classList.add('char__item_selected')
		itemRefs.current[index]?.focus()
	}

	const handleItemSelect = (id, index) => {
		onCharSelected(id)
		focusOnItem(index)
	}

	const handleItemKeyDown = (event, id, index) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			handleItemSelect(id, index)
		}
	}

	const renderItems = (arr) => {
		const items = arr.map((item, index) => {
			const {id, name, thumbnail} = item
			return (
				<li
					key={id}
					className="char__item"
					tabIndex={0}
					ref={(element) => setItemRef(element, index)}
					onClick={() => handleItemSelect(id, index)}
					onKeyDown={(event) => handleItemKeyDown(event, id, index)}
				>
					<img src={thumbnail} alt={name} onError={onImageError} />
					<div className="char__name">{name}</div>
				</li>
			)
		})

		return <ul className="char__grid">{items}</ul>
	}

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null
	const items = charList.length > 0 ? renderItems(charList) : null

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				className="button button__main button__long"
				disabled={newItemLoading}
				style={{display: charEnded ? 'none' : 'block'}}
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList
