// Port configuration for Super Eliza AI Guard
const PORT_CONFIG = {
  development: 7899,
  production: 7899,
  staging: 7898
}

const getCurrentPort = () => {
  const env = process.env.NODE_ENV || 'development'
  return PORT_CONFIG[env] || 7899
}

module.exports = {
  PORT_CONFIG,
  getCurrentPort
} 