import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useHistory } from "../providers/HistoryContext";
import { useUserInfo } from "../providers/UserInfoContext";
import { useCommandHistory } from "../providers/CommandHistoryContext";
import { COMMANDS } from "../constants/commands";
import { SOCIALS } from "../constants/socials";
import { useThemeContext } from "../providers/ThemeContext";
import { THEMES, type ThemeName } from "../styles/theme";

const Primary = styled.span`
  color: ${({ theme }) => theme.mauve};
`;

const Secondary = styled.span`
  color: ${({ theme }) => theme.teal};
`;

const PromptBodyWrapper = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  margin-right: 10px;
`;

const PromptBody = () => {
  const { username, domain } = useUserInfo();

  return (
    <PromptBodyWrapper>
      <Secondary>{username}</Secondary>
      {"@"}
      <Primary>{domain}</Primary>
      {":~$ "}
    </PromptBodyWrapper>
  );
};

const SuggestedCommand = styled.span<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? `${theme.mauve}80` : "transparent"};
  padding: 2px 4px;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const Caret = styled.span`
  display: inline-block;
  width: 2px;
  margin-right: -2px;
  background-color: ${({ theme }) => theme.mauve};
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
  font-size: 14px;
`;

const PromptLine = styled.div`
  display: flex;
`;

const InputWrapper = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  cursor: text;
`;

const TextArea = styled.div`
  overflow: hidden;
  white-space: nowrap;
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
  const { setTheme } = useThemeContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  const syncCursor = () => {
    requestAnimationFrame(() => {
      setCursorPos(inputRef.current?.selectionStart ?? 0);
      setSelEnd(inputRef.current?.selectionEnd ?? 0);
    });
  };

  const resetBlink = () => {
    const caret = caretRef.current;

    if (!caret) return;

    caret.style.animation = "none";
    void caret.offsetHeight;
    caret.style.animation = "";
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

    const lower = command.toLowerCase().trim();

    if (lower.startsWith("themes set ")) {
      const name = lower.slice("themes set ".length).trim() as ThemeName;
      if (name in THEMES) {
        setTheme(name);
        addLine([
          { text: "theme changed to " },
          { text: name, style: "primary" },
        ]);
      } else {
        addLine([{ text: `theme not found: ${name}` }]);
      }
      return;
    }

    if (lower.startsWith("socials go ")) {
      const name = lower.slice("socials go ".length).trim();
      if (name in SOCIALS) {
        window.open(SOCIALS[name].link, "_blank");

        addLine([
          { text: "opening " },
          { text: name, style: "primary" },
          { text: "..." },
        ]);
      } else {
        addLine([{ text: `social not found: ${name}` }]);
      }
      return;
    }

    switch (lower) {
      case "about":
        addLine([{ text: "\u00A0" }]);
        addLine([
          { text: "Hello, " },
          { text: "friend", style: "primary" },
          { text: "." },
        ]);
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
          { text: "type `" },
          { text: "email", style: "primary" },
          { text: "` to reach me." },
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

        addLine([{ text: "\u00A0" }]);

        Object.entries(SOCIALS).forEach(([social, { link }]) => {
          addLine([
            { text: social.padEnd(maxLen + 4), style: "primary" },
            { text: link },
          ]);
        });

        addLine([{ text: "\u00A0" }]);
        addLine([
          { text: "type " },
          { text: "socials go", style: "primary" },
          { text: " <social-name> to open" },
        ]);
        addLine([{ text: "\u00A0" }]);

        break;
      case "themes":
        addLine([{ text: "\u00A0" }]);
        addLine([{ text: "🌻 latte" }]);
        addLine([{ text: "🪴 frappé" }]);
        addLine([{ text: "🌺 macchiato" }]);
        addLine([{ text: "🌿 mocha" }]);
        addLine([{ text: "\u00A0" }]);
        addLine([
          { text: "type " },
          { text: "themes set", style: "primary" },
          { text: " <theme-name> to change the theme" },
        ]);
        addLine([{ text: "\u00A0" }]);

        break;
      case "whoami":
        addLine([{ text: username }]);

        break;
      default:
        addLine([{ text: `command not found: ${command}` }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    resetBlink();

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

  useEffect(() => {
    const textArea = textAreaRef.current;
    const caret = caretRef.current;

    if (!textArea || !caret) return;

    const caretRight = caret.offsetLeft + caret.offsetWidth;

    if (caretRight > textArea.scrollLeft + textArea.clientWidth) {
      textArea.scrollLeft = caretRight - textArea.clientWidth;
    } else if (caret.offsetLeft < textArea.scrollLeft) {
      textArea.scrollLeft = caret.offsetLeft;
    }
  }, [cursorPos, value]);

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
          resetBlink();
        }}
        onKeyDown={handleKeyDown}
        onSelect={syncCursor}
      />
      <TextArea ref={textAreaRef}>
        {hasSelection ? (
          <>
            <span>{value.slice(0, cursorPos)}</span>
            <Selection>{value.slice(cursorPos, selEnd)}</Selection>
            <span>{value.slice(selEnd)}</span>
          </>
        ) : (
          <>
            <span>{value.slice(0, cursorPos)}</span>
            <Caret ref={caretRef}>{"\u200B"}</Caret>
            <span>{value.slice(cursorPos)}</span>
          </>
        )}
      </TextArea>
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
    <PromptLine>
      <PromptBody />
      <PromptInput onReboot={onReboot} />
    </PromptLine>
  );
};

export { PromptBody, PromptInput };
export default Prompt;
