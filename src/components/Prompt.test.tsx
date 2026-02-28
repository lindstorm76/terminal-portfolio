import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { catppuccinMacchiato as theme } from "../styles/theme";
import { HistoryProvider, useHistory } from "../providers/HistoryContext";
import { UserInfoProvider } from "../providers/UserInfoContext";
import { CommandHistoryProvider } from "../providers/CommandHistoryContext";
import { COMMANDS } from "../constants/commands";
import { SOCIALS } from "../constants/socials";
import Prompt from "./Prompt";

vi.mock("@scaleway/random-name", () => ({
  default: () => "hellofriend",
}));

// Renders history lines so we can assert on command output
const HistoryOutput = () => {
  const { lines } = useHistory();
  return (
    <>
      {lines.map((line, i) => (
        <div key={i}>
          {line.parts.map((part, j) => (
            <span key={j}>{part.text}</span>
          ))}
        </div>
      ))}
    </>
  );
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    <UserInfoProvider>
      <HistoryProvider>
        <CommandHistoryProvider>{children}</CommandHistoryProvider>
      </HistoryProvider>
    </UserInfoProvider>
  </ThemeProvider>
);

const renderPrompt = (onReboot = vi.fn()) =>
  render(
    <Wrapper>
      <HistoryOutput />
      <Prompt onReboot={onReboot} />
    </Wrapper>,
  );

const getInput = () => document.querySelector("input")!;

const typeCommand = (value: string) => {
  fireEvent.change(getInput(), { target: { value } });
};

const pressKey = (key: string, opts: object = {}) => {
  fireEvent.keyDown(getInput(), { key, ...opts });
};

const runCommand = (command: string) => {
  typeCommand(command);
  pressKey("Enter");
};

describe("Prompt", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── PromptBody ────────────────────────────────────────────────────────────

  describe("PromptBody", () => {
    it("renders the username", () => {
      renderPrompt();
      expect(screen.getByText("hellofriend")).toBeInTheDocument();
    });

    it("renders the domain", () => {
      renderPrompt();
      expect(screen.getByText("terminal.thanapong.dev")).toBeInTheDocument();
    });

    it("renders the prompt separator", () => {
      renderPrompt();
      expect(document.body.textContent).toContain(":~$ ");
    });
  });

  // ─── PromptInput – focus ───────────────────────────────────────────────────

  describe("focus", () => {
    it("focuses the hidden input on mount", () => {
      renderPrompt();
      expect(document.activeElement).toBe(getInput());
    });
  });

  // ─── PromptInput – typing ──────────────────────────────────────────────────

  describe("typing", () => {
    it("reflects typed value in the hidden input", () => {
      renderPrompt();
      typeCommand("hello");
      expect(getInput()).toHaveValue("hello");
    });

    it("clears the input after Enter", () => {
      renderPrompt();
      runCommand("whoami");
      expect(getInput()).toHaveValue("");
    });
  });

  // ─── PromptInput – Enter ───────────────────────────────────────────────────

  describe("Enter", () => {
    it("echoes the prompt line (username + domain + command) to history", () => {
      renderPrompt();
      runCommand("whoami");

      // prompt line parts are rendered by HistoryOutput
      const usernameCells = screen.getAllByText("hellofriend");
      expect(usernameCells.length).toBeGreaterThanOrEqual(2); // PromptBody + history echo

      expect(
        screen.getAllByText("terminal.thanapong.dev").length,
      ).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("whoami")).toBeInTheDocument();
    });

    it("does not execute a command when the input is empty", () => {
      renderPrompt();
      pressKey("Enter");
      expect(screen.queryByText(/command not found/)).not.toBeInTheDocument();
    });

    it("does not execute a command when the input is whitespace only", () => {
      renderPrompt();
      runCommand("   ");
      expect(screen.queryByText(/command not found/)).not.toBeInTheDocument();
    });
  });

  // ─── PromptInput – commands ────────────────────────────────────────────────

  describe("commands", () => {
    it("whoami outputs the username", () => {
      renderPrompt();
      runCommand("whoami");
      // PromptBody + history echo + whoami output = at least 3
      expect(screen.getAllByText("hellofriend").length).toBeGreaterThanOrEqual(
        3,
      );
    });

    it("about outputs biographical content", () => {
      renderPrompt();
      runCommand("about");
      expect(document.body.textContent).toContain("Hello,");
      expect(document.body.textContent).toContain("friend");
      expect(document.body.textContent).toContain("Bangkok");
      expect(document.body.textContent).toContain("reach me");
    });

    it("education outputs the degree and institution", () => {
      renderPrompt();
      runCommand("education");
      expect(screen.getByText(/Bachelor of Engineering/)).toBeInTheDocument();
      expect(screen.getByText(/Khon Kaen University/)).toBeInTheDocument();
    });

    it("email opens the mail client", () => {
      const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
      renderPrompt();
      runCommand("email");
      expect(openSpy).toHaveBeenCalledWith("mailto:thanapong.angkha@gmail.com");
      expect(screen.getByText("opening mail client...")).toBeInTheDocument();
    });

    it("help lists every registered command", () => {
      renderPrompt();
      runCommand("help");
      Object.entries(COMMANDS).forEach(([cmd, { description }]) => {
        expect(document.body.textContent).toContain(cmd);
        expect(document.body.textContent).toContain(description);
      });
    });

    it("socials lists every social link", () => {
      renderPrompt();
      runCommand("socials");
      Object.values(SOCIALS).forEach(({ link }) => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it("clear removes all history lines", () => {
      renderPrompt();
      runCommand("whoami");
      // "whoami" only lives in history; after clear it should be gone
      runCommand("clear");
      expect(screen.queryByText("whoami")).not.toBeInTheDocument();
    });

    it("reboot calls the onReboot callback", () => {
      const onReboot = vi.fn();
      renderPrompt(onReboot);
      runCommand("reboot");
      expect(onReboot).toHaveBeenCalledOnce();
    });

    it("shows an error for an unrecognised command", () => {
      renderPrompt();
      runCommand("xyzzy");
      expect(screen.getByText("command not found: xyzzy")).toBeInTheDocument();
    });

    it("is case-insensitive", () => {
      renderPrompt();
      runCommand("WHOAMI");
      expect(screen.getAllByText("hellofriend").length).toBeGreaterThanOrEqual(
        3,
      );
    });
  });

  // ─── PromptInput – Ctrl+C ─────────────────────────────────────────────────

  describe("Ctrl+C", () => {
    it("echoes the current value to history and clears the input", () => {
      renderPrompt();
      typeCommand("partial-cmd");
      pressKey("c", { ctrlKey: true });

      expect(screen.getByText("partial-cmd")).toBeInTheDocument();
      expect(getInput()).toHaveValue("");
    });
  });

  // ─── PromptInput – command history navigation ──────────────────────────────

  describe("ArrowUp / ArrowDown", () => {
    it("ArrowUp does nothing when command history is empty", () => {
      renderPrompt();
      typeCommand("hello");
      pressKey("ArrowUp");
      expect(getInput()).toHaveValue("hello");
    });

    it("ArrowUp fills the input with the last executed command", () => {
      renderPrompt();
      runCommand("whoami");
      pressKey("ArrowUp");
      expect(getInput()).toHaveValue("whoami");
    });

    it("ArrowUp cycles backwards through multiple commands", () => {
      renderPrompt();
      runCommand("whoami");
      runCommand("about");
      pressKey("ArrowUp"); // → about
      pressKey("ArrowUp"); // → whoami
      expect(getInput()).toHaveValue("whoami");
    });

    it("ArrowDown restores the draft after navigating up", () => {
      renderPrompt();
      runCommand("whoami");
      typeCommand("draft-text");
      pressKey("ArrowUp"); // → whoami
      pressKey("ArrowDown"); // → draft-text
      expect(getInput()).toHaveValue("draft-text");
    });

    it("ArrowDown does nothing when not navigating", () => {
      renderPrompt();
      typeCommand("typing");
      pressKey("ArrowDown");
      expect(getInput()).toHaveValue("typing");
    });
  });

  // ─── PromptInput – Tab autocomplete ───────────────────────────────────────

  describe("Tab autocomplete", () => {
    it("does nothing on Tab with empty input", () => {
      renderPrompt();
      pressKey("Tab");
      expect(getInput()).toHaveValue("");
    });

    it("autocompletes silently when there is exactly one match", () => {
      renderPrompt();
      typeCommand("wh"); // only 'whoami' starts with 'wh'
      pressKey("Tab");
      expect(getInput()).toHaveValue("whoami");
    });

    it("shows all matching suggestions when there are multiple matches", () => {
      renderPrompt();
      typeCommand("e"); // matches: education, email
      pressKey("Tab");
      expect(screen.getByText("education")).toBeInTheDocument();
      expect(screen.getByText("email")).toBeInTheDocument();
    });

    it("fills the input with the first suggestion on the second Tab", () => {
      renderPrompt();
      typeCommand("e");
      pressKey("Tab"); // show suggestions
      pressKey("Tab"); // cycle to first: education (first key in COMMANDS starting with 'e')
      const firstMatch = Object.keys(COMMANDS).filter((c) =>
        c.startsWith("e"),
      )[0];
      expect(getInput()).toHaveValue(firstMatch);
    });

    it("cycles to the next suggestion on each subsequent Tab", () => {
      renderPrompt();
      typeCommand("e");
      const matches = Object.keys(COMMANDS).filter((c) => c.startsWith("e"));
      pressKey("Tab"); // show
      pressKey("Tab"); // index 0
      pressKey("Tab"); // index 1
      expect(getInput()).toHaveValue(matches[1]);
    });

    it("clears suggestions when the user types a character", () => {
      renderPrompt();
      typeCommand("e");
      pressKey("Tab"); // show suggestions
      typeCommand("ed"); // type more → onChange fires → suggestions cleared
      expect(screen.queryByText("email")).not.toBeInTheDocument();
    });

    it("clears suggestions after Enter", () => {
      renderPrompt();
      typeCommand("e");
      pressKey("Tab"); // show suggestions
      pressKey("Enter"); // submit empty-ish → clears
      expect(screen.queryByText("email")).not.toBeInTheDocument();
    });
  });
});
