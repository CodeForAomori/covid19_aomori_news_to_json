# COVID-19 Aomori prefecture News to JSON

## What's this

青森県が発信している最新情報からコロナウイルス関連のニュースを抽出し、再利用可能な JSON へ変換するスクリプトです。

## How to run

このスクリプトは GitHub Actions で毎時実行され、青森県のWEBサイトから最新ニュースの取得を試みます。
It's running every hour by GitHub Actions, to try fetching new CSV files then update files under `src/.json` automatically.

### Locally...

ローカル環境で実行する場合。

```
$ yarn start
```

