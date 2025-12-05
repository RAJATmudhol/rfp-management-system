declare module "imap-simple" {
  import { EventEmitter } from "events";

  interface Config {
    imap: {
      user: string;
      password: string;
      host: string;
      port: number;
      tls?: boolean;
      authTimeout?: number;
      [key: string]: any;
    };
    onmail?: (numNewMail: number) => void;
    [key: string]: any;
  }

  interface ImapSimple extends EventEmitter {
    connect(config: Config): Promise<ImapSimple>;
    search(criteria: any[], fetchOptions: any): Promise<any[]>;
    openBox(name: string, readOnly?: boolean): Promise<void>;
    addFlags(seq: any, flags: string | string[]): Promise<void>;
    end(): void;
  }

  const imaps: {
    connect: (config: Config) => Promise<ImapSimple>;
  };

  export = imaps;
}
