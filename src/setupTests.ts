// src/setupTests.ts
import '@testing-library/jest-dom';

// Use dynamic import to work with verbatimModuleSyntax
const util = require('util');

global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;