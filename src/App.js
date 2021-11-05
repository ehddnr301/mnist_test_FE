import React, { useState, useRef, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import './styles/App.css'
import axios from 'axios'

function App() {
	const board = useRef(null)
	const [isDrawing, setIsDrawing] = useState(false)
	const [ctx, setCtx] = useState(null)
	const [prediction, setPrediction] = useState('Draw something')
	const [scoresGraph, setScoreGraph] = useState(null)

	useEffect(() => {
		setCtx(board.current.getContext('2d'))
	}, [])

	const handleMouseDown = e => {
		const mouse = e.nativeEvent
		ctx.lineWidth = 7
		ctx.lineJoin = 'round'
		ctx.lineCap = 'round'
		ctx.strokeStyle = 'rgb(255,255,255)'
		ctx.moveTo(mouse.offsetX, mouse.offsetY)
		setIsDrawing(true)
	}

	const handleMouseMove = e => {
		if (isDrawing) {
			const mouse = e.nativeEvent
			ctx.lineTo(mouse.offsetX, mouse.offsetY)
			ctx.stroke()
		}
	}

	const handleMouseUp = () => {
		setIsDrawing(false)
		let img = new Image()
		img.onload = async () => {
			ctx.drawImage(img, 0, 0, 28, 28)
			const data = ctx.getImageData(0, 0, 28, 28).data
			const input = []
			for (let i = 0; i < data.length; i += 4) {
				input.push((data[i + 2] + data[i + 1] + data[i] + data[i - 1] + data[i - 2]) / 5)
			}
			await predict(input)
		}
		img.src = board.current.toDataURL('image/png')
	}


	const handleClearBoard = () => {
		ctx.clearRect(0, 0, board.current.width, board.current.height)
		ctx.beginPath()
		setPrediction(null)
	}

	const predict = async input => {
		let stringify_ipt = JSON.stringify(input)
		stringify_ipt = stringify_ipt.replace('null',0)
		console.log(stringify_ipt)
		console.log(typeof stringify_ipt)
		const r = await axios.put(
			'http://127.0.0.1:8000/predict/mnist',
			{
				mnist_num : stringify_ipt
			}
		)
		console.log(r)
		// const MODEL_URL = process.env.PUBLIC_URL + '/models/model.json'
		// const model = await tf.loadLayersModel(MODEL_URL)
		// const formattedData = tf.tensor(input).reshape([1, 28 * 28])
		// let scores = await model.predict(formattedData).array()
		// scores = scores[0]
		// const maxScore = Math.max(...Object.values(scores))
		// const prediction = scores.indexOf(maxScore)
		// setScoreGraph(buildScoreGraph(scores))
		// setPrediction(prediction)
	}

	const buildScoreGraph = scores => {
		return (
			<ul>
				{scores.map((el, i) => {
					const score = el * 100
					return (
						<li key={i}>
							<span className='text-red-700'>{i}</span>:{' '}
							{score.toFixed(2) + '%'}
						</li>
					)
				})}
			</ul>
		)
	}

	return (
		<div>
			<h1 className='text-teal-400 text-center py-5 font-bold'>
				Digits Recognizer
			</h1>
			<div className='flex justify-center items-center flex-col'>
				<canvas
					ref={board}
					width={300}
					height={300}
					onMouseDown={e => handleMouseDown(e)}
					onMouseMove={e => handleMouseMove(e)}
					onMouseUp={handleMouseUp}
					className='border-2 mr-5'
					style={{ touchAction: 'none' }}
				></canvas>
				<button
					className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded mb-4 mt-4'
					onClick={handleClearBoard}
				>
					Clear
				</button>
				<div className='flex flex-row'>
					<h1 className='p-8 border-2 mt-5 mr-5' style={{ fontSize: '3rem' }}>
						{prediction}
					</h1>

					{scoresGraph}
				</div>
			</div>
			<footer className='fixed left-0 bottom-0 text-center w-full text-gray-400 mt-2'>
				<p>BKHCM - Phúc Hưng</p>
			</footer>
		</div>
	)
}

export default App
