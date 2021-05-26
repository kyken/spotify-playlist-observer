# spotify-playlist-observer
spotifyのプレイリストを監視して、差分を検知したらdiscordに発言するbot

## 使い方

### 事前準備

- node v1.4以上をインストール
- [spotify for developer](https://developer.spotify.com/dashboard/login)より、ClientIDならびにSecretを取得
- discordにてWebHookのURLを取得
- config.tsに↑を記載（pushしないようにご注意）
- `npm install`

### 動かす
- 初回は`npm run start:init`
- ２回目以降は`npm run start`