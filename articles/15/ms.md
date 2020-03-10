% 共和国の自動化 その5. リンク集の自動生成
% glowlight.info
% 2018.03.17

### 自動化の流れ

背景: 科学アカデミーの記事を楽に書きたい.

1. 科学アカデミーの記事をMarkdownで記述することにした. 使うツールだRemarkableを採用.
2. Markdown -> html の変換はpandocを使う.
3. Markdownを一括でhtmlに変換するスクリプトを書く.
4. 全部の記事についての情報を取得するスクリプトを書く.
5. **科学アカデミーのリンク集を自動生成**
6. 科学アカデミーのディレクトリを同期する.
7. 更新情報を自動更新

この記事で扱う内容は5, 6番目の事柄.

### 序文

今回はついにリンク集を自動生成するためのスクリプトを紹介しようと思う.

## リンク集データの生成

### 仕様

- article_data変数で, 記事一覧データ(get_article_data.sh による)のファイルを指定
- head変数で見出しh1の内容を指定する.
- 出力形式はmarkdownである.
 
### スクリプトの解説

**make_linklist.sh**

~~~bash
#!/bin/bash

article_data=$1
head=$2

echo "# ${head}"
echo ""

for name in `cat ${article_data} | sed "s/ /|/g"`
do
	link=`echo ${name} | cut -d'|' -f 1`
	title=`echo ${name} | cut -d'|' -f 2-`

	echo "[${title}](study/${link})" | sed "s/|/ /g"
	echo ""
done
~~~
記事一覧データをcatで表示してそれをfor文で走査する. ただしそのままではスペースで改行されるために正しく処理ができない.

~~~bash
for name in `cat ${article_data} | sed "s/ /|/g"`
~~~

ここのsed文で読み込むファイルのスペースを|に変換する. そうすれば改行コードだけが改行として扱われるために正しく処理をすることが出来る.

~~~bash
link=`echo ${name} | cut -d'|' -f 1`
title=`echo ${name} | cut -d'|' -f 2-`
~~~

ここで記事の相対パスとタイトルをデータファイルから抽出している. データファイルの形式は

~~~bash
earth3/art.html 惑星を生成する その3 - 球面上の一様乱数
earth2/art.html 惑星を生成する その2 - Great Circle Faulting の実装
earth/art.html 惑星を生成する その1 - Great Circle Faulting の導入
block2/art.html 第2回:画像を表示する
block1/art.html 第1回:GUIの基礎の基礎ーウィンドウの表示をしよう!
~~~

このようになっている. タイトルにもスペースが含まれるのでawkとかでは上手く扱うことができない. こういうときはcutコマンドを使う.

~~~
cut -d"区切り文字" -f 列番号
~~~
このコマンドはこのようにして使う.

- 使用例

~~~bash
cut -d" " -f 1
~~~

~~~bash
[aa:~/web/homepage]$ cat article_data | cut -d' ' -f 1
earth3/art.html
earth2/art.html
earth/art.html
block2/art.html
block1/art.html
~~~

このとき, スペースを区切り文字としてファイルの1列目のデータのみを表示することができる. ここで数字を2にすれば2行目だけを表示することが出来る.


~~~bash
cut -d"|" -f 2-
~~~

~~~bash
[aa:~/web/homepage]$ cat article_data | cut -d' ' -f 2-
惑星を生成する その3 - 球面上の一様乱数
惑星を生成する その2 - Great Circle Faulting の実装
惑星を生成する その1 - Great Circle Faulting の導入
第2回:画像を表示する
第1回:GUIの基礎の基礎ーウィンドウの表示をしよう!
~~~

数字の**直後**に-ハイフンを付けることで**2行目以降**を全部表示することが出来る. この時の注意点としては, 数字とハイフンの間に**スペースを入れないこと**

このようにしてcutコマンドを使うことで上手く記事一覧情報ファイルから相対パスとタイトルのデータを抽出することができる.

あとはmarkdown形式でリンクを作って表示すればよい. このときにtitle変数には区切り文字|が含まれているのでこれをsedでスペースに変換する.

~~~bash
echo "[${title}](study/${link})" | sed "s/|/ /g"
echo ""
~~~