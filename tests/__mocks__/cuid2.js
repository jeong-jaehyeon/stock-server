// Mock for @paralleldrive/cuid2 to avoid ESM issues in Jest
let counter = 0

module.exports = {
  createId: () => `test-id-${++counter}`,
  init: () => ({ createId: () => `test-id-${++counter}` }),
  getConstants: () => ({}),
  isCuid: (id) => typeof id === 'string' && id.startsWith('test-id'),
}
