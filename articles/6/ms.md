% LogData.java の ドキュメント
% Glowlight
% 2018.03.14

ログファイルを出力するためのクラス"LogData.java"の仕様をここに記す.

## 仕様

~~~java
public LogData(String file, boolean isAdd)
~~~

"file"でログファイルの保存先を指定する. その際, 指定したファイルが既存の場合は, "isAdd"で上書きをするか最終行に追加するかを選択できる.isAdd=trueなら最終行に追加する. isAdd=falseならファイル全体を上書き保存する.デフォルトでは区切り文字は"反革スペース"である.

~~~java
public void add(int ... array)</span>
~~~

int型の数値をファイルに追加する.

~~~java
public void add(double ... array)</span>
~~~

double型の数値をファイルに追加する.

~~~java
public void add(String ... str)</span>
~~~

String型の文字列をファイルに追加する.

~~~java
public void add()</span>
~~~

空白行をファイルに追加する.

~~~java
public void clear()</span>
~~~

記録したデータを全て削除する.

~~~java
public void setMark(char c)</span>
~~~

区切り文字を変更する.

~~~java
public void save()</span>
~~~

記録したデータをファイルに出力する.このとき, データが大量にある場合,  途中でjavaの仕様でメモリ不足でエラーが発生する可能性がある. なので大量のデータを保存する場合は適時save()を実行する必要がある.

## ソースコード

~~~java
package cls.gldata;
	
import java.util.ArrayList;
import java.util.Arrays;
import cls.glfile.*;
import java.io.*;

public class LogData implements ILogData{
    private ArrayList<String[]> data; //文字列配列をリストに保存
    private char mark;
    private int cnt;
    private boolean isAdd;
    private String file = null;
	
    public LogData(){
        init(false);
    }

    public LogData(String file){
        init(false);
        this.file = file;
    }
	
    public LogData(boolean isAdd){
        init(isAdd);
    }
	
    public LogData(String file, boolean isAdd){
        init(isAdd);
        this.file = file;
    }

    private void init(boolean isAdd){
        data = new ArrayList<String[]>();    
        mark = ' ';
        cnt = 0;
        this.isAdd = isAdd; 
    }
	
    public void setIsAdd(boolean isAdd){
        this.isAdd = isAdd;
    }
	
    public void add(double[] array){
        String[] temp = new String[array.length];    

        for(int i = 0; i < array.length; i++){
            temp[i] = Double.toString(array[i]);    
        }

        add(temp);
    }
	
    public void add(int[] array){
        String[] temp = new String[array.length];    

        for(int i = 0; i < array.length; i++){
            temp[i] = Integer.toString(array[i]);    
        }

        add(temp);
    }
	
    public void add(){
        String[] temp = new String[1];    
        temp[0] = "";

        add(temp);
    }

    public void add(String[] str){
        String[] temp = Arrays.copyOf(str, str.length);
        data.add(temp);    
        cnt++;
    }
	
    public void clear(){
        data.clear();
        cnt = 0;
    }
	
    public void setMark(char c){
        mark = c;    
    }
	
    public void save(){
        if(file == null){
            System.out.println("error! save file is not specified at LogData");
        }            

        save(file);
    }

    public void save(String file){
        save(new File(file));    
    }
	
    public void save(File file){
        try{
            FileWriter fw = new FileWriter(file, isAdd);
            BufferedWriter bw = new BufferedWriter(fw);

            String[] temp;
	
            for(int j = 0 ; j < data.size(); j++){
                temp = data.get(j);

                for(int i = 0 ; i < temp.length; i++){
                    bw.write(temp[i]);
	
                    if(i != temp.length -1) bw.write(mark);
                }
                bw.newLine();
            }
	
            bw.close();
            fw.close();
	
            bw = null;
            fw = null;

        }catch(IOException e){
            System.out.println(e + "at LogData save");
        }    
    }
}
~~~
