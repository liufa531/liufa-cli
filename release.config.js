// release.config.js
module.exports = {
  branches: ['main', 'master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/git'
  ],
  // 禁用发布步骤
  publish: false
};
