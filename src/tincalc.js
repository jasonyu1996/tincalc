function createTincalc(box){
	box.style['border'] = 'thick dotted black';
	var screen = document.createElement('div');
	screen.style['width'] = '400px';
	screen.style['height'] = '50px';
	screen.style['background-color'] = 'gold';
	screen.style['border'] = 'thin solid black';
	screen.style['text-align'] = 'left';
	screen.style['margin'] = '10px';
	screen.style['padding'] = '5px';
	screen.style['font-family'] = 'monospace';
	screen.style['font-size'] = '30px';
	screen.style['color'] = '#000';
	box.appendChild(screen);
	var COLS = 5;
	var ROWS = 4;
	var txts = new Array(
		new Array('7', '8', '9', '+', '('),
		new Array('4', '5', '6', '-', ')'),
		new Array('1', '2', '3', '&times;', '&lArr;'),
		new Array('0', 'C', '=', '&divide;', ' ')
	);
	var cmds = new Array(
		new Array('7', '8', '9', '+', '('),
		new Array('4', '5', '6', '-', ')'),
		new Array('1', '2', '3', '*', 'back'),
		new Array('0', 'clear', '=', '/', '')
	);
	var panel = document.createElement('div');
	panel.style['display'] = 'table';
	panel.style['margin'] = '10px';
	panel.style['border-spacing'] = '5px';
	for(var i = 0; i < ROWS; i ++){
		var row = document.createElement('div');
		row.style['display'] = 'table-row';
		for(var j = 0; j < COLS; j ++)
			row.appendChild(_createButton(screen, txts[i][j], cmds[i][j]));
		panel.appendChild(row);
	}
	box.appendChild(panel);
}

function _react(screen, cmd){
	if(cmd == 'back'){
	} else if(cmd == 'clear'){
		screen.innerHTML = '';
	} else if(cmd == '='){
	} else{
		screen.innerHTML += cmd;
	}
}

function _createButton(screen, txt, cmd){
	var btn = document.createElement('div');
	btn.innerHTML = txt;
	btn.style['display'] = 'table-cell';
	btn.style['width'] = btn.style.height = '30px';
	btn.style['border'] = 'thin solid black';
	btn.style['background-color'] = 'blue';
	btn.style['text-align'] = 'center';
	btn.style['text-style'] = 'bold';
	btn.style['font-family'] = 'monospace';
	btn.style['font-size'] = '20px';
	btn.onclick = function(){
		_react(screen, cmd);
	}
	return btn;
}

