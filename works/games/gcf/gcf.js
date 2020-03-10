	//キャンバスデータ
	var canvas = document.getElementById("canvas");

	//その他グローバル変数 
	var data = null;
	var sealevel = 0.0;

	//Start
	document.controller.elements[0].onclick = function(){
		data = init();
		calc(data);
		draw(data);
	}

	//海抜変更
	document.controller.elements[1].onchange = function(){
		var range = document.controller.elements[1];
		var input = document.controller.elements[2];
		sealevel = Math.sqrt(200) * range.value / 100;
		input.value = sealevel;

		if(data == null) return;
		draw(data);
	}

	//地図の描画
	function draw(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var size = data["size"];
		var c = canvas.getContext("2d");
		var map = data["map"];
		var h = 0.0;

		for(y = 0; y < yn; y++){
			for(x = 0; x < xn; x++){
				h = map[y][x];
				c.fillStyle = getColor(h, sealevel);
				c.strokeStyle = getColor(h, sealevel);
				c.fillRect(size*x, size*y, size, size);
			}
		}
	}

	//中間色生成
	function getCV(a, b, h){
		//a + n/N (b - a);
		var temp = a + parseInt((b - a)*(h / (2*Math.sqrt(200))));

		if(temp > 255) return 255;
		if(temp < 0) return 0;
		return temp;
	}

	//標高を色に変換 
	function getColor(h, sealevel){
		var H = h - sealevel;
		var r,g,b;

		if(H < 0.0){
			r = getCV(100,0,-H);
			g = getCV(150,0,-H);
			b = getCV(255, 200, -H);
		}else{
			r = getCV(100, 150, H);
			g = getCV(255, 90 ,H);
			b = getCV(100, 0, H);
		}

		return "rgba("+r+","+g+","+b+",1)";
	}

	//データの初期化
	function init(){
		var data = Object();
		data.size = 2;
		data.width = parseInt(canvas.width, 10);
		data.height = parseInt(canvas.height, 10);
		data.xn = data["width"] / data["size"];
		data.yn = data["height"] / data["size"];

		//データの初期化 
		var temp = new Array(data["yn"]);
		for(var y = 0; y < data["yn"]; y++){

			temp[y] = new Array(data["xn"]);
			for(var x = 0; x < data["xn"]; x++){
				temp[y][x] = parseInt(2 * Math.random(), 10);
			}
		}
		data.map = temp;

		var n = new Array(200);
		//法線ベクトルをランダムに生成
		for(var i = 0; i < n.length; i++){
			//z < [-1, 1]	
			z = 20001*Math.random() / 10000 - 1.0;
			//phi < [0, 2pi]
			ph = Math.random()*parseInt((2 * Math.PI * 10000) + 1) / 10000;

			//[theta,phi]
			n[i] = [Math.acos(z),ph];	
		}
		data.n = n;

		return data;
	}

	//標高データを計算
	function calc(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var map = data["map"];

		var dot;
		for(var y = 0; y < yn; y++){
			for(var x = 0; x < xn; x++){
				//緯度と経度に変換
				var th = y/yn * Math.PI;
				var ph = x/xn * 2*Math.PI;

				var st = Math.sin(th);
				var sp = Math.sin(ph);
				var ct = Math.cos(th);
				var cp = Math.cos(ph);

				var temp = 0.0;
				var ndata = data["n"];
				//標高データの生成
				for(n = 0; n < ndata.length; n++){
					dot = st*cp*Math.sin(ndata[n][0])*Math.cos(ndata[n][1]) +
						st*sp*Math.sin(ndata[n][0])*Math.sin(ndata[n][1]) +
						ct*Math.cos(ndata[n][0]);

					temp += Math.sign(dot);
				}

				map[y][x] = temp;
			}
		}
	}
