	//キャンバスデータ
	var canvas = document.getElementById("canvas");
	var canvas2 = document.getElementById("canvas2");
	var canList = [canvas, canvas2];

	//その他グローバル変数 
	var timer = null;
	var data = null;

	//デフォルトでボタンの有効化を設定
	disabling(false, true, true, false);

	//ボタンのイベント処理

	//Start
	document.controller.elements[0].onclick = function(){
		disabling(true, false, false, true);

		if(timer == null) data = init();
		if(data == null) return;
		timer = setInterval(function(){loop(data)}, 80);
	}

	//Stop
	document.controller.elements[1].onclick = function(){
		disabling(false, true, false, false);
		clearInterval(timer);
	}

	//Reset
	document.controller.elements[2].onclick = function(){
		disabling(false, true, false, false);
		data = init();

		if(data == null) return;

		clearInterval(timer);
		timer = setInterval(function(){loop(data)}, 80);
		clearInterval(timer);
	}

	//formの有効化の制御
	function disabling(t0, t1, t2, t3){
		document.controller.elements[0].disabled = t0;	
		document.controller.elements[1].disabled = t1;	
		document.controller.elements[2].disabled = t2;	
		document.controller.elements[3].disabled = t3;	
	}

	//ちらつき防止処理
	function buffering(data){
		draw(data);

		canList.push(canList[0]);
		canList.shift();
	}

	function draw(data){
		var map = data["map"];
		var xn = data["xn"];
		var size = data["size"];
		var c = canList[0].getContext("2d");

		for(y = 0; y < map.length; y++){
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
		buffering(data);
		calc(data);
	}

	//データの初期化
	function init(){
		var data = Object();
		data.map = [];
		data.size = 4;
		data.width = parseInt(document.getElementById("canvas").width, 10);
		data.height = parseInt(document.getElementById("canvas").height, 10);
		data.xn = data["width"] / data["size"];
		data.yn = data["height"] / data["size"];
		data.rule = parseInt(document.controller.rule.value, 10);

		if(isNaN(data["rule"]) || data["rule"] < 0 || data["rule"] > 255){
			alert("ルールの書式がおかしい.\n\n0 <= rule <= 255");
			return null;
		}

		canvas2.getContext("2d").fillStyle = "white";
		canvas2.getContext("2d").fillRect(0, 0, data["width"], data["height"]);

		//初期条件を設定
		var temp = [];
		for(var x = 0; x < data["xn"]; x++){
			temp[x] = parseInt(2 * Math.random(), 10);
		}
		data["map"].push(temp);

		return data;
	}

	function calc(data){
		var map = data["map"];
		var current = map[map.length - 1];
		var next = calcNext(data, current);

		//配列nextをプッシュ
		if(map.length < data["yn"]){
			map.push(next);	
		}else{
			map.push(next);	
			map.shift();
		}
	}

	function calcNext(data, current){
		var left, right, index;
		var temp = new Array(current.length);
		var xn = data["xn"];
		var rule = data["rule"];

		for(var x = 0; x < current.length; x++){
			left = x-1;
			right = x+1;	

			//周期境界条件
			if(x == 0) left = xn-1;
			if(x == xn-1) right = 0;

			//セルオートマトンのルールを適用 
			index = 4*current[left] + 2*current[x] + current[right];
			temp[x] = (rule>>index)&1;
		}

		return temp;
	}
