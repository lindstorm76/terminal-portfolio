export interface CommandType {
  description: string;
}

export const COMMANDS: Record<string, CommandType> = {
  about: { description: "learn more about me" },
  clear: { description: "clear the terminal" },
  education: { description: "my educational background" },
  email: { description: "send me an email" },
  help: { description: "list available commands" },
  history: { description: "show command history" },
  reboot: { description: "restart the terminal" },
  socials: { description: "find me online" },
  themes: { description: "list and change themes" },
  whoami: { description: "display current user" },
};
