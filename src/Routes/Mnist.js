import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const H1 = styled.h1`
  color: teal;
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  padding: 5rem 0;
`;

const Div1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Canvas1 = styled.canvas`
  border-width: 2px;
  margin-bottom: 15px;
  background-color: black;
`;

const Canvas2 = styled.canvas`
  background-color: black;
`;

const Btn = styled.button`
  transition: background-color 0.3s, color 0.3s;
  background-color: teal;
  color: white;
  :hover {
    background-color: white;
    color: teal;
  }
  font-weight: bold;
  padding: 1rem 2rem;
  font-size: 14px;
  border: 4px solid teal;
  margin: 10px;
`;

const Div2 = styled.div`
  display: flex;
  flex-direction: column;
`;

const SecondH1 = styled.h1`
  padding: 8px;
  border: 2px solid black;
  margin-top: 5px;
  margin-right: 5px;
  font-size: 3rem;
  text-align: center;
`;

const Div3 = styled.div`
  display: flex;
  flex-direction: row;
`;

const H6 = styled.h6`
  padding: 5px;
  border: 2px solid black;
  margin-top: 5px;
  margin-right: 2px;
  font-size: 1rem;
  text-align: center;
`;

function Mnist({ toggleTask }) {
  const board = useRef(null);
  const board2 = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [ctx2, setCtx2] = useState(null);
  const [prediction, setPrediction] = useState("Draw something");
  const [scoresGraph, setScoreGraph] = useState(null);

  const [answer, setAnswer] = useState(null);
  const [percentage, setPercentage] = useState([]);

  useEffect(() => {
    setCtx(board.current.getContext("2d"));
    setCtx2(board2.current.getContext("2d"));
  }, []);

  const handleMouseDown = (e) => {
    const mouse = e.nativeEvent;
    ctx.lineWidth = 15;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.moveTo(mouse.offsetX, mouse.offsetY);
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      const mouse = e.nativeEvent;
      ctx.lineTo(mouse.offsetX, mouse.offsetY);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    let img = new Image();
    img.onload = async () => {
      ctx.drawImage(img, 0, 0, 28, 28);
      const data = ctx.getImageData(0, 0, 28, 28).data;
      const input = [];
      for (let i = 0; i < data.length; i += 4) {
        input.push(
          (data[i + 2] + data[i + 1] + data[i] + data[i - 1] + data[i - 2]) / 5
        );
      }
      await predict(input);
    };
    img.src = board.current.toDataURL("image/png");
  };

  const handleClearBoard = () => {
    ctx.clearRect(0, 0, board.current.width, board.current.height);
    ctx.beginPath();
    setPrediction(null);
  };

  const predict = async (input) => {
    let stringify_ipt = JSON.stringify(input);
    stringify_ipt = stringify_ipt.replace("null", 0);
    console.log(stringify_ipt);
    console.log(typeof stringify_ipt);
    const {
      data: {
        result: { percentage, answer, xai_result },
      },
    } = await axios.put("/predict/mnist", {
      mnist_num: stringify_ipt,
    });
    setPercentage(percentage);
    setAnswer(answer);
    console.log(percentage, answer, xai_result);

    const arr = new Uint8ClampedArray(28 * 28 * 4);
    // const newArr = [];
    // while(xai_result.length) newArr.push(xai_result.splice(0,28))

    for (let i = 0; i < arr.length; i += 4) {
      arr[i + 0] = xai_result[i / 4]; // R value
      arr[i + 1] = xai_result[i / 4]; // G value
      arr[i + 2] = xai_result[i / 4]; // B value
      arr[i + 3] = 255; // A value
    }
    console.log(arr.length);

    let imageData = new ImageData(arr, 28);

    ctx2.putImageData(imageData, 0, 0);
  };

  return (
    <div>
      <H1 onClick={toggleTask}>Digits Recognizer</H1>
      <Div1 className="flex justify-center items-center flex-col">
        <Canvas1
          ref={board}
          width={300}
          height={300}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={(e) => handleMouseMove(e)}
          onMouseUp={handleMouseUp}
          style={{ touchAction: "none" }}
        ></Canvas1>
        <Canvas2 ref={board2} width={28} height={28}></Canvas2>
        <Btn onClick={handleClearBoard}>Clear</Btn>
        <Div2>
          <SecondH1 style={{ fontSize: "3rem", textAlign: "center" }}>
            {answer}
          </SecondH1>
          <Div3>
            {percentage
              ? percentage.map((p, idx) => {
                  return (
                    <H6>
                      <div>{idx}</div>
                      <div>{`${Math.round(p * 100) / 100}%`}</div>
                    </H6>
                  );
                })
              : null}
          </Div3>
        </Div2>
      </Div1>
    </div>
  );
}

export default Mnist;
