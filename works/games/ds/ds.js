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
		sealevel = range.value / 100;
		input.value = sealevel;

		if(data == null) return;
		draw(data);
	}

	//データの初期化
	function init(){
		var data = Object();
		data.size = 2;
		data.width = parseInt(canvas.width, 10);
		data.height = parseInt(canvas.height, 10);

		//xn, ynは 2**n+1 にすること.
		data.xn = 257;
		data.yn = 257;
		data.n = 8;

		//データの初期化 
		var temp = new Array(data["yn"]);
		for(var y = 0; y < data["yn"]; y++){

			temp[y] = new Array(data["xn"]);
			for(var x = 0; x < data["xn"]; x++){
				temp[y][x] = 0.0;
			}
		}

		var xn = data["xn"];
		var yn = data["yn"];
		temp[0][0] = parseFloat(document.getElementById("upleft").value);
		temp[0][xn-1] = parseFloat(document.getElementById("upright").value);
		temp[yn-1][0] = parseFloat(document.getElementById("downleft").value);
		temp[yn-1][xn-1] = parseFloat(document.getElementById("downleft").value);

		data.map = temp;
		data.r = parseFloat(document.getElementById("index").value);

		return data;
	}

	//標高データを計算
	function calc(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var map = data["map"];
		var n = data["n"];
		var r = data["r"];

		var dn, dmStart, dmget;
		var sqStart, sqget;
		var temp;
		for(var k = 1; k <= n; k++){
			//diamond
			move = 2**(n+1-k); //x軸方向の歩幅. +1は必要
			dmStart = move/2;
			dmget = move/2;
			for(var y = dmStart; y < yn; y += move){
				for(var x = dmStart; x < xn; x += move){
					temp = map[y+dmget][x+dmget];
					temp += map[y+dmget][x-dmget];
					temp += map[y-dmget][x+dmget];
					temp += map[y-dmget][x-dmget];
					map[y][x] = temp/4 + 2*(0.5-Math.random()) / k**r;
				}
			}
		
			//square
			move = 2**(n+1-k); //x軸方向の歩幅. +1は必要
			sqStart = move/2;
			sqget = move/2;

			var X, Y;
			for(var y = 0; y < yn; y += move/2){
				for(var x = sqStart; x < xn; x += move){
					temp = 0;
					X = x, Y = y-dmget;
					if(Y >= 0) temp += map[Y][X];

					X = x-dmget, Y = y;
					if(X >= 0) temp += map[Y][X];

					X = x, Y = y+dmget;
					if(Y < yn) temp += map[Y][X];

					X = x+dmget, Y = y;
					if(X < xn) temp += map[Y][X];

					map[y][x] = temp/4 + 2*(0.5-Math.random()) / k**r;
				}
				sqStart = (sqStart != 0) ? 0 : move/2;
			}
		}
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

	//中間色生成
	function getCV(a, b, h){
		//a + n/N (b - a);
		var temp = a + parseInt((b - a)*h);

		if(temp > 255) return 255;
		if(temp < 0) return 0;
		return temp;
	}
