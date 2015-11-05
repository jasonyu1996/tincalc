function createTincalc(box){
	box.style['border'] = 'thick dotted black';
	var mainField = document.createElement('div');
	mainField.style['width'] = '400px';
	mainField.style['height'] = '50px';
	mainField.style['background-color'] = 'gold';
	mainField.style['border'] = 'thin solid black';
	mainField.style['text-align'] = 'left';
	mainField.style['margin'] = '10px';
	mainField.style['padding'] = '5px';
	mainField.style['font-family'] = 'monospace';
	mainField.style['font-size'] = '30px';
	mainField.style['color'] = '#000';
	box.appendChild(mainField);
	var msgBar = document.createElement('div');
	msgBar.style['width'] = '400px';
	msgBar.style['height'] = '15px';
	msgBar.style['background-color'] = '#ffff66';
	msgBar.style['text-align'] = 'left';
	msgBar.style['margin-left'] = '10px';
	msgBar.style['margin-right'] = '10px';
	msgBar.style['padding'] = '3px';
	msgBar.style['font-family'] = 'sans-serif';
	msgBar.style['font-size'] = '13px';
	box.appendChild(msgBar);
	var COLS = 5;
	var ROWS = 4;
	var txts = new Array(
			new Array('7', '8', '9', '+', '('),
			new Array('4', '5', '6', '-', ')'),
			new Array('1', '2', '3', '&times;', '&lArr;'),
			new Array('0', 'C', '=', '&divide;', '.')
			);
	var cmds = new Array(
			new Array('7', '8', '9', '+', '('),
			new Array('4', '5', '6', '-', ')'),
			new Array('1', '2', '3', '*', 'back'),
			new Array('0', 'clear', '=', '/', '.')
			);
	var panel = document.createElement('div');
	panel.style['display'] = 'table';
	panel.style['margin'] = '10px';
	panel.style['border-spacing'] = '5px';
	for(var i = 0; i < ROWS; i ++){
		var row = document.createElement('div');
		row.style['display'] = 'table-row';
		for(var j = 0; j < COLS; j ++)
			row.appendChild(_createButton(mainField, msgBar, txts[i][j], cmds[i][j]));
		panel.appendChild(row);
	}
	box.appendChild(panel);
}

function _showMsg(msgBar, msg){
	msgBar.innerHTML = msg;
	setTimeout(
			function(){
				msgBar.innerHTML = '';
			},
			3000
			);
}

function _numPart(c){
	return (c >= '0' && c <= '9') || c == '.';
}

function _calc(mainField, msgBar){
	ex = new Array();
	s = new Array();
	st = mainField.innerHTML;
	for(var i = 0; i < st.length; ){
		if(_numPart(st[i])){
			var le = i;
			do
				++ i;
			while(i < st.length && _numPart(st[i]));
			var num = Number(st.substr(le, i - le));
			if(isNaN(num)){
				_showMsg(msgBar, 'Invalid input!'); // invalid number form
				return;
			}
			ex.push(num);
		} else if(st[i] == '-' || st[i] == '+'){
			if((i == 0 || st[i - 1] == '*' || st[i - 1] == '/'
						|| st[i - 1] == '('))
				ex.push(0.0);
			var j;
			for(j = s.length - 1; j >= 0 && s[j] != '('; j --)
				ex.push(s[j]);
			s.length = j + 1;
			s.push(st[i]);
			++ i;
		} else if(st[i] == '*' || st[i] == '/' || st[i] == '('){
			for(j = s.length - 1; j >= 0 && s[j] != '(' && st[j] != '-' && st[j] != '/'; j --)
				ex.push(s[j]);
			s.length = j + 1;
			s.push(st[i]);
			++ i;
		} else if(st[i] == ')'){
			var j;
			for(j = s.length - 1; j >= 0 && s[j] != '('; j --)
				ex.push(s[j]);
			if(j == -1){
				_showMsg(msgBar, 'Invalid input!'); // ( and ) do not match
				return;
			}
			s.length = j; // pop the tails
			++ i;
		} else{
			_showMsg(msgBar, 'Invalid input!'); // illegal character
			return;
		}
	}
	for(var i = s.length - 1; i >= 0; i --){
		if(s[i] == '('){
			_showMsg(msgBar, 'Invalid input!'); // ( and ) do not match 
			return;
		}
		ex.push(s[i]);
	}
	s.length = 0;
	for(var i = 0; i < ex.length; i ++){
		if(ex[i] != '+' && ex[i] != '-' && ex[i] != '*' && ex[i] != '/'){
			s.push(ex[i]);
		} else{
			if(s.length < 2){
				_showMsg(msgBar, 'Invalid input!'); // lacking operands
				return;
			}
			if(ex[i] == '+')
				s[s.length - 2] = s[s.length - 2] + s[s.length - 1];
			else if(ex[i] == '-')
				s[s.length - 2] = s[s.length - 2] - s[s.length - 1];
			else if(ex[i] == '*')
				s[s.length - 2] = s[s.length - 2] * s[s.length - 1];
			else if(s[s.length - 1] == 0){
				_showMsg(msgBar, 'A division by zero occurred!');
				return;
			} else
				s[s.length - 2] = s[s.length - 2] / s[s.length - 1];
			s.pop();
		}
	}
	if(s.length != 1){
		_showMsg(msgBar, 'Invalid input!'); // surplus operands
		return;
	}
	mainField.innerHTML = String(s[0]);
}

function _react(mainField, msgBar, cmd){
	if(cmd == 'back'){
		if(mainField.innerHTML != '')
			mainField.innerHTML = mainField.innerHTML.substr(0, mainField.innerHTML.length - 1);
	} else if(cmd == 'clear'){
		mainField.innerHTML = '';
	} else if(cmd == '='){
		_calc(mainField, msgBar);
	} else{
		mainField.innerHTML += cmd;
	}
}

function _createButton(mainField, msgBar, txt, cmd){
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
	btn.style['color'] = 'black';		
	btn.onclick = function(){
		_react(mainField, msgBar, cmd);
	};
	btn.style['cursor'] = 'pointer';
	btn.onmouseover = function(){
		btn.style['background-color'] = '#003366';		
		btn.style['color'] = 'white';		
	};
	btn.onmouseout = function(){
		btn.style['background-color'] = 'blue';
		btn.style['color'] = 'black';		
	}
	return btn;
}

