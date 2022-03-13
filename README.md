# Soukanzu_maker

まだまだ個人的目標には程遠い、制作課題用です。
そのため、開発環境下でしか起動できません。申し訳ありません。

要素技術としてはDocker, nuxt.js (Vue), MySQLを用いました。
Docker　を用いておりますので、開発環境は比較的容易に準備できるはずです。


## How to 環境再現

docker-compose を用いて開発環境を作っておりますので、再現は比較的容易なはずです。

### 0. git clone

### 1. docker-compose 編集
私の環境が　M1 Mac　であるため、プラットフォームに関する記述がそれぞれのコンテナ箇所に追記されております。
環境によってはその文を削除してください。

### 2. docker-compose up
composeを立ち上げることで、database/sql/initに従って、テーブルが自動で作成されます。

テーブル作成が少し時間がかかるのかもしれません。
なお、MySQLの調子はhttp://localhost:8000で確認できます。

```
docker-compose up -d
```

### 3. nuxt コンテナに入る

```
docker-compose exec nuxt sh
```

### 4. yarn コマンドにより諸々のインストール

```
> cd nuxt_app
> yarn
```

### 5. yarn dev コマンドにより開発環境の起動

```
> yarn dev
```

