module.exports = {
  info: (...args) => console.log('⏳', ...args),
  success: (...args) => console.log('✅', ...args),
  error: (err) => console.error('❌', err.message || err)
};
