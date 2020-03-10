	//キャンバスデータ
	var canvas = document.getElementById("canvas");

	//その他グローバル変数 
	var timer = null;
	var data = init();
	var c = canvas.getContext("2d");
	var isDraw = false;
	var isOnMouse = false;

	//デフォルトでボタンの有効化を設定
	disabling(false, false, true, false);

	//ボタンのイベント処理

	//Start
	document.controller.elements[0].onclick = function(){
		disabling(true, true, false, true);
		isDraw = false;

		if(timer == null) data = init();
		if(data == null) return;
		timer = setInterval(function(){loop(data)}, 30);
	}

	//draw
	document.controller.elements[1].onclick = function(){
		disabling(false, true, false, false);
		isDraw = true;
	}
	
	//stop
	document.controller.elements[2].onclick = function(){
		disabling(false, false, true, false);
		isDraw = false;
		clearInterval(timer);
	}

	//reset
	document.controller.elements[3].onclick = function(){
		disabling(false, false, true, false);
		isDraw = false;
		data = init();

		if(data == null) return;

		clearInterval(timer);
		timer = setInterval(function(){loop(data)}, 100);
		clearInterval(timer);
		draw(data);
	}
	
	//マウス操作の処理

	//マウス座標を相対的に取得
	function getMousePos(e){
		var canvas_pos = e.target.getBoundingClientRect();
		var size = data["size"];
		var X = parseInt((e.clientX - canvas_pos.left) / size, 10);
		var Y = parseInt((e.clientY - canvas_pos.top) / size, 10);

		return [X,Y];
	}

	//マスの状態を変更する
	function changeState(x, y){
		var map = data["map"];
		var state = document.controller.elements[4].selectedIndex;
		map[y][x] = state;
		draw(data);
	}

	//マウスカーソル周囲のマスを拡大
	function drawLupe(){
	
	}

	//これらはドラッグ判定用
	canvas.onmousedown = function(){ isMouseDown = true; }
	canvas.onmouseup = function(){ isMouseDown = false; }

	//クリック判定用
	canvas.onclick = function(e){
		if(!isDraw) return;
		var pos = getMousePos(e);
		changeState(pos[0], pos[1]);
	}
	
	//編集対象のマスを表示する
	canvas.onmousemove = function(e){
		if(!isDraw) return;

		draw(data);
		var size = data["size"];
		var pos = getMousePos(e);
		var X = pos[0];
		var Y = pos[1];

		//現在格子を表示する
		c.strokeStyle = "lightblue";
		c.strokeRect(size*X, size*Y, size, size);
		c.strokeStyle = "gray";
		
		//マウスが押されているときのみ
		if(isMouseDown){
			changeState(X,Y);	
		}
	}

	//formの有効化の制御
	function disabling(t0, t1, t2, t3){
		document.controller.elements[0].disabled = t0;	
		document.controller.elements[1].disabled = t1;	
		document.controller.elements[2].disabled = t2;	
		document.controller.elements[3].disabled = t3;	
	}

	function draw(data){
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];
		var size = data["size"];

		for(y = 0; y < yn; y++){
			for(x = 0; x < xn; x++){
				switch (map[y][x]){
					case 1:	
						c.fillStyle = "silver";
						break;
					case 2:
						c.fillStyle = "blue";
						break;
					case 3:
						c.fillStyle = "aqua";
						break;
					default:
						c.fillStyle = "black";
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
		data.size = 8;
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

		data.map = temp;

		return data;
	}

	function calc(data){
		data["map"] = calcNext(data);
	}

	function count(data, state, x, y){
		var cnt = 0;
		var map = data["map"];
		var xn = data["xn"];
		var yn = data["yn"];

		for(var i = 0; i < 9 ; i++){
			var X = x + (i%3-1);
			var Y = (Math.floor(i/3)-1)+y;

			if (Y >=0 && Y < yn && X >=0 && X < xn && i != 4){
				if(map[Y][X] == state) cnt +=1;
			}
		}

		return cnt;
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

				if(map[i][j] == 2) temp[i][j] = 3;
				if(map[i][j] == 3) temp[i][j] = 1;

				if(map[i][j] == 1){
					var cnt = count(data, 2, j, i);
					if(cnt == 1 || cnt == 2) temp[i][j] = 2;
				}
			}
		}

		return temp;
	}
