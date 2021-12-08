import { MonacoAwareCustomLanguageInfo } from "./custom-language-info";

/**
 * Language provider for the .mpm.z80 extension
 */
export const mpmZ80LanguageProvider: MonacoAwareCustomLanguageInfo = {
  id: "mpm-z80",
  extensions: [".mpm.asm"],
  allowBuildRoot: false,
  supportsKlive: false,
  options: {
    comments: {
      lineComment: ";",
    },
  },
  supportsBreakpoints: false,
  languageDef: {
    keywords: [
      "mpm", // Please remove this
      "nop",
      "NOP",
      "rlca",
      "RLCA",
      "rrca",
      "RRCA",
      "rla",
      "RLA",
      "rra",
      "RRA",
      "daa",
      "DAA",
      "cpl",
      "CPL",
      "scf",
      "SCF",
      "ccf",
      "CCF",
      "halt",
      "HALT",
      "exx",
      "EXX",
      "di",
      "DI",
      "ei",
      "EI",
      "neg",
      "NEG",
      "retn",
      "RETN",
      "reti",
      "RETI",
      "rld",
      "RLD",
      "rrd",
      "RRD",
      "ldi",
      "LDI",
      "cpi",
      "CPI",
      "ini",
      "INI",
      "outi",
      "OUTI",
      "ldd",
      "LDD",
      "cpd",
      "CPD",
      "ind",
      "IND",
      "outd",
      "OUTD",
      "ldir",
      "LDIR",
      "cpir",
      "CPIR",
      "inir",
      "INIR",
      "otir",
      "OTIR",
      "lddr",
      "LDDR",
      "cpdr",
      "CPDR",
      "indr",
      "INDR",
      "otdr",
      "OTDR",
      "ld",
      "LD",
      "inc",
      "INC",
      "dec",
      "DEC",
      "ex",
      "EX",
      "add",
      "ADD",
      "adc",
      "ADC",
      "sub",
      "SUB",
      "sbc",
      "SBC",
      "and",
      "AND",
      "xor",
      "XOR",
      "or",
      "OR",
      "cp",
      "CP",
      "djnz",
      "DJNZ",
      "jr",
      "JR",
      "jp",
      "JP",
      "call",
      "CALL",
      "ret",
      "RET",
      "rst",
      "RST",
      "push",
      "PUSH",
      "pop",
      "POP",
      "in",
      "IN",
      "out",
      "OUT",
      "im",
      "IM",
      "rlc",
      "RLC",
      "rrc",
      "RRC",
      "rl",
      "RL",
      "rr",
      "RR",
      "sla",
      "SLA",
      "sra",
      "SRA",
      "sll",
      "SLL",
      "srl",
      "SRL",
      "bit",
      "BIT",
      "res",
      "RES",
      "set",
      "SET",
      "ldix",
      "LDIX",
      "ldws",
      "LDWS",
      "ldirx",
      "LDIRX",
      "lddx",
      "LDDX",
      "lddrx",
      "LDDRX",
      "ldpirx",
      "LDPIRX",
      "outinb",
      "OUTINB",
      "mul",
      "MUL",
      "swapnib",
      "SWAPNIB",
      "mirror",
      "MIRROR",
      "nextreg",
      "NEXTREG",
      "pixeldn",
      "PIXELDN",
      "pixelad",
      "PIXELAD",
      "setae",
      "SETAE",
      "test",
      "TEST",
      "bsla",
      "BSLA",
      "bsra",
      "BSRA",
      "bsrl",
      "BSRL",
      "bsrf",
      "BSRF",
      "brlc",
      "BRLC",
    ],

    registers: [
      "af",
      "af'",
      "a",
      "f",
      "bc",
      "b",
      "c",
      "de",
      "d",
      "e",
      "hl",
      "h",
      "l",
      "i",
      "r",
      "sp",
      "xh",
      "ixh",
      "xl",
      "ixl",
      "ix",
      "yh",
      "yl",
      "iyh",
      "iyl",
      "iy",
      "AF",
      "AF'",
      "A",
      "F",
      "BC",
      "B",
      "C",
      "DE",
      "D",
      "E",
      "HL",
      "H",
      "L",
      "I",
      "R",
      "SP",
      "XH",
      "IXH",
      "IXh",
      "XL",
      "IXL",
      "IXl",
      "IX",
      "YH",
      "YL",
      "IYH",
      "IYh",
      "IYL",
      "IYl",
      "IY",
    ],

    directives: [
      "#ifdef",
      "#ifndef",
      "#define",
      "#undef",
      "#ifmod",
      "#ifnmod",
      "#endif",
      "#else",
      "#if",
      "#include",
      "#line",
    ],

    pragmas: [
      ".org",
      ".ORG",
      "org",
      "ORG",
      ".bank",
      ".BANK",
      "bank",
      "BANK",
      ".xorg",
      ".XORG",
      "xorg",
      "XORG",
      ".ent",
      ".ENT",
      "ent",
      "ENT",
      ".xent",
      ".XENT",
      "xent",
      "XENT",
      ".equ",
      ".EQU",
      "equ",
      "EQU",
      ".var",
      ".VAR",
      "var",
      "VAR",
      ".disp",
      ".DISP",
      "disp",
      "DISP",
      ".defb",
      ".DEFB",
      "defb",
      "DEFB",
      ".db",
      ".DB",
      "db",
      "DB",
      ".defw",
      ".DEFW",
      "defw",
      "DEFW",
      ".dw",
      ".DW",
      "dw",
      "DW",
      ".defm",
      ".DEFM",
      "defm",
      "DEFM",
      ".dm",
      ".DM",
      "dm",
      "DM",
      ".defn",
      ".DEFN",
      "defn",
      "DEFN",
      ".dn",
      ".DN",
      "dn",
      "DN",
      ".defh",
      ".DEFH",
      "defh",
      "DEFH",
      ".dh",
      ".DH",
      "dh",
      "DH",
      ".defs",
      ".DEFS",
      "defs",
      "DEFS",
      ".ds",
      ".DS",
      "ds",
      "DS",
      ".defc",
      ".DEFC",
      "defc",
      "DEFC",
      ".dc",
      ".DC",
      "dc",
      "DC",
      ".defg",
      ".DEFG",
      "defg",
      "DEFG",
      ".dg",
      ".DG",
      "dg",
      "DG",
      ".defgx",
      ".DEFGX",
      "defgx",
      "DEFGX",
      ".dgx",
      ".DGX",
      "dgx",
      "DGX",
      ".skip",
      ".SKIP",
      "skip",
      "SKIP",
      ".extern",
      ".EXTERN",
      "extern",
      "EXTERN",
      ".fillb",
      ".FILLB",
      "fillb",
      "FILLB",
      "\\.fillw",
      ".FILLW",
      "fillw",
      "FILLW",
      ".model",
      ".MODEL",
      "model",
      "MODEL",
      ".injectopt",
      ".INJECTOPT",
      "injectopt",
      "INJECTOPT",
      ".align",
      ".ALIGN",
      "align",
      "ALIGN",
      ".trace",
      ".TRACE",
      "trace",
      "TRACE",
      ".tracehex",
      ".TRACEHEX",
      "tracehex",
      "TRACEHEX",
      ".rndseed",
      ".RNDSEED",
      "rndseed",
      "RNDSEED",
      ".error",
      ".ERROR",
      "error",
      "ERROR",
      ".includebin",
      ".INCLUDEBIN",
      "includebin",
      "INCLUDEBIN",
      ".include_bin",
      ".INCLUDE_BIN",
      "include_bin",
      "INCLUDE_BIN",
      ".incbin",
      ".INCBIN",
      "incbin",
      "INCBIN",
      ".comparebin",
      ".COMPAREBIN",
      "comparebin",
      "COMPAREBIN",
      ".zxbasic",
      ".ZXBASIC",
      "zxbasic",
      "ZXBASIC",
    ],

    boolLiterals: [
      "true",
      "TRUE",
      "false",
      "FALSE",
      ".false",
      ".FALSE",
      ".true",
      ".TRUE",
    ],

    operators: [
      ":",
      "::",
      ":=",
      "=",
      "==",
      "===",
      "?",
      "+",
      "-",
      "*",
      "/",
      "|",
      "^",
      "!",
      "!=",
      "!==",
      ">",
      "<",
      "<=",
      ">=",
      "~",
      "%",
      "&",
      "<<",
      "<?",
      ">>",
      ">?",
    ],

    statements: [
      ".macro",
      ".MACRO",
      "macro",
      "MACRO",
      ".mend",
      ".MEND",
      "mend",
      "MEND",
      ".proc",
      ".PROC",
      "proc",
      "PROC",
      ".endp",
      ".ENDP",
      "endp",
      "ENDP",
      ".pend",
      ".PEND",
      "pend",
      "PEND",
      ".loop",
      ".LOOP",
      "loop",
      "LOOP",
      ".endl",
      ".ENDL",
      "endl",
      "ENDL",
      ".lend",
      ".LEND",
      "lend",
      "LEND",
      ".repeat",
      ".REPEAT",
      "repeat",
      "REPEAT",
      ".until",
      ".UNTIL",
      "until",
      "UNTIL",
      ".while",
      ".WHILE",
      "while",
      "WHILE",
      ".endw",
      ".ENDW",
      "endw",
      "ENDW",
      ".wend",
      ".WEND",
      "wend",
      "WEND",
      ".ifused",
      ".IFUSED",
      "ifused",
      "IFUSED",
      ".ifnused",
      ".IFNUSED",
      "ifnused",
      "IFNUSED",
      ".if",
      ".IF",
      "if",
      "IF",
      ".elif",
      ".ELIF",
      "elif",
      "ELIF",
      ".else",
      ".ELSE",
      "else",
      "ELSE",
      ".endif",
      ".ENDIF",
      "endif",
      "ENDIF",
      ".for",
      ".FOR",
      "for",
      "FOR",
      ".to",
      ".TO",
      "to",
      "TO",
      ".step",
      ".STEP",
      "step",
      "STEP",
      ".next",
      ".NEXT",
      "next",
      "NEXT",
      ".break",
      ".BREAK",
      "break",
      "BREAK",
      ".continue",
      ".CONTINUE",
      "continue",
      "CONTINUE",
      ".endmodule",
      ".ENDMODULE",
      "endmodule",
      "ENDMODULE",
      ".endscope",
      ".ENDSCOPE",
      "endscope",
      "ENDSCOPE",
      ".moduleend",
      ".MODULEEND",
      "moduleend",
      "MODULEEND",
      ".scopeend",
      ".SCOPEEND",
      "scopeend",
      "SCOPEEND",
      ".struct",
      ".STRUCT",
      "struct",
      "STRUCT",
      ".ends",
      ".END",
      "ends",
      "ENDS",
      ".local",
      ".LOCAL",
      "local",
      "LOCAL",
      "Local",
      ".endm",
      ".ENDM",
      "endm",
      "ENDM",
      ".module",
      ".MODULE",
      "module",
      "MODULE",
      ".scope",
      ".SCOPE",
      "scope",
      "SCOPE",
    ],

    functions: [
      "textof",
      "TEXTOF",
      "ltextof",
      "LTEXTOF",
      "hreg",
      "HREG",
      "lreg",
      "LREG",
      "def",
      "DEF",
      "isreg8",
      "ISREG8",
      "isreg8std",
      "ISREG8STD",
      "isreg8spec",
      "ISREG8SPEC",
      "isreg8idx",
      "ISREG8IDX",
      "isreg16",
      "ISREG16",
      "isreg16std",
      "ISREG16STD",
      "isreg16idx",
      "ISREG16IDX",
      "isregindirect",
      "ISREGINDIRECT",
      "iscport",
      "ISCPORT",
      "isindexedaddr",
      "ISINDEXEDADDR",
      "iscondition",
      "ISCONDITION",
      "isexpr",
      "ISEXPR",
      "isregaf",
      "ISREGAF",
      "isrega",
      "ISREGA",
      "isregbc",
      "ISREGBC",
      "isregb",
      "ISREGB",
      "isregc",
      "ISREGC",
      "isregde",
      "ISREGDE",
      "isregd",
      "ISREGD",
      "isrege",
      "ISREGE",
      "isreghl",
      "ISREGHL",
      "isregh",
      "ISREGH",
      "isregl",
      "ISREGL",
      "isregi",
      "ISREGI",
      "isregr",
      "ISREGR",
      "isregsp",
      "ISREGSP",
      "isregxh",
      "ISREGXH",
      "isregxl",
      "ISREGXL",
      "isregix",
      "ISREGIX",
      "isregyh",
      "ISREGYH",
      "isregyl",
      "ISREGYL",
      "isregiy",
      "ISREGIY",
      ".cnt",
      ".CNT",
    ],

    conditions: [
      "z",
      "Z",
      "nz",
      "NZ",
      "nc",
      "NC",
      "po",
      "PO",
      "pe",
      "PE",
      "p",
      "P",
      "m",
      "M",
    ],

    escapes: /\\(?:[ipfbIoatPC0\\"']|x[0-9A-Fa-f]{2})/,

    symbols: /[:,?+-\/*=><!~&|\/\^%]+/,

    tokenizer: {
      root: [
        // --- Character literal
        [/'.'/, "string"],

        // --- Special functions
        [/\$cnt|\$CNT/, "identifier"],

        // --- Special registers
        [/af'|AF'/, "register"],

        // --- Real literal
        [/[0-9]*(\.[0-9]+)([eE][+-]?[0-9]+)?/, "number"],

        // --- Hexadecimal literal
        [/((\$|#|0x)[0-9A-Fa-f]{1,4}|[0-9][0-9A-Fa-f]{1,4}(h|H))/, "number"],

        // --- Keyword-like tokens
        [
          /[\._@`a-zA-Z][_@!?\.0-9A-Za-z]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@pragmas": "pragma",
              "@registers": "register",
              "@boolLiterals": "number",
              "@statements": "statement",
              "@functions": "function",
              "@conditions": "condition",
              "@default": "identifier",
            },
          },
        ],

        // --- Whitespace
        { include: "@whitespace" },

        // --- Directives
        [
          /#[a-z_]+/,
          {
            cases: {
              "@directives": "keyword",
              "@default": "identifier",
            },
          },
        ],

        // --- Binary literal
        [/%[01_]+/, "number"],

        // --- Octal literal
        [/[0-7]{1,6}(o|O|q|Q)/, "number"],

        // --- Decimal literal
        [/[0-9]+/, "number"],

        // --- Delimiters
        [/[()\[\]]/, "@brackets"],

        // --- Various operators
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

        // --- Macro parameter
        [/{{/, { token: "macroparam", next: "@macroParam", log: "mp-beg" }],

        // strings
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-teminated string
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      ],

      comment: [
        [/\*\//, "comment", "@pop"],
        [/[^\/*]+$/, "comment", "@pop"],
        [/[^\/*]+/, "comment"],
        [/[\/*]$/, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],

      string: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],

      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
        [/;.*$/, "comment"],
      ],

      macroParam: [
        [/}}/, "macroparam", "@pop"],
        [/[\._@`a-zA-Z][_@!?\.0-9A-Za-z]*$/, "macroparam", "@pop"],
        [/[\._@`a-zA-Z][_@!?\.0-9A-Za-z]*/, "macroparam"],
        [/}[^}]/, "", "@pop"],
        [/}/, "macroparam"],
      ],

      specialReg: [[/af'|AF'/, "register"]],
    },
  },
  darkTheme: {
    rules: [
      {
        token: "comment",
        foreground: "6a9955",
      },
      {
        token: "keyword",
        foreground: "569cd6",
        fontStyle: "bold",
      },
      {
        token: "statement",
        foreground: "c586c0",
        fontStyle: "bold",
      },
      {
        token: "pragma",
        foreground: "c586c0",
      },
      {
        token: "identifier",
        foreground: "dcdcaa",
      },
      {
        token: "register",
        foreground: "9cdcfe",
      },
      {
        token: "condition",
        foreground: "9cdcfe",
      },
      {
        token: "function",
        foreground: "4fc1ff",
      },
      {
        token: "macroparam",
        foreground: "c586c0",
        fontStyle: "italic",
      },
      {
        token: "escape",
        foreground: "d7ba7d",
      },
    ],
    colors: {},
  },
};
