import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "../providers/HistoryContext";
import { useUserInfo } from "../providers/UserInfoContext";
import { useCommandHistory } from "../providers/CommandHistoryContext";
import { COMMANDS } from "../commands";

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
      <Secondary>{username}</Secondary>
      {"@"}
      <Primary>{domain}</Primary>
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

interface PromptInputProps {
  onReboot: () => void;
}

const PromptInput = ({ onReboot }: PromptInputProps) => {
  const [value, setValue] = useState("");
  const [cursorPos, setCursorPos] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { addLine, clear } = useHistory();
  const { username, domain } = useUserInfo();
  const {
    commands,
    addCommand,
    clear: clearCommands,
    showHistory,
  } = useCommandHistory();

  const syncCursor = () => {
    requestAnimationFrame(() => {
      setCursorPos(inputRef.current?.selectionStart ?? 0);
    });
  };

  const setValueAndMoveCursorToEnd = (newValue: string) => {
    setValue(newValue);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newValue.length, newValue.length);
        setCursorPos(newValue.length);
      }
    });
  };

  const executeCommand = (command: string) => {
    addCommand(command);

    switch (command) {
      case "about":
        addLine([{ text: "Lorem ipsum about me mockup.", display: "block" }]);
        addLine([
          { text: "Software engineer. Lorem ipsum.", display: "block" },
        ]);
        break;

      case "clear":
        clear();
        clearCommands();
        break;

      case "education":
        addLine([
          {
            text: "B.Sc. Computer Science — Lorem University, 20XX",
            display: "block",
          },
        ]);
        addLine([{ text: "Lorem ipsum education details.", display: "block" }]);
        break;

      case "email":
        window.open("mailto:thanapong.angkha@gmail.com");
        addLine([{ text: "opening mail client..." }]);
        break;

      case "help": {
        const maxLen = Math.max(...Object.keys(COMMANDS).map((c) => c.length));

        Object.entries(COMMANDS).forEach(([cmd, { description }]) => {
          addLine([
            { text: cmd.padEnd(maxLen + 4), style: "primary" },
            { text: `- ${description}` },
          ]);
        });
        break;
      }

      case "history":
        showHistory();
        break;

      case "reboot":
        clearCommands();
        onReboot();
        break;

      case "socials":
        addLine([
          { text: "github   ", style: "primary" },
          { text: "https://github.com/lorem" },
        ]);
        break;

      case "whoami":
        addLine([{ text: username }]);
        break;

      default:
        addLine([{ text: `command not found: ${command}` }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addLine([
        { text: username, style: "secondary" },
        { text: "@" },
        { text: domain, style: "primary" },
        { text: ":~$ " },
        { text: value },
      ]);

      executeCommand(value);

      setValue("");
      setCursorPos(0);
      setHistoryIndex(-1);
      setDraft("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      if (commands.length === 0) return;
      if (historyIndex === -1) {
        setDraft(value);

        const newIndex = commands.length - 1;

        setHistoryIndex(newIndex);
        setValueAndMoveCursorToEnd(commands[newIndex]);
      } else if (historyIndex > 0) {
        const newIndex = historyIndex - 1;

        setHistoryIndex(newIndex);
        setValueAndMoveCursorToEnd(commands[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();

      if (historyIndex === -1) return;
      if (historyIndex < commands.length - 1) {
        const newIndex = historyIndex + 1;

        setHistoryIndex(newIndex);
        setValueAndMoveCursorToEnd(commands[newIndex]);
      } else {
        setHistoryIndex(-1);
        setValueAndMoveCursorToEnd(draft);
      }
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

interface PromptProps {
  onReboot: () => void;
}

const Prompt = ({ onReboot }: PromptProps) => {
  return (
    <div>
      <PromptBody />
      <PromptInput onReboot={onReboot} />
    </div>
  );
};

export { PromptBody, PromptInput };
export default Prompt;
