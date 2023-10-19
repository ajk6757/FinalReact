import React, { useState, useEffect } from "react";
import "../main.css";

function TextArea({ initialText, onTextChange }) {
  const maxByte = 50; // 변경된 최대 바이트 수
  const [text, setText] = useState(initialText);

  const calculateByte = (inputText) => {
    const regex = /[^\x00-\x7F]/g;
    return inputText.replace(regex, "aa").length;
  };

  const [totalByte, setTotalByte] = useState(calculateByte(initialText));

  const handleInput = (event) => {
    const newText = event.target.value;
    const byteCount = calculateByte(newText);

    if (byteCount > maxByte) {
      alert(`최대 ${maxByte}Byte까지만 입력 가능합니다.`);
      return;
    }

    setText(newText);
    setTotalByte(byteCount);
    onTextChange(newText); // 작성한 내용을 상위 컴포넌트로 전달
  };

  useEffect(() => {
    // 초기 소개 글이 변경될 때마다 업데이트
    setTotalByte(calculateByte(initialText));
    setText(initialText);
  }, [initialText]);

  return (
    <div className="myinfo-setting-introduce">
      <div className="myinfo-setting-introduce-title">
        <p>소개</p>
      </div>
      <div className="myinfo-setting-introduce-text-area">
        <textarea
          rows="2"
          className="myinfo-setting-introduce-text"
          id="textArea_byteLimit"
          onInput={handleInput}
          value={text}
        ></textarea>
        <sup>
          (<span id="nowByte">{totalByte}</span>/{maxByte}bytes)
        </sup>
      </div>
    </div>
  );
}

export default TextArea;
