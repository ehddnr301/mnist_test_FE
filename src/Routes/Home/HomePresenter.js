import React from "react";
import styled from "styled-components";
import Plot from "react-plotly.js";
import Mnist from "../Mnist.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const H2 = styled.h2`
  font-size: 36px;
  font-weight: bold;
  color: teal;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const H3 = styled.h3`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Input = styled.input``;

const Select = styled.select``;

const Btn = styled.button`
  color: teal;
  border: 2px solid teal;
  padding: 10px 5px;
  background-color: #fff;
  border-radius: 15px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: teal;
    border: 1px solid black;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  font-size: 18px;
  color: white;
  font-weight: 600;
`;

const Temp = styled.div`
  margin-bottom: 5px;
`;

const HomePresenter = ({
  getInsurance,
  getTemperature,
  changeTemp,
  model_name,
  age,
  bmi,
  children,
  sex,
  smoker,
  region,
  result,
  result2,
  task,
  toggleTask,
  inputs,
  setInputs,
}) => {
  return task === 1 ? (
    <Container>
      <H2 onClick={toggleTask}>Predict Insurance</H2>
      <Wrapper>
        <Box>
          <H3>Age를 입력해주세요.</H3>
          <Input placeholder={"Age"} {...age} />
        </Box>
        <Box>
          <H3>BMI를 입력해주세요.</H3>
          <Input placeholder={"BMI"} {...bmi} />
        </Box>
        <Box>
          <H3>Children 수를 입력해주세요.</H3>
          <Input placeholder={"Children"} {...children} />
        </Box>
        <Box>
          <H3>성별을 선택해주세요.</H3>
          <Select {...sex}>
            <option value={0}>Male</option>
            <option value={1}>Female</option>
          </Select>
        </Box>
        <Box>
          <H3>흡연여부를 선택해주세요.</H3>
          <Select {...smoker}>
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </Select>
        </Box>
        <Box>
          <H3>거주지역을 선택해주세요.</H3>
          <Select {...region}>
            <option value={0}>Southeast</option>
            <option value={1}>Southwest</option>
            <option value={2}>Northwest</option>
            <option value={3}>Northeast</option>
          </Select>
        </Box>
        <Btn
          onClick={() =>
            getInsurance(
              {
                age: age.value,
                bmi: bmi.value,
                children: children.value,
                sex: sex.value,
                smoker: smoker.value,
                region: region.value,
              },
              model_name.value
            )
          }
        >
          Make Prediction
        </Btn>
      </Wrapper>
      {result ? (
        <Result>{`Prediction Insurance : ${result}`}</Result>
      ) : (
        <Result></Result>
      )}
    </Container>
  ) : task == 2 ? (
    <Container>
      <H2 onClick={toggleTask}>Predict Temperature</H2>
      <Wrapper>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
          return (
            <Box>
              <Temp>
                {i !== 7
                  ? `${i * 10}번째까지 온도 평균을 설정해주세요`
                  : `72번째까지 온도 평균을 설정해주세요`}
              </Temp>
              <Input
                id={`r${i}`}
                type="range"
                min={-10}
                max={40}
                step={0.1}
                key={i}
                onChange={({ target }) => {
                  setInputs((state) => ({
                    ...state,
                    [`temp${i}`]: target.value,
                  }));
                  changeTemp(`r${i}`, `t${i}`);
                  console.log(inputs);
                }}
              ></Input>
              <div id={`t${i}`}></div>
            </Box>
          );
        })}
        <Btn onClick={() => getTemperature(inputs)}>Make Prediction</Btn>
      </Wrapper>
      {result2 ? (
        <Plot
          data={[
            {
              x: [...Array(25).keys()],
              y: result2[0],
              type: "scatter",
            },
          ]}
          layout={{
            width: 720,
            height: 480,
            title: "Temperature Plot",
            plot_bgcolor: "23b499",
            paper_bgcolor: "#23b499",
          }}
        />
      ) : (
        <Result></Result>
      )}
    </Container>
  ) : (
    <Mnist toggleTask={toggleTask}></Mnist>
  );
};

export default HomePresenter;
