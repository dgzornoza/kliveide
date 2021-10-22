// ----------------------------------------------------------------------------
// Messages for communication with the Z80 assembler worker

/**
 * Definition of base compiler messages including requests and responses
 */
export interface CompilerMessageBase {
  type: CompilerMessage["type"];
  correlationId?: number;
}

/**
 * Ask the compiler to compile a source file
 */
export interface CompileFileMessage extends CompilerMessageBase {
  type: "CompileFile";
  filename: string;
  options?: CompilerOptions;
}

/**
 * Ask the compiler to compile the specified source text
 */
export interface CompileSourceMessage extends CompilerMessageBase {
  type: "Compile";
  sourceText: string;
  options?: CompilerOptions;
}

/**
 * All compiler requests
 */
export type CompilerRequestMessage = CompileFileMessage | CompileSourceMessage;

/**
 * Result of the assembler call
 */
export interface AssemblerOutputResponse extends CompilerMessageBase {
  type: "CompileResult";
  result: CompilerOutput;
}

/**
 * All compiler responses
 */
export type CompilerResponseMessage = AssemblerOutputResponse;

/**
 * Defines the messages the compiler accepts
 */
export type CompilerMessage = CompilerRequestMessage | CompilerResponseMessage;

// ----------------------------------------------------------------------------
// The compiler service and related DTO types
/**
 * This interface defines the operations of the Z80 Compiler service
 */
export interface IZ80CompilerService {
  /**
   * Compiles the Z80 Assembly code in the specified file into Z80
   * binary code.
   * @param filename Z80 assembly source file (absolute path)
   * @param options Compiler options. If not defined, the compiler uses the default options.
   * @returns Output of the compilation
   */
  compileFile(
    filename: string,
    options?: CompilerOptions
  ): Promise<CompilerOutput>;

  /**
   * Compiles the passed Z80 Assembly code into Z80 binary code.
   * binary code.
   * @param sourceText Z80 assembly source code text
   * @param options Compiler options. If not defined, the compiler uses the default options.
   * @returns Output of the compilation
   */
  compile(
    sourceText: string,
    options?: CompilerOptions
  ): Promise<CompilerOutput>;
}

/**
 * The type of the Spectrum model
 */
export enum SpectrumModelType {
  Spectrum48,
  Spectrum128,
  SpectrumP3,
  Next,
}

/**
 * Represents the possible types of an expression value
 */
export enum ExpressionValueType {
  Error = 0,
  Bool,
  Integer,
  Real,
  String,
  NonEvaluated,
}

/**
 * Represents the value of an evaluated expression
 */
export type ExpressionValue = {
  /**
   * Gets the type of the expression
   */
  readonly type: ExpressionValueType;

  /**
   * Checks if the value of this expression is valid
   */
  readonly isValid: boolean;

  /**
   * Checks if the value of this expression is not evaluated
   */
  readonly isNonEvaluated: boolean;

  /**
   * Gets the value of this instance
   */
  readonly value: number;
};

/**
 * Represents the input options of the Klive Z80 Compiler
 */
export type CompilerOptions = {
  /**
   * Predefined compilation symbols
   */
  predefinedSymbols: Record<string, ExpressionValue>;

  /**
   * The default start address of the compilation
   */
  defaultStartAddress?: number;

  /**
   * The current ZX Spectrum model
   */
  currentModel: SpectrumModelType;

  /**
   * The maximum number of errors to report within a loop
   */
  maxLoopErrorsToReport: number;

  /**
   * Signs that PROC labels and symbols are not locals by default
   */
  procExplicitLocalsOnly: boolean;

  /**
   * Indicates that assembly symbols should be case sensitively.
   */
  useCaseSensitiveSymbols: boolean;

  /**
   * Allows flexible use of DEFx pragmas
   */
  flexibleDefPragmas: boolean;
};

/**
 * This enum defines the types of assembly symbols
 */
export enum SymbolType {
  None,
  Label,
  Var,
}

export type AssemblySymbolInfo = {
  /**
   * Symbol name
   */
  readonly name: string;

  /**
   * Symbol type
   */
  readonly type: SymbolType;

  /**
   * Symbol value
   */
  readonly value: ExpressionValue;

  /**
   * Tests if this symbol is a local symbol within a module.
   */
  readonly isModuleLocal: boolean;

  /**
   * Tests if this symbol is a short-term symbol.
   */
  readonly isShortTerm: boolean;

  /**
   * Signs if the object has been used
   */
  readonly isUsed: boolean;
};

/**
 * Defines a section of assembly lines
 */
export type DefinitionSection = {
  readonly firstLine: number;
  readonly lastLine: number;
};

/**
 * Defines a field of a structure
 */
export type FieldDefinition = {
  readonly offset: number;
  readonly isUsed: boolean;
};

/**
 * Represents a struct
 */
export type StructDefinition = {
  readonly structName: string;

  /**
   * Struct definition section
   */
  readonly section: DefinitionSection;

  /**
   * The fields of the structure
   */
  readonly fields: Record<string, FieldDefinition>;

  /**
   * The size of the structure
   */
  readonly size: number;
};

/**
 * Represents the definition of a macro
 */
export type MacroDefinition = {
  /**
   * Name of the macro
   */
  readonly macroName: string;

  /**
   * Macro identifier
   */
  readonly argNames: IdentifierNode[];

  /**
   * End label of the macro
   */
  readonly endLabel: string | null;

  /**
   * The section of the macro
   */
  readonly section: DefinitionSection;
};

export type IdentifierNode = {
  /**
   * Identifies the node type as an identifier
   */
  readonly type: "Identifier";

  /**
   * Identifier name
   */
  readonly name: string;

  /**
   * The expression source code (used for macro argument replacement)
   */
  readonly sourceText: string;

  /**
   * Start line number of the start token of the node
   */
  readonly line: number;

  /**
   * Start position (inclusive) of the node
   */
  readonly startPosition: number;

  /**
   * End position (exclusive)
   */
  readonly endPosition: number;

  /**
   * Start column number (inclusive) of the node
   */
  readonly startColumn: number;

  /**
   * End column number (exclusive) of the node
   */
  readonly endColumn: number;
};

export type SymbolScope = {
  /**
   * Owner of this scope
   */
  readonly ownerScope: SymbolScope | null;

  /**
   * Indicates that this scope is for a loop
   */
  readonly isLoopScope: boolean;

  /**
   * Indicates that this scope is for a proc
   */
  readonly isProcScope: boolean;

  /**
   * The current loop counter in the scope
   */
  readonly loopCounter: number;

  /**
   * Indicates if this is a temporary scope
   */
  readonly isTemporaryScope: boolean;

  /**
   * The symbol table with properly defined symbols
   */
  readonly symbols: Record<string, AssemblySymbolInfo>;

  /**
   * Local symbol bookings
   */
  readonly localSymbolBookings: Set<string>;

  /**
   * Indicates if a break statement has been reached in this scope
   */
  readonly breakReached: boolean;

  /**
   * Indicates if a continue statement has been reached in this scope
   */
  readonly continueReached: boolean;

  /**
   * Optional macro arguments
   */
  macroArguments: Record<string, ExpressionValue> | null;

  /**
   * Tests if this context is a macro context
   */
  readonly isMacroContext: boolean;
};

/**
 * Represents the output of a compiled module
 */
export interface CompiledModule {
  /**
   * Parent of this module
   */
  readonly parentModule: CompiledModule | null;

  /**
   * Case sensitive module?
   */
  readonly caseSensitive: boolean;

  /**
   * Points to the root module
   */
  readonly rootModule: CompiledModule;

  /**
   * Child modules
   */
  readonly nestedModules: Record<string, CompiledModule>;

  /**
   * The symbol table with properly defined symbols
   */
  readonly symbols: Record<string, AssemblySymbolInfo>;

  /**
   * The map of structures within the module
   */
  readonly structs: Record<string, StructDefinition>;

  /**
   * The map of macro definitions within the module
   */
  readonly macros: Record<string, MacroDefinition>;

  /**
   * Local symbol scopes
   */
  readonly localScopes: SymbolScope[];
}

/**
 * Describes a source file item
 */
export type SourceFileItem = {
  /**
   * The name of the source file
   */
  readonly filename: string;

  /**
   * Optional parent item
   */
  parent?: SourceFileItem;

  /**
   * Included files
   */
  readonly includes: SourceFileItem[];
};

/**
 * A single segment of the code compilation
 */
export type BinarySegment = {
  /**
   * The bank of the segment
   */
  readonly bank?: number;

  /**
   * Start offset used for banks
   */
  readonly bankOffset: number;

  /**
   * Maximum code length of this segment
   */
  readonly maxCodeLength: number;

  /**
   * Start address of the compiled block
   */
  readonly startAddress: number;

  /**
   * Optional displacement of this segment
   */
  readonly displacement?: number;

  /**
   * The current assembly address when the .disp pragma was used
   */
  readonly dispPragmaOffset?: number;

  /**
   * Intel hex start address of this segment
   */
  readonly xorgValue?: number;

  /**
   * Emitted Z80 binary code
   */
  readonly emittedCode: number[];

  /**
   * Signs if segment overflow has been detected
   */
  readonly overflowDetected: boolean;

  /**
   * Shows the offset of the instruction being compiled
   */
  readonly currentInstructionOffset?: number;

  /**
   * The current code generation offset
   */
  readonly currentOffset: number;
};

/**
 * Represents a compilation error
 */
export interface AssemblerErrorInfo {
  /**
   * Error code
   */
  readonly errorCode: string;
  /**
   * File in which the error is found
   */
  readonly fileName: string;

  /**
   * Error line number
   */
  readonly line: number;

  /**
   * Error start position
   */
  readonly startPosition: number;

  /**
   * Error end position
   */
  readonly endPosition: number | null;

  /**
   * Error start column
   */
   readonly startColumn: number;

   /**
    * Error end column
    */
   readonly endColumn: number | null;
 
   /**
   * Complete error message
   */
  readonly message: string;

  /**
   * Is it just warning?
   */
  readonly isWarning?: boolean;
}

/**
 * Represents a file line in the compiled assembler output
 */
export type FileLine = {
  fileIndex: number;
  line: number;
};

/**
 * Represents an item in the output list
 */
export type ListFileItem = {
  fileIndex: number;
  address: number;
  segmentIndex: number;
  codeStartIndex: number;
  codeLength: number;
  lineNumber: number;
  sourceText: string;
};

/**
 * Represents the entire compiler output
 */
export interface CompilerOutput extends CompiledModule {
  /**
   * Source file item of the compiled code
   */
  readonly sourceItem: SourceFileItem;

  /**
   * The segments of the compilation output
   */
  readonly segments: BinarySegment[];

  /**
   * The errors found during the compilation
   */
  readonly errors: AssemblerErrorInfo[];

  /**
   * Number of errors
   */
  readonly errorCount: number;

  /**
   * The type of Spectrum model to use
   */
  modelType?: SpectrumModelType;

  /**
   * Entry address of the code
   */
  entryAddress?: number;

  /**
   * Entry address of the code to use when exporting it
   */
  exportEntryAddress?: number;

  /**
   * Inject options
   */
  injectOptions: Record<string, boolean>;

  /**
   * The source files involved in this compilation, in
   * their file index order
   */
  readonly sourceFileList: SourceFileItem[];

  /**
   * Source map information that assigns source file info with
   * the address
   */
  readonly sourceMap: Record<number, FileLine>;

  /**
   * Source map information that assigns source file info with the address
   */
  readonly addressMap: Map<FileLine, number[]>;

  /**
   * Items of the list file
   */
  readonly listFileItems: ListFileItem[];

  /**
   * The type of the source that resulted in this compilation (for example, ZX BASIC)
   */
  sourceType?: string;

  /**
   * Trace outputs
   */
  readonly traceOutput: string[];
}
