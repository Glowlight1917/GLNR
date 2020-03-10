% Line.java
% Glowlight
% 2018.03.14

ゲームで用いる線分処理のためのクラス"Line.java"の仕様をここに記す.

## 仕様

~~~java
public Line(double startX\, double startY\, double endX\, double endY)
~~~

このクラスのコンストラクタ. 始点(startX, startY)から終点(endX, endY)までの間に引かれる線分を生成する.

~~~java
public void move(double x\, double y)
~~~

線分を平行移動する.

~~~java
public void rotate(double rad)
~~~

線分を始点を中心としてrad(ラジアン度)だけ回転する.

~~~java
public void rotate(double rad\, double x\, double y)
~~~

線分を指定した点(x, y)の周りでrad(ラジアン度)だけ回転する.

~~~java
public Vector coll(Line line)
~~~

線分同士の交差を調べる. 線分lineが線分thisに衝突するときの交点を求めるためのパラメータを取得する. 線分thisの始点から交点までの距離, 線分lineの始点から交点までの距離をそれぞれtとsを用いて表す. 詳しくは数学的な解説を参照.

~~~java
public Vector coll(Sprite sp\, int index)
~~~

スプライトと線分の衝突を判定するときに用いる.

~~~java
public Vector[] reflect(Line line)
~~~

ボールが壁にあたった時の跳ね返りなどを表すときに使う. 線分lineを線分thisで折り返したときの, 交点と線分lineの終点の間をベクトルとして表現する. このときそのベクトルは線分thisの平行成分と垂直成分に分割される. 平行成分は"滑りベクトル"として, 垂直成分は"法線ベクトル"として扱うことが出来る. その他にも,ボールが反射した直後のボールの速度も返す. つまり, 滑りベクトル, 法線ベクトル, 速度ベクトルを返す関数である.

~~~java
public Vector[] reflect(Sprite sp\, int index)
~~~

スプライトと壁の間の運動を表すときに使う. これによりブロックとの衝突処理が実装できる.

~~~java
public double startX()
~~~

線分の始点x座標を返す.

~~~java
public double startY()
~~~

線分の始点y座標を返す.

~~~java
public double endX()
~~~

線分の終点x座標を返す.

~~~java
public double endY()
~~~

線分の終点y座標を返す.

~~~java
public double length()
~~~

線分の長さを返す.

~~~java
public double angle()
~~~

線分の角度を返す.

~~~java
public Vector getVector()
~~~

線分の始点と終点の間をベクトルとして返す.

## ソースコード

~~~java
class Line{
	protected double sx, sy;
	protected double ex, ey;
	protected double length;
	protected double angle;
	protected double ax, ay; //方向ベクトル
	protected double hx, hy; //法線ベクトル

	public Line(double startX, double startY, double endX, double endY){
		this.sx = startX; this.sy = startY;
		this.ex = endX; this.ey = endY;
		this.ax = (ex - sx)/length; this.ay = (ey - sy)/length;
		this.hx = -ay; this.hy = ax;

		this.length = Math.sqrt((ex - sx)*(ex - sx) + (ey - sy)*(ey - sy));
	}

	//平行移動
	public void move(double x, double y){
		this.sx += x;
		this.sy += y;
		this.ex += x;
		this.ey += y;
	}

	//始点を中心に回転
	public void rotate(double rad){
		double tx = this.ex;
		double ty = this.ey;

		this.ex = (tx - sx)*Math.cos(rad) - (ty - sy)*Math.sin(rad) + sx;
		this.ey = (tx - sx)*Math.sin(rad) + (ty - sy)*Math.cos(rad) + sy;
	}

	//指定した点を中心に回転
	public void rotate(double rad, double x, double y){
		double tx = this.sx;
		double ty = this.sy;
		this.sx = (tx - x)*Math.cos(rad) - (ty - y)*Math.sin(rad) + x;
		this.sy = (tx - x)*Math.sin(rad) + (ty - y)*Math.cos(rad) + y;

		tx = this.ex;
		ty = this.ey;
		this.ex = (tx - x)*Math.cos(rad) - (ty - y)*Math.sin(rad) + x;
		this.ey = (tx - x)*Math.sin(rad) + (ty - y)*Math.cos(rad) + y;
	}

	//線分同士の交差判定
	public boolean isCross(double lsx, double lsy, double lex, double ley){
		Vector v = new Vector(lex- lsx, ley - lsy);
		Line l1 = new Line(lsx, lsy, sx, sy);
		Line l2 = new Line(lex, ley, ex, ey);

		if(l1.normal().dot(v) >= 0.0) return false;
		if(l2.normal().dot(v) <= 0.0) return false;
		if(normal().dot(l1.getVector()) * normal().dot(l2.getVector()) > 0.0) return false;

		return true;
 	}

	public boolean isCross(Line line){
		return isCross(line.sx, line.sy, line.ex, line.ey);
	}

	public double dist(double x, double y){ return Math.abs(av.get(1)*(x - sx) - av.get(0)*(y - sy)); } //点と直線の距離取得
	public double dotDir(double x, double y){ return av.get(0) * x + av.get(1) * y; }
	public double dotNor(double x, double y){ return hv.get(0) * x + hv.get(1) * y; }

	public double length(){ return length; }
	public double angle(){ 
  		double tx = ex - sx, ty = ey - sy; 
		if(ty > 0) return Math.acos(tx / length);	

		return 2*Math.PI - Math.acos(tx / length);	
	}
}
~~~
