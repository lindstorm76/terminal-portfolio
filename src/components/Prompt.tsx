import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "../providers/HistoryContext";
import { useUserInfo } from "../providers/UserInfoContext";
import { useCommandHistory } from "../providers/CommandHistoryContext";
import { COMMANDS } from "../constants/commands";
import { SOCIALS } from "../constants/socials";

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

const SuggestedCommand = styled.span<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? `${theme.mauve}80` : "transparent"};
  padding: 2px 4px;
`;

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

const Selection = styled.span`
  background-color: ${({ theme }) => theme.surface2};
  color: ${({ theme }) => theme.text};
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
  const [selEnd, setSelEnd] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const { addLine, clear } = useHistory();
  const { username, domain } = useUserInfo();
  const {
    commands,
    addCommand,
    clear: clearCommands,
    showHistory,
  } = useCommandHistory();
  const inputRef = useRef<HTMLInputElement>(null);

  const syncCursor = () => {
    requestAnimationFrame(() => {
      setCursorPos(inputRef.current?.selectionStart ?? 0);
      setSelEnd(inputRef.current?.selectionEnd ?? 0);
    });
  };

  const resetInput = () => {
    setValue("");
    setCursorPos(0);
    setSelEnd(0);
    setHistoryIndex(-1);
    setDraft("");
    setSuggestions([]);
    setSuggestionIndex(-1);
  };

  const setValueAndMoveCursorToEnd = (newValue: string) => {
    setValue(newValue);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newValue.length, newValue.length);
        setCursorPos(newValue.length);
        setSelEnd(newValue.length);
      }
    });
  };

  const executeCommand = (command: string) => {
    addCommand(command);

    switch (command.toLowerCase()) {
      case "about":
        addLine([{ text: "\u00A0" }]);
        addLine([{ text: "Hello, friend." }]);
        addLine([{ text: "\u00A0" }]);
        addLine([
          {
            text: "My name is ",
          },
          {
            text: "Thanapong Ankha",
            style: "bold",
          },
          {
            text: ",",
          },
        ]);
        addLine([
          {
            text: "a passionate developer, builder of things, breaker of things. Bangkok-based.",
          },
        ]);
        addLine([{ text: "\u00A0" }]);
        addLine([
          { text: "type " },
          { text: "email", style: "primary" },
          { text: " to reach me." },
        ]);
        addLine([{ text: "\u00A0" }]);

        break;
      case "clear":
        clear();
        clearCommands();

        break;
      case "education":
        addLine([{ text: "\u00A0" }]);
        addLine([
          {
            text: "Bachelor of Engineering in Computer Engineering",
            style: "primary",
          },
        ]);
        addLine([{ text: "\u00A0" }]);
        addLine([
          {
            text: "Khon Kaen University | GPA: 3.56 | August 2018 - July 2022",
          },
        ]);
        addLine([{ text: "\u00A0" }]);

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
        const maxLen = Math.max(
          ...Object.keys(SOCIALS).map((social) => social.length),
        );

        Object.entries(SOCIALS).forEach(([social, { link }]) => {
          addLine([
            { text: social.padEnd(maxLen + 4), style: "primary" },
            { text: link },
          ]);
        });

        break;
      case "whoami":
        addLine([{ text: username }]);

        break;
      default:
        addLine([{ text: `command not found: ${command}` }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && e.key === "c") {
      addLine([
        { text: username, style: "secondary" },
        { text: "@" },
        { text: domain, style: "primary" },
        { text: ":~$ " },
        { text: value },
      ]);

      resetInput();
    } else if (e.key === "Enter") {
      addLine([
        { text: username, style: "secondary" },
        { text: "@" },
        { text: domain, style: "primary" },
        { text: ":~$ " },
        { text: value },
      ]);

      if (value.trim().length > 0) executeCommand(value);

      resetInput();
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
    } else if (e.key === "Tab") {
      e.preventDefault();

      if (suggestions.length > 0) {
        const nextIndex = (suggestionIndex + 1) % suggestions.length;
        setSuggestionIndex(nextIndex);
        setValueAndMoveCursorToEnd(suggestions[nextIndex]);
      } else {
        if (!value) return;
        const matches = Object.keys(COMMANDS).filter((cmd) =>
          cmd.startsWith(value),
        );
        if (matches.length === 1) {
          setValueAndMoveCursorToEnd(matches[0]);
        } else if (matches.length > 1) {
          setSuggestions(matches);
          setSuggestionIndex(-1);
        }
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

  const hasSelection = selEnd > cursorPos;

  return (
    <InputWrapper>
      <HiddenInput
        ref={inputRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSuggestions([]);
          setSuggestionIndex(-1);
          syncCursor();
        }}
        onKeyDown={handleKeyDown}
        onSelect={syncCursor}
      />
      {hasSelection ? (
        <>
          <span>{value.slice(0, cursorPos)}</span>
          <Selection>{value.slice(cursorPos, selEnd)}</Selection>
          <span>{value.slice(selEnd)}</span>
        </>
      ) : (
        <>
          <span>{value.slice(0, cursorPos)}</span>
          <Caret>{value[cursorPos] ?? "\u00A0"}</Caret>
          <span>{value.slice(cursorPos + 1)}</span>
        </>
      )}
      {suggestions.length > 0 && (
        <div>
          {suggestions.map((cmd, index) => (
            <SuggestedCommand
              style={{
                marginRight: index < suggestions.length - 1 ? "12px" : "0px",
              }}
              key={index}
              selected={suggestionIndex === index}
            >
              {cmd}
            </SuggestedCommand>
          ))}
        </div>
      )}
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
