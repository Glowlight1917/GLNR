	//キャンバスデータ
	var canvas = document.getElementById("canvas");

	//その他グローバル変数 
	var timer = null;
	var data = null;
	var c = canvas.getContext("2d");

	//デフォルトでボタンの有効化を設定
	disabling(false, true, false);

	//ボタンのイベント処理

	//Start
	document.controller.elements[0].onclick = function(){
		disabling(true, false, true);

		if(timer == null) data = init();
		if(data == null) return;
		timer = setInterval(function(){loop(data)}, 30);
	}
	
	//stop
	document.controller.elements[1].onclick = function(){
		disabling(false, false, false);
		clearInterval(timer);
	}

	//reset
	document.controller.elements[2].onclick = function(){
		disabling(false, false, false);
		data = init();

		if(data == null) return;

		clearInterval(timer);
		timer = setInterval(function(){loop(data)}, 100);
		clearInterval(timer);
	}

	//formの有効化の制御
	function disabling(t0, t1, t2){
		document.controller.elements[0].disabled = t0;	
		document.controller.elements[1].disabled = t1;	
		document.controller.elements[2].disabled = t2;	
	}

	function draw(data){
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];
		var size = data["size"];

		for(y = 0; y < yn; y++){
			for(x = 0; x < xn; x++){
				if(map[y][x] == 1){
					c.fillStyle = "green";
					c.strokeStyle = "green";
				}else{
					c.fillStyle = "white";
					c.strokeStyle = "white";
				}	

				c.fillRect(size*x, size*y, size, size);
			}
		}
	}

	function loop(data){
		draw(data);
		calc(data);
	}

	//データの初期化
	function init(){
		var data = Object();
		data.size = 4;
		data.width = parseInt(canvas.width, 10);
		data.height = parseInt(canvas.height, 10);
		data.xn = data["width"] / data["size"];
		data.yn = data["height"] / data["size"];

		canvas.getContext("2d").fillStyle = "white";
		canvas.getContext("2d").fillRect(0, 0, data["width"], data["height"]);

		//初期条件を設定
		var temp = new Array(data["yn"]);
		for(var y = 0; y < data["yn"]; y++){

			temp[y] = new Array(data["xn"]);
			for(var x = 0; x < data["xn"]; x++){
				temp[y][x] = parseInt(0, 10);
			}
		}

		data.map = temp;

		//蟻の初期設定
		
		//初期座標
		var num = document.controller.elements[3];
		data.ants = Array(num.value-0);
		for(var i = 0; i < data["ants"].length; i++){
			var ant = Object();
			ant.x = parseInt(data["xn"] * Math.random(), 10);
			ant.y = parseInt(data["yn"] * Math.random(), 10);
			//初期の向き
			ant.d = parseInt(4 * Math.random(), 10);
			data["ants"][i] = ant;
		}

		return data;
	}

	function calc(data){
		for(var i = 0; i < 40; i++){
			data["map"] = calcNext(data);
		}
	}

	function calcNext(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var map = data["map"];
		var temp = Array(yn);

		for(var i = 0; i < yn; i++){
			temp[i] = Array(xn);		
		}

		for(var i = 0; i < yn; i++){
			for(var j = 0; j < xn; j++){
				temp[i][j] = map[i][j];
			}
		}

		for(var i = 0; i < data["ants"].length; i++){
			var ant = data["ants"][i];
			var d = ant["d"];

			if (map[ant["y"]][ant["x"]] == 1){

				temp[ant["y"]][ant["x"]] = 0;
				d = (d == 3) ? 0 : d + 1;
			}else{
				temp[ant["y"]][ant["x"]] = 1;
				d = (d == 0) ? 3 : d - 1;
			}

			ant["d"] = d;

			var x = ant["x"];
			var y = ant["y"];
			switch(d){
				case 0: y--; break;
				case 1: x++; break;
				case 2: y++; break;
				default: x--;
			}

			if(x < 0) x = xn-1;
			if(x >= xn) x = 0;
			if(y < 0) y = yn-1;
			if(y >= yn) y = 0;

			ant["x"] = x;
			ant["y"] = y;
		}

		return temp;
	}
