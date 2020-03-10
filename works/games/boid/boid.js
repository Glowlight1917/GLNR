	//キャンバスデータ
	var canvas = document.getElementById("canvas");

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
	
	//stop
	document.controller.elements[1].onclick = function(){
		disabling(false, true, false, false);
		clearInterval(timer);
	}

	//reset
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
				temp[y][x] = 0; 
			}
		}

		//Boidオブジェクトの配列を生成
		var num = 100;
		var boids = new Array(1);
		var boid;
		for(var i = 0; i < num; i++){
			boid = Object();
			boid.x = data["width"]*Math.random();
			boid.y = data["height"]*Math.random();
			boid.th = 2*Math.PI*Math.random();
			boid.v = 4.0;
			boids[i] = boid;
		}

		data.boids = boids;
		data.map = temp;
		return data;
	}

	function loop(data){
		draw(data);
		calc(data);
	}

	function draw(data){
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];
		var size = data["size"];
		var c = canvas.getContext("2d");

		//マップを描画
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

		//boidを描画
		var boids = data["boids"];
		var boid;
		for(i = 0; i < boids.length ; i++){
			boid = boids[i];

			c.fillStyle = "red";
			c.strokeStyle = "red";
			c.beginPath();
			c.arc(boid["x"], boid["y"], 2, 0, 2*Math.PI, true);
			c.stroke();
			c.fill();
		}
	}

	function calc(data){
		var xn = data["xn"];
		var yn = data["yn"];
		var map = data["map"];

		var boids = data["boids"];
		var boid;
		var x, y, v, th;
		for(i = 0; i < boids.length ; i++){
			boid = boids[i];
			x = boid["x"];
			y = boid["y"];
			v = boid["v"];
			th = boid["th"];

			boid["x"] += v*Math.cos(th);
			boid["y"] += v*Math.sin(th);
			boid["th"] += 0.01*th;
		}
	}
