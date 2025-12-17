// Minimal type declarations for modules without @types packages
// Add more precise types later if needed

declare module 'csv-parser' {
  import { Transform } from 'stream';

  type CsvOptions = {
    separator?: string;
    headers?: boolean | string[];
    mapHeaders?: (args: { header: string; index: number }) => string | null;
    mapValues?: (args: { header: string; index: number; value: string }) => any;
    skipLines?: number;
    strict?: boolean;
    skipComments?: string | RegExp;
    quote?: string;
    escape?: string;
  };

  function csv(options?: CsvOptions): Transform;

  namespace csv {}

  export = csv;
}

declare module 'csv-parse' {
  import { Transform } from 'stream';
  function parse(options?: any): Transform;
  export = parse;
}

// Generic fallback for any other untyped modules
declare module '*-parser';
