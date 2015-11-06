var _boxStyle = {
	'background-color': '#a9a9a9',
	'border': 'outset #dcdcdc 10px',
	'border-radius': '40px',
	'width': '500px'
};

var _mainFieldStyle = {
	'width': '400px',
	'height': '50px',
	'background-color': '#c0c0c0',
	'border': 'groove #696969 4px',
	'border-radius': '10px',
	'text-align': 'left',
	'vertical-align': 'middle',
	'margin': '20px',
	'padding': '5px',
	'font-family': 'monospace',
	'font-size': '30px',
	'font-weight': 'bold',
	'color': '#000',
	'cursor': 'default'
};

var _msgBarStyle = {
	'width': '400px',
	'height': '15px',
	'text-align': 'left',
	'vertical-align': 'middle',
	'margin-left': '20px',
	'margin-right': '20px',
	'padding': '3px',
	'font-family': 'sans-serif',
	'font-size': '15px',
	'font-weight': 'bold',
	'cursor': 'default',
	'border-bottom': 'thin dashed black',
	'color': '#dc341c'
};

var _panelStyle = {
	'display': 'table',
	'margin': '20px',
	'border': 'groove #708090 5px',
	'border-radius': '5px',
	'border-spacing': '5px'
};

var _btnStyle = {
	'width': '50px',
	'height': '50px',
	'border': 'outset #b0e0e6 3px',
	'border-radius': '3px',
	'background-color': '#33f',
	'text-align': 'center',
	'vertical-align': 'middle',
	'font-weight': 'bold',
	'font-family': 'monospace',
	'font-size': '25px',
	'text-style': 'bold',
	'color': 'black',
	'cursor': 'pointer'
};

var _btnMouseOverStyle = {
	'background-color': '#003366',
	'color': 'white',
	'border': 'inset #4169e1 3px',
};


function _setStyle(c, st){
	for(p in st)
		c.style[p] = st[p];
}

function createTincalc(box){
	_setStyle(box, _boxStyle);
	var mainField = document.createElement('div');
	_setStyle(mainField, _mainFieldStyle);
	box.appendChild(mainField);
	var msgBar = document.createElement('div');
	_setStyle(msgBar, _msgBarStyle);
	box.appendChild(msgBar);
	var COLS = 5;
	var ROWS = 4;
	var txts = [ 
		['7', '8', '9', '+', '('],
		['4', '5', '6', '-', ')'],
		['1', '2', '3', '&times;', '&lArr;'],
		['0', 'C', '=', '&divide;', '.']
	];
	var cmds = [
		['7', '8', '9', '+', '('],
		['4', '5', '6', '-', ')'],
		['1', '2', '3', '*', 'back'],
		['0', 'clear', '=', '/', '.']
	];
	var panel = document.createElement('div');
	_setStyle(panel, _panelStyle);
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
	var rev = false;
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
			if(rev){
				ex.push('-');
				rev = false;
			}
		} else if(st[i] == '-' || st[i] == '+'){
			if((i == 0 || st[i - 1] == '*' || st[i - 1] == '/'
						|| st[i - 1] == '(')){
				if(i == st.length - 1 || (!_numPart(st[i + 1]) && st[i + 1] != '(')){
					_showMsg(msgBar, 'Invalid input!'); // surplus heading +/- 
					return;
				}
				if(st[i] == '-'){
					ex.push(0.0);
					rev = true;
				}
			} else{
				var j;
				for(j = s.length - 1; j >= 0 && s[j] != '(' && s[j] != '['; j --)
					ex.push(s[j]);
				s.length = j + 1;
				s.push(st[i]);
			}
			++ i;
		} else if(st[i] == '*' || st[i] == '/'){
			for(j = s.length - 1; j >= 0 && s[j] != '(' && s[j] != '[' && s[j] != '-' && s[j] != '+'; j --)
				ex.push(s[j]);
			s.length = j + 1;
			s.push(st[i]);
			++ i;
		} else if(st[i] == '('){
			if(rev){
				s.push('[');
				rev = false;
			} else
				s.push('(');
			++ i;
		} else if(st[i] == ')'){
			var j;
			for(j = s.length - 1; j >= 0 && s[j] != '(' && s[j] != '['; j --)
				ex.push(s[j]);
			if(j == -1){
				_showMsg(msgBar, 'Invalid input!'); // ( and ) do not match
				return;
			}
			if(s[j] == '[')
				ex.push('-');
			s.length = j; // pop the tails
			++ i;
		} else{
			_showMsg(msgBar, 'Invalid input!'); // illegal character
			return;
		}
	}
	for(var i = s.length - 1; i >= 0; i --){
		if(s[i] == '(' || s[i] == '['){
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
	_setStyle(btn, _btnStyle);
	btn.style['display'] = 'table-cell';
	btn.onclick = function(){
		_react(mainField, msgBar, cmd);
	};
	btn.onmouseover = function(){
		_setStyle(btn, _btnMouseOverStyle);
	};
	btn.onmouseout = function(){
		for(p in _btnMouseOverStyle)
			btn.style[p] = _btnStyle[p];
	}
	return btn;
}

