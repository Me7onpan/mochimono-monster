# もちものモンスター

Vue 3 + Vite で作った、子ども向けの持ち物準備 PWA です。

## MacBook のブラウザで見る

```bash
cd /Users/loafparty/Documents/K
pnpm install
pnpm dev:mac
```

ブラウザが自動で開きます。開かない場合は、ターミナルに表示される `http://localhost:5173` を Safari または Chrome で開いてください。

開発モードでは古い PWA キャッシュを自動解除するため、Chrome でも常に最新画面を確認できます。通常のマウスホイール・トラックパッドでページをスクロールできます。

終了するときはターミナルで `Control + C` を押します。

## 通常の起動

```bash
pnpm dev
```

## 本番用ビルド

```bash
pnpm build
```

生成物は `dist/` に出力されます。

## キャラクター画像について

授業モンスター10体・持ち物モンスター22体は、このアプリ専用に新規作成したオリジナル素材です。既存のアニメ・ゲーム・企業キャラクターの名称、ロゴ、画像は使用していません。

各キャラクターは `public/art/subjects/` と `public/art/items/` に個別画像として保存しています。元画像から再度切り出す場合は `zsh scripts/crop-character-assets.sh` を実行します。

## iPad で使う

GitHub Pages の公開後、Safari で `https://me7onpan.github.io/mochimono-monster/` を開きます。共有ボタンから「ホーム画面に追加」を選ぶと、PWA として起動できます。
