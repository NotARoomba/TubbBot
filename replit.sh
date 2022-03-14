wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
unset PREFIX &&
export NVM_DIR="/config/nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  &&

nvm install 16.14.0 &&
nvm use 16.14.0 &&
npm update --force &&
npm install &&
node index.js
