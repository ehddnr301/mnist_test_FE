import axios from "axios";
import React, { useCallback, useState } from "react";
import HomePresenter from "./HomePresenter";

const changeTemp = (r, t) => {
  const result = document.getElementById(r);
  const temp = document.getElementById(t);

  temp.innerText = result.value;
};

const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setValue(value);
  };

  return { value, onChange, setValue };
};

const useSelect = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setValue(value);
  };

  return { value, onChange, setValue };
};

const HomeContainer = () => {
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);

  const [task, setTask] = useState(1);
  const model_name = useInput(null);
  const age = useInput(0);
  const bmi = useInput(0);
  const children = useInput(0);
  const sex = useSelect(0);
  const smoker = useSelect(0);
  const region = useSelect(0);

  const [inputs, setInputs] = useState({});

  const generateRandomNumber = (num, cnt = 10) => {
    const min = num - 1;
    const max = num + 1;
    let res = [];
    for (let i = 0; i < cnt; i++) {
      res.push(Math.random() * (max - min) + min);
    }

    return res;
  };

  const getInsurance = useCallback(async (params) => {
    const { age, sex, bmi, children, smoker, region } = params;
    console.log(age, sex, bmi, children, smoker, region);
    const {
      data: { result },
    } = await axios.put(`/predict/insuranc`, {
      age: age,
      sex: sex,
      bmi: parseFloat(bmi),
      children: children,
      smoker: parseInt(smoker),
      region: parseInt(region),
    });
    console.log(result);
    setResult(result);
  });

  const getTemperature = useCallback(async (params) => {
    const tempArr = Object.values(params);
    const a = generateRandomNumber(parseFloat(tempArr[0]));
    let result = [];
    tempArr.forEach((temp, idx) => {
      if (idx == 6) {
        result.push(...generateRandomNumber(parseFloat(temp), 12));
      } else {
        result.push(...generateRandomNumber(parseFloat(temp)));
      }
    });
    const { data } = await axios.put("/predict/atmos", result);

    console.log(data);
    setResult2(data);
  });

  const toggleTask = useCallback(() => {
    if (task == 3) {
      setTask(1);
    } else {
      setTask(task + 1);
    }
  });

  return (
    <HomePresenter
      getInsurance={getInsurance}
      getTemperature={getTemperature}
      changeTemp={changeTemp}
      model_name={model_name}
      age={age}
      bmi={bmi}
      children={children}
      sex={sex}
      smoker={smoker}
      region={region}
      result={result}
      result2={result2}
      task={task}
      toggleTask={toggleTask}
      inputs={inputs}
      setInputs={setInputs}
    />
  );
};

export default HomeContainer;
