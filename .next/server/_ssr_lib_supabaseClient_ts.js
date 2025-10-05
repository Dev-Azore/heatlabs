"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_ssr_lib_supabaseClient_ts";
exports.ids = ["_ssr_lib_supabaseClient_ts"];
exports.modules = {

/***/ "(ssr)/./lib/supabaseClient.ts":
/*!*******************************!*\
  !*** ./lib/supabaseClient.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(ssr)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/**\r\n* lib/supabaseClient.ts\r\n* ---------------------\r\n* Client-side Supabase instance using public ANON key.\r\n* Safe to include in browser bundles. Throws early if env vars missing\r\n* so we don't silently fail in production.\r\n*/ \nconst url = \"https://knjhqjygkplullnsqmdk.supabase.co\";\nconst anon = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtuamhxanlna3BsdWxsbnNxbWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NDA1NTgsImV4cCI6MjA3MDUxNjU1OH0.VI-XbbWnxW5GMqhsoaUTGidGJ2nR9xa-DkFujvmxNLE\";\n// Fail fast if env vars missing — helps catch deployment/misconfiguration early.\nif (!url || !anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');\n// Export named `supabase` for client-side usage in React components.\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(url, anon);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9saWIvc3VwYWJhc2VDbGllbnQudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7Ozs7O0FBTUEsR0FHcUQ7QUFHckQsTUFBTUMsTUFBTUMsMENBQW9DO0FBQ2hELE1BQU1HLE9BQU9ILGtOQUF5QztBQUd0RCxpRkFBaUY7QUFDakYsSUFBSSxDQUFDRCxPQUFPLENBQUNJLE1BQU0sTUFBTSxJQUFJRSxNQUFNO0FBR25DLHFFQUFxRTtBQUM5RCxNQUFNQyxXQUFXUixtRUFBWUEsQ0FBQ0MsS0FBS0ksTUFBTSIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxwY1xcRG93bmxvYWRzXFxoZWF0bGFic19cXGxpYlxcc3VwYWJhc2VDbGllbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiogbGliL3N1cGFiYXNlQ2xpZW50LnRzXHJcbiogLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiogQ2xpZW50LXNpZGUgU3VwYWJhc2UgaW5zdGFuY2UgdXNpbmcgcHVibGljIEFOT04ga2V5LlxyXG4qIFNhZmUgdG8gaW5jbHVkZSBpbiBicm93c2VyIGJ1bmRsZXMuIFRocm93cyBlYXJseSBpZiBlbnYgdmFycyBtaXNzaW5nXHJcbiogc28gd2UgZG9uJ3Qgc2lsZW50bHkgZmFpbCBpbiBwcm9kdWN0aW9uLlxyXG4qL1xyXG5cclxuXHJcbmltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XHJcblxyXG5cclxuY29uc3QgdXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMITtcclxuY29uc3QgYW5vbiA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZITtcclxuXHJcblxyXG4vLyBGYWlsIGZhc3QgaWYgZW52IHZhcnMgbWlzc2luZyDigJQgaGVscHMgY2F0Y2ggZGVwbG95bWVudC9taXNjb25maWd1cmF0aW9uIGVhcmx5LlxyXG5pZiAoIXVybCB8fCAhYW5vbikgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCBvciBORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWScpO1xyXG5cclxuXHJcbi8vIEV4cG9ydCBuYW1lZCBgc3VwYWJhc2VgIGZvciBjbGllbnQtc2lkZSB1c2FnZSBpbiBSZWFjdCBjb21wb25lbnRzLlxyXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSBjcmVhdGVDbGllbnQodXJsLCBhbm9uKTtcclxuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInVybCIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19TVVBBQkFTRV9VUkwiLCJhbm9uIiwiTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkiLCJFcnJvciIsInN1cGFiYXNlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./lib/supabaseClient.ts\n");

/***/ })

};
;