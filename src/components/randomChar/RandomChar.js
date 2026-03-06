import { useEffect, useRef, useState } from 'react'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import MarvelService from '../../services/MarvelService'
import mjolnir from '../../resources/img/mjolnir.png'
import imageNotAvailable from '../../resources/img/image_not_available.webp'

import './randomChar.scss'

const UPDATE_INTERVAL = 3000

const RandomChar = () => {
	const marvelService = useRef(new MarvelService())
	const timerId = useRef(null)

	const [char, setChar] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	const onCharLoading = () => {
		setLoading(true)
		setError(false)
	}

	const onCharLoaded = (loadedChar) => {
		setChar(loadedChar)
		setLoading(false)
		setError(false)
	}

	const onError = () => {
		setLoading(false)
		setError(true)
	}

	const updateChar = () => {
		const id = Math.floor(Math.random() * 20) + 1

		onCharLoading()
		marvelService.current
			.getCharacter(id)
			.then(onCharLoaded)
			.catch(onError)
	}

	const startAutoUpdate = () => {
		clearInterval(timerId.current)
		timerId.current = setInterval(() => {
			const id = Math.floor(Math.random() * 20) + 1

			setLoading(true)
			setError(false)
			marvelService.current
				.getCharacter(id)
				.then((loadedChar) => {
					setChar(loadedChar)
					setLoading(false)
					setError(false)
				})
				.catch(() => {
					setLoading(false)
					setError(true)
				})
		}, UPDATE_INTERVAL)
	}

	const handleTryItClick = () => {
		updateChar()
		startAutoUpdate()
	}

	useEffect(() => {
		const loadInitialChar = () => {
			const id = Math.floor(Math.random() * 20) + 1

			setLoading(true)
			setError(false)
			marvelService.current
				.getCharacter(id)
				.then((loadedChar) => {
					setChar(loadedChar)
					setLoading(false)
					setError(false)
				})
				.catch(() => {
					setLoading(false)
					setError(true)
				})
		}

		loadInitialChar()
		startAutoUpdate()

		return () => {
			clearInterval(timerId.current)
		}
	}, [])

	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null
	const content = !(loading || error || !char) ? <View char={char} /> : null

	return (
		<div className="randomchar">
			{errorMessage}
			{spinner}
			{content}
			<div className="randomchar__static">
				<p className="randomchar__title">
					Random character for today!<br />
					Do you want to get to know him better?
				</p>
				<p className="randomchar__title">
					Or choose another one
				</p>
				<button onClick={handleTryItClick} className="button button__main">
					<div className="inner">try it</div>
				</button>
				<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
			</div>
		</div>
	)
}

const onImageError = (event) => {
	event.currentTarget.onerror = null
	event.currentTarget.src = imageNotAvailable
	event.currentTarget.style.objectFit = 'unset'
}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki} = char

	return (
		<div className="randomchar__block">
			<img src={thumbnail} alt="Random character" className="randomchar__img" onError={onImageError} />
			<div className="randomchar__info">
				<p className="randomchar__name">{name}</p>
				<p className="randomchar__descr">{description}</p>
				<div className="randomchar__btns">
					<a href={homepage} className="button button__main">
						<div className="inner">homepage</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">Wiki</div>
					</a>
				</div>
			</div>
		</div>
	)
}

export default RandomChar
