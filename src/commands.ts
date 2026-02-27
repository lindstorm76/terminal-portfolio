export interface CommandDef {
  description: string;
}

export const COMMANDS: Record<string, CommandDef> = {
  about:     { description: "learn more about me" },
  clear:     { description: "clear the terminal" },
  education: { description: "my educational background" },
  email:     { description: "send me an email" },
  help:      { description: "list available commands" },
  history:   { description: "show command history" },
  reboot:    { description: "restart the terminal" },
  socials:   { description: "find me online" },
  whoami:    { description: "display current user" },
};
