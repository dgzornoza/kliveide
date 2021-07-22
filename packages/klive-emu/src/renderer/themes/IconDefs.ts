import { IconInfo } from "./IconInfo";

/**
 * Definition of stock icons
 */
export const IconDefs: IconInfo[] = [
  {
    name: "reverse-tape",
    path:
      "M13.5 2H12v12h1.5V2zm-3.5.18V14L1 8.062l9-5.881zM3.685 8.063L8.5 5v6.18L3.685 8.063z",
    width: 16,
    height: 16,
  },
  {
    name: "window",
    path:
      "M14.5 2h-13l-.5.5v11l.5.5h13l.5-.5v-11l-.5-.5zM14 13H2V6h12v7zm0-8H2V3h12v2z",
    width: 16,
    height: 16,
  },
  {
    name: "circle-outline",
    path:
      "M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm2.61-4a2.61 2.61 0 1 1-5.22 0 2.61 2.61 0 0 1 5.22 0zM8 5.246z",
    width: 16,
    height: 16,
  },
  {
    name: "circle-filled",
    path:
      "M8 4c.367 0 .721.048 1.063.145a3.943 3.943 0 0 1 1.762 1.031 3.944 3.944 0 0 1 1.03 1.762c.097.34.145.695.145 1.062 0 .367-.048.721-.145 1.063a3.94 3.94 0 0 1-1.03 1.765 4.017 4.017 0 0 1-1.762 1.031C8.72 11.953 8.367 12 8 12s-.721-.047-1.063-.14a4.056 4.056 0 0 1-1.765-1.032A4.055 4.055 0 0 1 4.14 9.062 3.992 3.992 0 0 1 4 8c0-.367.047-.721.14-1.063a4.02 4.02 0 0 1 .407-.953A4.089 4.089 0 0 1 5.98 4.546a3.94 3.94 0 0 1 .957-.401A3.89 3.89 0 0 1 8 4z",
    width: 16,
    height: 16,
  },
  {
    name: "vm-running",
    path:
      "M1.5 2h13l.5.5v5.503a5.006 5.006 0 0 0-1-.583V3H2v9h5a5 5 0 0 0 1 3H4v-1h3v-1H1.5l-.5-.5v-10l.5-.5z M12 8c.367 0 .721.047 1.063.14.34.094.658.23.953.407.294.177.563.385.808.625.245.24.455.509.63.808a4.03 4.03 0 0 1 .405 3.082c-.093.342-.229.66-.406.954a4.382 4.382 0 0 1-.625.808c-.24.245-.509.455-.808.63a4.029 4.029 0 0 1-3.082.405 3.784 3.784 0 0 1-.954-.406 4.382 4.382 0 0 1-.808-.625 3.808 3.808 0 0 1-.63-.808 4.027 4.027 0 0 1-.405-3.082c.093-.342.229-.66.406-.954.177-.294.385-.563.625-.808.24-.245.509-.455.808-.63A4.028 4.028 0 0 1 12 8zm2 3.988L11 10v4l3-2.012z",
    width: 16,
    height: 16,
  },
  {
    name: "vm",
    path:
      "M14.5 2h-13l-.5.5v10l.5.5H7v1H4v1h8v-1H9v-1h5.5l.5-.5v-10l-.5-.5zM14 12H2V3h12v9z",
    width: 16,
    height: 16,
  },
  {
    name: "mute",
    path:
      "M1.5 5h2.79l3.86-3.83.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85 4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732-.707.707L12.5 9.207l-1.732 1.732-.707-.707L11.793 8.5 10.06 6.77l.707-.707 1.733 1.73 1.731-1.731z",
    width: 16,
    height: 16,
  },
  {
    name: "unmute",
    path:
      "M1.5 4.83h2.79L8.15 1l.85.35v13l-.85.33-3.86-3.85H1.5l-.5-.5v-5l.5-.5zM4.85 10L8 13.14V2.56L4.85 5.68l-.35.15H2v4h2.5l.35.17zM15 7.83a6.97 6.97 0 0 1-1.578 4.428l-.712-.71A5.975 5.975 0 0 0 14 7.83c0-1.4-.48-2.689-1.284-3.71l.712-.71A6.971 6.971 0 0 1 15 7.83zm-2 0a4.978 4.978 0 0 1-1.002 3.004l-.716-.716A3.982 3.982 0 0 0 12 7.83a3.98 3.98 0 0 0-.713-2.28l.716-.716c.626.835.997 1.872.997 2.996zm-2 0c0 .574-.16 1.11-.44 1.566l-.739-.738a1.993 1.993 0 0 0 .005-1.647l.739-.739c.276.454.435.988.435 1.558z",
    width: 16,
    height: 16,
  },
  {
    name: "rocket",
    path:
      "M14.491 1c-3.598.004-6.654 1.983-8.835 4H1.5l-.5.5v3l.147.354.991.991.001.009 4 4 .009.001.999.999L7.5 15h3l.5-.5v-4.154c2.019-2.178 3.996-5.233 3.992-8.846l-.501-.5zM2 6h2.643a23.828 23.828 0 0 0-2.225 2.71L2 8.294V6zm5.7 8l-.42-.423a23.59 23.59 0 0 0 2.715-2.216V14H7.7zm-1.143-1.144L3.136 9.437C4.128 8 8.379 2.355 13.978 2.016c-.326 5.612-5.987 9.853-7.421 10.84zM4 15v-1H2v-2H1v3h3zm6.748-7.667a1.5 1.5 0 1 0-2.496-1.666 1.5 1.5 0 0 0 2.495 1.666z",
    width: 16,
    height: 16,
  },
  {
    name: "play",
    path: "M4 2v11.82l9-5.94L4 2zm1.5 2.82l4.81 3.06L5.5 11V4.82z",
    width: 16,
    height: 16,
  },
  {
    name: "pause",
    path: "M4.5 3H6v10H4.5V3zm7 0v10H10V3h1.5z",
    width: 16,
    height: 16,
  },
  {
    name: "stop",
    path: "M2 2v12h12V2H2zm10.75 10.75h-9.5v-9.5h9.5v9.5z",
    width: 16,
    height: 16,
  },
  {
    name: "restart",
    path:
      "M12.75 8a4.5 4.5 0 0 1-8.61 1.834l-1.391.565A6.001 6.001 0 0 0 14.25 8 6 6 0 0 0 3.5 4.334V2.5H2v4l.75.75h3.5v-1.5H4.352A4.5 4.5 0 0 1 12.75 8z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "debug",
    path:
      "M10.94 13.5l-1.32 1.32a3.73 3.73 0 0 0-7.24 0L1.06 13.5 0 14.56l1.72 1.72-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94 1.06 24l1.65-1.65A4.308 4.308 0 0 0 6 24a4.31 4.31 0 0 0 3.29-1.65L10.94 24 12 22.94 10.09 21c.198-.464.336-.951.41-1.45v-.1H12V18h-1.5v-1.5l-.22-.22L12 14.56l-1.06-1.06zM6 13.5a2.25 2.25 0 0 1 2.25 2.25h-4.5A2.25 2.25 0 0 1 6 13.5zm3 6a3.33 3.33 0 0 1-3 3 3.33 3.33 0 0 1-3-3v-2.25h6v2.25zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v9.46a5.07 5.07 0 0 0-1.5-.72V.63L8.64 0l15.12 9.6z",
    width: 24,
    height: 24,
  },
  {
    name: "step-into",
    path:
      "M8 9.532h.542l3.905-3.905-1.061-1.06-2.637 2.61V1H7.251v6.177l-2.637-2.61-1.061 1.06 3.905 3.905H8zm1.956 3.481a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "step-over",
    path:
      "M14.25 5.75v-4h-1.5v2.542c-1.145-1.359-2.911-2.209-4.84-2.209-3.177 0-5.92 2.307-6.16 5.398l-.02.269h1.501l.022-.226c.212-2.195 2.202-3.94 4.656-3.94 1.736 0 3.244.875 4.05 2.166h-2.83v1.5h4.163l.962-.975V5.75h-.004zM8 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "step-out",
    path:
      "M8 1h-.542L3.553 4.905l1.061 1.06 2.637-2.61v6.177h1.498V3.355l2.637 2.61 1.061-1.06L8.542 1H8zm1.956 12.013a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "keyboard",
    path:
      "M14 3H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm0 8H3V4h11v7zm-3-6h-1v1h1V5zm-1 2H9v1h1V7zm2-2h1v1h-1V5zm1 4h-1v1h1V9zM6 9h5v1H6V9zm7-2h-2v1h2V7zM8 5h1v1H8V5zm0 2H7v1h1V7zM4 9h1v1H4V9zm0-4h1v1H4V5zm3 0H6v1h1V5zM4 7h2v1H4V7z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "shadow-screen",
    path:
      "M14.5 2h-13l-.5.5v10l.5.5H7v1H4v1h8v-1H9v-1h5.5l.5-.5v-10l-.5-.5zM14 12H2V3h12v9z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "beam-position",
    path:
      "M8 1H7v2H1.5l-.5.5v4l.5.5H7v7h1V8h4.49l.34-.13 2.18-2v-.74l-2.18-2L12.5 3H8V1zm4.29 6H2V4h10.29l1.63 1.5L12.29 7zM5 5h5v1H5V5z",
    width: 16,
    height: 16,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "files",
    path:
      "M17.5 0H8.5L7 1.5V6H2.5L1 7.5V22.5699L2.5 24H14.5699L16 22.5699V18H20.7L22 16.5699V4.5L17.5 0ZM17.5 2.12L19.88 4.5H17.5V2.12ZM14.5 22.5H2.5V7.5H7V16.5699L8.5 18H14.5V22.5ZM20.5 16.5H8.5V1.5H16V6H20.5V16.5Z",
    width: 24,
    height: 24,
  },
  {
    name: "debug-alt",
    path:
      "M10.94 13.5l-1.32 1.32a3.73 3.73 0 0 0-7.24 0L1.06 13.5 0 14.56l1.72 1.72-.22.22V18H0v1.5h1.5v.08c.077.489.214.966.41 1.42L0 22.94 1.06 24l1.65-1.65A4.308 4.308 0 0 0 6 24a4.31 4.31 0 0 0 3.29-1.65L10.94 24 12 22.94 10.09 21c.198-.464.336-.951.41-1.45v-.1H12V18h-1.5v-1.5l-.22-.22L12 14.56l-1.06-1.06zM6 13.5a2.25 2.25 0 0 1 2.25 2.25h-4.5A2.25 2.25 0 0 1 6 13.5zm3 6a3.33 3.33 0 0 1-3 3 3.33 3.33 0 0 1-3-3v-2.25h6v2.25zm14.76-9.9v1.26L13.5 17.37V15.6l8.5-5.37L9 2v9.46a5.07 5.07 0 0 0-1.5-.72V.63L8.64 0l15.12 9.6z",
    width: 24,
    height: 24,
  },
  {
    name: "beaker",
    path:
      "M13.8929 13.558L9.99994 6.006V2.006H10.9999V1.006H9.99394V1L9.53794 1.005H4.99994V2H5.99994V5.952L2.10594 13.561C2.03023 13.7133 1.99465 13.8825 2.00254 14.0524C2.01044 14.2224 2.06156 14.3875 2.15106 14.5321C2.24057 14.6768 2.3655 14.7962 2.51404 14.8792C2.66258 14.9621 2.82982 15.0057 2.99994 15.006H12.9999C13.1704 15.0058 13.3379 14.9621 13.4867 14.8789C13.6355 14.7958 13.7606 14.676 13.8501 14.5309C13.9395 14.3858 13.9904 14.2203 13.9979 14.05C14.0054 13.8798 13.9693 13.7104 13.8929 13.558ZM6.89294 6.408L6.99994 6.193V2.036L8.99994 2.012V6.007V6.249L9.11094 6.464L10.9369 10.006H5.04894L6.89294 6.408ZM2.99994 14.017L4.54094 11.006H11.4559L13.0029 14.006L2.99994 14.017Z",
    width: 16,
    height: 16,
  },
  {
    name: "settings-gear",
    path:
      "M19.85 8.75L24 9.57996V14.42L19.85 15.25L22.2 18.77L18.77 22.2L15.25 19.85L14.42 24H9.57996L8.75 19.85L5.22998 22.2L1.80005 18.77L4.15002 15.25L0 14.42V9.57996L4.15002 8.75L1.80005 5.22998L5.22998 1.80005L8.75 4.15002L9.57996 0H14.42L15.25 4.15002L18.77 1.80005L22.2 5.22998L19.85 8.75ZM18.28 13.8199L22.28 13.01V11.01L18.28 10.2L17.74 8.90002L20.03 5.46997L18.6 4.04004L15.17 6.32996L13.87 5.79004L13.0601 1.79004H11.0601L10.25 5.79004L8.94995 6.32996L5.52002 4.04004L4.08997 5.46997L6.38 8.90002L5.83997 10.2L1.83997 11.01V13.01L5.83997 13.8199L6.38 15.12L4.08997 18.55L5.52002 19.98L8.94995 17.6899L10.25 18.23L11.0601 22.23H13.0601L13.87 18.23L15.17 17.6899L18.6 19.98L20.03 18.55L17.74 15.12L18.28 13.8199ZM10.0943 9.14807C10.6584 8.77118 11.3216 8.56995 12 8.56995C12.9089 8.57258 13.7798 8.93484 14.4225 9.57751C15.0652 10.2202 15.4274 11.0911 15.43 12C15.43 12.6784 15.2288 13.3416 14.8519 13.9056C14.475 14.4697 13.9394 14.9093 13.3126 15.1689C12.6859 15.4286 11.9962 15.4965 11.3308 15.3641C10.6654 15.2318 10.0543 14.9051 9.57457 14.4254C9.09488 13.9457 8.7682 13.3345 8.63585 12.6692C8.50351 12.0038 8.57143 11.3141 8.83104 10.6874C9.09065 10.0606 9.53029 9.52496 10.0943 9.14807ZM11.0499 13.4218C11.3311 13.6097 11.6618 13.71 12 13.71C12.2249 13.7113 12.4479 13.668 12.656 13.5825C12.8641 13.4971 13.0531 13.3712 13.2121 13.2122C13.3712 13.0531 13.497 12.8641 13.5825 12.656C13.668 12.4479 13.7113 12.2249 13.7099 12C13.7099 11.6618 13.6096 11.3311 13.4217 11.0499C13.2338 10.7687 12.9669 10.5496 12.6544 10.4202C12.3419 10.2907 11.9981 10.2569 11.6664 10.3229C11.3347 10.3889 11.03 10.5517 10.7909 10.7909C10.5517 11.03 10.3888 11.3347 10.3229 11.6664C10.2569 11.9981 10.2907 12.342 10.4202 12.6544C10.5496 12.9669 10.7687 13.2339 11.0499 13.4218Z",
    width: 24,
    height: 24,
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
  },
  {
    name: "chevron-left",
    path:
      "M5.928 7.976l4.357 4.357-.618.62L5 8.284v-.618L9.667 3l.618.619-4.357 4.357z",
    width: 16,
    height: 16,
  },
  {
    name: "chevron-right",
    path:
      "M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z",
    width: 16,
    height: 16,
  },
  {
    name: "chevron-up",
    path:
      "M8.024 5.928l-4.357 4.357-.62-.618L7.716 5h.618L13 9.667l-.619.618-4.357-4.357z",
    width: 16,
    height: 16,
  },
  {
    name: "chevron-down",
    path:
      "M7.976 10.072l4.357-4.357.62.618L8.284 11h-.618L3 6.333l.619-.618 4.357 4.357z",
    width: 16,
    height: 16,
  },
  {
    name: "close",
    path:
      "M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z",
    width: 16,
    height: 16,
  },
  {
    name: "file-code",
    path:
      "M10.57 1.14l3.28 3.3.15.36v9.7l-.5.5h-11l-.5-.5v-13l.5-.5h7.72l.35.14zM10 5h3l-3-3v3zM3 2v12h10V6H9.5L9 5.5V2H3zm2.062 7.533l1.817-1.828L6.17 7 4 9.179v.707l2.171 2.174.707-.707-1.816-1.82zM8.8 7.714l.7-.709 2.189 2.175v.709L9.5 12.062l-.705-.709 1.831-1.82L8.8 7.714z",
    width: 16,
    height: 16,
  },
  {
    name: "output",
    path:
      "M19.5 0v1.5L21 3v19.5L19.5 24h-15L3 22.5V3l1.5-1.5V0H6v1.5h3V0h1.5v1.5h3V0H15v1.5h3V0h1.5zm-15 22.5h15V3h-15v19.5zM7.5 6h9v1.5h-9V6zm9 6h-9v1.5h9V12zm-9 6h9v1.5h-9V18z",
    width: 24,
    height: 24,
  },
  {
    name: "ellipsis",
    path:
      "M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z",
    width: 16,
    height: 16,
  },
  {
    name: "question",
    path:
      "M7.5 1a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 12a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm1.55-8.42a1.84 1.84 0 0 0-.61-.42A2.25 2.25 0 0 0 7.53 4a2.16 2.16 0 0 0-.88.17c-.239.1-.45.254-.62.45a1.89 1.89 0 0 0-.38.62 3 3 0 0 0-.15.72h1.23a.84.84 0 0 1 .506-.741.72.72 0 0 1 .304-.049.86.86 0 0 1 .27 0 .64.64 0 0 1 .22.14.6.6 0 0 1 .16.22.73.73 0 0 1 .06.3c0 .173-.037.343-.11.5a2.4 2.4 0 0 1-.27.46l-.35.42c-.12.13-.24.27-.35.41a2.33 2.33 0 0 0-.27.45 1.18 1.18 0 0 0-.1.5v.66H8v-.49a.94.94 0 0 1 .11-.42 3.09 3.09 0 0 1 .28-.41l.36-.44a4.29 4.29 0 0 0 .36-.48 2.59 2.59 0 0 0 .28-.55 1.91 1.91 0 0 0 .11-.64 2.18 2.18 0 0 0-.1-.67 1.52 1.52 0 0 0-.35-.55zM6.8 9.83h1.17V11H6.8V9.83z",
    width: 16,
    height: 16,
  },
  {
    name: "repo-push",
    path:
      "M13.5 1H3.74A1.74 1.74 0 0 0 2 2.75v9.5A1.74 1.74 0 0 0 3.74 14H7v-1H3.74a.74.74 0 0 1-.74-.75v-.5a.74.74 0 0 1 .74-.75H7v-1H4V2h9v8h-3v1h3v2h-3v1h3.5l.5-.5v-12l-.5-.5zM3 2.73a.75.75 0 0 0 0 .02v7.42-7.44zM6 3H5v1h1V3zm-.62 5.65l.71.7 1.92-1.92V15h1V7.328l2.03 2.022.7-.7-2.82-2.83h-.71L5.38 8.65zM5 5h1v1H5V5z",
    width: 16,
    height: 16,
  },
  {
    name: "circle-large-filled",
    path:
      "M8 1a6.8 6.8 0 0 1 1.86.253 6.899 6.899 0 0 1 3.083 1.805 6.903 6.903 0 0 1 1.804 3.083C14.916 6.738 15 7.357 15 8s-.084 1.262-.253 1.86a6.9 6.9 0 0 1-.704 1.674 7.157 7.157 0 0 1-2.516 2.509 6.966 6.966 0 0 1-1.668.71A6.984 6.984 0 0 1 8 15a6.984 6.984 0 0 1-1.86-.246 7.098 7.098 0 0 1-1.674-.711 7.3 7.3 0 0 1-1.415-1.094 7.295 7.295 0 0 1-1.094-1.415 7.098 7.098 0 0 1-.71-1.675A6.985 6.985 0 0 1 1 8c0-.643.082-1.262.246-1.86a6.968 6.968 0 0 1 .711-1.667 7.156 7.156 0 0 1 2.509-2.516 6.895 6.895 0 0 1 1.675-.704A6.808 6.808 0 0 1 8 1z",
    width: 16,
    height: 16,
  },
  {
    name: "circle-large-outline",
    path:
      "M9.588 2.215A5.808 5.808 0 0 0 8 2c-.554 0-1.082.073-1.588.215l-.006.002c-.514.141-.99.342-1.432.601A6.156 6.156 0 0 0 2.82 4.98l-.002.004A5.967 5.967 0 0 0 2.21 6.41 5.986 5.986 0 0 0 2 8c0 .555.07 1.085.21 1.591a6.05 6.05 0 0 0 1.548 2.651c.37.365.774.677 1.216.94a6.1 6.1 0 0 0 1.435.609A6.02 6.02 0 0 0 8 14c.555 0 1.085-.07 1.591-.21.515-.145.99-.348 1.426-.607l.004-.002a6.16 6.16 0 0 0 2.161-2.155 5.85 5.85 0 0 0 .6-1.432l.003-.006A5.807 5.807 0 0 0 14 8c0-.554-.072-1.082-.215-1.588l-.002-.006a5.772 5.772 0 0 0-.6-1.423l-.002-.004a5.9 5.9 0 0 0-.942-1.21l-.008-.008a5.902 5.902 0 0 0-1.21-.942l-.004-.002a5.772 5.772 0 0 0-1.423-.6l-.006-.002zm4.455 9.32a7.157 7.157 0 0 1-2.516 2.508 6.966 6.966 0 0 1-1.668.71A6.984 6.984 0 0 1 8 15a6.984 6.984 0 0 1-1.86-.246 7.098 7.098 0 0 1-1.674-.711 7.3 7.3 0 0 1-1.415-1.094 7.295 7.295 0 0 1-1.094-1.415 7.098 7.098 0 0 1-.71-1.675A6.985 6.985 0 0 1 1 8c0-.643.082-1.262.246-1.86a6.968 6.968 0 0 1 .711-1.667 7.156 7.156 0 0 1 2.509-2.516 6.895 6.895 0 0 1 1.675-.704A6.808 6.808 0 0 1 8 1a6.8 6.8 0 0 1 1.86.253 6.899 6.899 0 0 1 3.083 1.805 6.903 6.903 0 0 1 1.804 3.083C14.916 6.738 15 7.357 15 8s-.084 1.262-.253 1.86a6.9 6.9 0 0 1-.704 1.674z",
    width: 16,
    height: 16,
  },
  {
    name: "clear-all",
    path:
      "M10 12.6l.7.7 1.6-1.6 1.6 1.6.8-.7L13 11l1.7-1.6-.8-.8-1.6 1.7-1.6-1.7-.7.8 1.6 1.6-1.6 1.6zM1 4h14V3H1v1zm0 3h14V6H1v1zm8 2.5V9H1v1h8v-.5zM9 13v-1H1v1h8z",
    width: 16,
    height: 16,
  },
];
