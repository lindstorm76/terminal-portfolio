import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "../providers/HistoryContext";
import { useUserInfo } from "../providers/UserInfoContext";

const Primary = styled.span`
  color: ${({ theme }) => theme.mauve};
`;

const Secondary = styled.span`
  color: ${({ theme }) => theme.teal};
`;

const PromptBody = () => {
  const { username, domain } = useUserInfo();

  return (
    <span>
      <Primary>{username}</Primary>
      {"@"}
      <Secondary>{domain}</Secondary>
      {":~$ "}
    </span>
  );
};

const blink = keyframes`
  0%, 100% { background-color: var(--caret-color); color: var(--caret-bg); }
  50% { background-color: transparent; color: var(--caret-color); }
`;

const Caret = styled.span`
  --caret-color: ${({ theme }) => theme.text};
  --caret-bg: ${({ theme }) => theme.base};
  display: inline-block;
  width: 1ch;
  background-color: var(--caret-color);
  color: var(--caret-bg);
  animation: ${blink} 1s step-end infinite;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
`;

const InputWrapper = styled.div`
  display: inline;
  cursor: text;
`;

const PromptInput = () => {
  const [value, setValue] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addLine, clear } = useHistory();
  const { username, domain } = useUserInfo();

  const syncCursor = () => {
    requestAnimationFrame(() => {
      setCursorPos(inputRef.current?.selectionStart ?? 0);
    });
  };

  const executeCommand = (command: string) => {
    switch (command) {
      case "clear":
        clear();

        break;
      default:
        addLine([{ text: `command not found: ${command}` }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addLine([
        { text: username, style: "primary" },
        { text: "@" },
        { text: domain, style: "secondary" },
        { text: ":~$ " },
        { text: value },
      ]);

      executeCommand(value);

      setValue("");
      setCursorPos(0);
    } else {
      syncCursor();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();

    const handleClick = () => inputRef.current?.focus();

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  const beforeCursor = value.slice(0, cursorPos);
  const atCursor = value[cursorPos] ?? "\u00A0";
  const afterCursor = value.slice(cursorPos + 1);

  return (
    <InputWrapper>
      <HiddenInput
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          syncCursor();
        }}
        onKeyDown={handleKeyDown}
      />
      <span>{beforeCursor}</span>
      <Caret>{atCursor}</Caret>
      <span>{afterCursor}</span>
    </InputWrapper>
  );
};

const Prompt = () => {
  return (
    <div>
      <PromptBody />
      <PromptInput />
    </div>
  );
};

export { PromptBody, PromptInput };
export default Prompt;
