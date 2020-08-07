import {
  RendererMessage,
  MainMessage,
  GetMemoryContentsResponse,
  MessageBase,
  GetExecutionStateResponse,
} from "./message-types";

/**
 * This interface represents the operations we can access
 * from the VS Code API from a webview
 */
export interface IVsCodeApi {
  /**
   * Posts a message from the UI to the backend
   * @param message Message body
   */
  postMessage(message: any): void;
}

/**
 * Obtains the session-wide singleton object that provides
 * access to the VS Code API from a webview
 */
declare function acquireVsCodeApi(): IVsCodeApi;

/**
 * The vscode instance we use
 */
const vscode = acquireVsCodeApi();

/**
 * ID of the last message
 */
let messageSeqNo = 1;

/**
 * Message resolvers
 */
const messageResolvers = new Map<
  number,
  (msg?: any | PromiseLike<any>) => void
>();

/**
 * Process the results coming from the main process
 */
window.addEventListener("message", (ev) => {
  const response = ev.data as MainMessage;
  if (response.correlationId) {
    const resolver = messageResolvers.get(response.correlationId);

    // --- Resolve the message
    if (resolver) {
      resolver(response);
      messageResolvers.delete(response.correlationId);
    }
  }
});

/**
 * Sends an async message to the main process
 * @param message Message to send
 */
export async function sendMessageToMain<T extends MessageBase>(
  message: RendererMessage
): Promise<T> {
  message.correlationId = messageSeqNo++;
  const promise = new Promise<T>((resolve) => {
    if (message.correlationId) {
      messageResolvers.set(message.correlationId, resolve);
    }
  });
  vscode.postMessage(message);
  return promise;
}

/**
 * Gets the contents of the Z80 memory
 * @param from Start memory address
 * @param to End memory address
 */
export async function getMemoryContents(
  from: number,
  to: number
): Promise<GetMemoryContentsResponse> {
  return sendMessageToMain({
    type: "getMemoryContents",
    from,
    to,
  });
}

/**
 * Gets the contents of the Z80 memory
 * @param from Start memory address
 * @param to End memory address
 */
export async function getExecutionState(): Promise<GetExecutionStateResponse> {
  return sendMessageToMain({ type: "getExecutionState" });
}