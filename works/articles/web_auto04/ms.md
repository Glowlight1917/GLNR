% 共和国の自動化 その4. 記事情報の取得
% Glowlight
% 2018.03.16

## はじめに

### 自動化の流れ

背景: 科学アカデミーの記事を楽に書きたい.

1. 科学アカデミーの記事をMarkdownで記述することにした. 使うツールだRemarkableを採用.
2. Markdown -> html の変換はpandocを使う.
3. Markdownを一括でhtmlに変換するスクリプトを書く.
4. **全部の記事についての情報を取得するスクリプトを書く.**
5. 科学アカデミーのリンク集を自動生成
6. 科学アカデミーのディレクトリを同期する.
7. 更新情報を自動更新

この記事で扱う内容は4番めの事柄.

### 序文

今回紹介するスクリプトは, 記事があるディレクトリ全体を走査して存在する記事のタイトル, パスを取得して一覧情報を生成するものである. この情報を基にして科学アカデミーのリンク集の自動生成が行われることになる.

## スクリプトの解説

### 仕様

- 記事のパスはdata_dirよりも上のパスを消して表示される. 相対パスに変換するためである.
- 記事のタイトルはtitleタグから取得する. 無かったらno_titleとして表示する.

### スクリプト

**get_article_data.sh**

~~~bash
#!/bin/bash

#記事のデータを取得するスクリプト

data_dir=${1%/}
extension=$2

if [ $# -eq 0 ];
then
	echo "./get_article_data.sh data_dir extension" >&2
	exit 1
fi

#nameはフルパスである.
for name in `find ${data_dir} -name "*.${extension}" | sort`
do
	#パスデータを編集 ->  記事の直属のディレクト/記事ファイル名
	link=`echo ${name} | sed "s#${data_dir}/##g"`

	#記事の題名を取得 for HTML
	title=`cat ${name} | grep '<title>.*</title>' \
			| sed 's#\s.*<title>##g' | sed 's#</title>##g'`

	#タイトルが付いていない場合
	if [ -z "${title}" ];
	then
		title="no_title"
	fi

	echo "${link} ${title}"
done

exit 0
~~~

記事ファイルの相対パスを取得する箇所

~~~bash
#パスデータを編集 ->  記事の直属のディレクト/記事ファイル名
link=`echo ${name} | sed "s#${data_dir}/##g"`
~~~

ここではフルパスとして取得された, 記事のパスをsedコマンドでdata_dirのところを削除することによって相対パスに変換している. sedコマンドの区切り文字が#になっているのは, そうしないとパス文字列に含まれるスラッシュのせいで上手く動作しないからである.

~~~bash
#記事の題名を取得 for HTML
title=`cat ${name} | grep '<title>.*</title>' \
		| sed 's#\s.*<title>##g' | sed 's#</title>##g'`
~~~

htmlファイルのtitleタグから記事のタイトルを取得している. その処理はcatで記事を表示してそこからtitleタグの部分を抜き出してタグの部分を取り除くという原始的な方法を使っている.

~~~bash
#タイトルが付いていない場合
if [ -z "${title}" ];
then
	title="no_title"
fi
~~~

タイトル取得処理ができなかった場合. つまり記事にタイトルが存在しない場合はtitle変数には空文字列が代入される. そういうときにはtitle変数にno_titleを変わりに代入している. この処理をするときにtitleが空白であるかを確認する必要がある. この辺は[このサイト](http://d.hatena.ne.jp/masa_edw/20080422/1208834378)を参考にした.

### スクリプトの実行例

左側が記事の相対パス, 残りが記事のタイトル. タイトルにもスペースが含まれているがそこはcutコマンドを使えば上手く扱うことができる.

~~~bash
[aa:~/web/homepage]$ cat article_data 
earth3/art.html 惑星を生成する その3 - 球面上の一様乱数
earth2/art.html 惑星を生成する その2 - Great Circle Faulting の実装
earth/art.html 惑星を生成する その1 - Great Circle Faulting の導入
block2/art.html 第2回:画像を表示する
block1/art.html 第1回:GUIの基礎の基礎ーウィンドウの表示をしよう!
web_auto03/art.html 共和国の自動化 その3. pandocを用いたhtmlへの変換
web_auto02/art.html 共和国の自動化 その2 記事作成
autokizi/art.html 共和国の自動化 その1. 記事作成スクリプト
col_circle/art.html 円同士の重なり
renban/art.html ファイル名を連番にしてくれるスクリプトをつくろう!
logdata/art.html LogData.java の ドキュメント
line/art.html Line.java
terrain_gimp01/art.html Gimpで地形生成をしよう! その1
~~~