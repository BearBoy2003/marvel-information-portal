import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import MarvelService from '../../services/MarvelService'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton'
import imageNotAvailable from '../../resources/img/image_not_available.webp'

import './charInfo.scss'

const CharInfo = ({charId}) => {
	const marvelService = useRef(new MarvelService())

	const [char, setChar] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		if (!charId) {
			return
		}

		setLoading(true)
		setError(false)
		marvelService.current
			.getCharacter(charId)
			.then((loadedChar) => {
				setChar(loadedChar)
				setLoading(false)
				setError(false)
			})
			.catch(() => {
				setLoading(false)
				setError(true)
			})
	}, [charId])

	const skeleton = char || loading || error ? null : <Skeleton />
	const errorMessage = error ? <ErrorMessage /> : null
	const spinner = loading ? <Spinner /> : null
	const content = !(loading || error || !char) ? <View char={char} /> : null

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	)
}

const onImageError = (event) => {
	event.currentTarget.onerror = null
	event.currentTarget.src = imageNotAvailable
	event.currentTarget.style.objectFit = 'unset'
}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki, comics} = char

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} onError={onImageError} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{comics.map((item, i) => {
					return (
						<li key={i} className="char__comics-item">
							{item}
						</li>
					)
				})}
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo
