function _setStyle(c, st){
	for(var p in st)
		c.style[p] = st[p];
}

function createTincalc(){
	if(arguments.length == 0)
		arguments = document.getElementsByClassName('tincalc');
	for(var t = 0; t < arguments.length; t ++){
		var box = arguments[t];
		if(!box.className.match(new RegExp('(\\s|^)tincalc(\\s|$)')))
			box.className += ' tincalc';
		var field = document.createElement('div');
		field.className = 'tincalc-field';
		box.appendChild(field);
		var bar = document.createElement('div');
		bar.className = 'tincalc-bar';
		box.appendChild(bar);
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
		panel.className = 'tincalc-panel';
		for(var i = 0; i < ROWS; i ++){
			var row = document.createElement('div');
			row.style['display'] = 'table-row';
			for(var j = 0; j < COLS; j ++)
				row.appendChild(_createButton(field, bar, txts[i][j], cmds[i][j]));
			panel.appendChild(row);
		}
		box.appendChild(panel);
	}
}

function _showMsg(bar, msg){
	bar.innerHTML = msg;
	setTimeout(
		function(){
			bar.innerHTML = '';
		},
		3000
	);
}

function _numPart(c){
	return (c >= '0' && c <= '9') || c == '.';
}

function _calc(field, bar){
	ex = new Array();
	s = new Array();
	st = field.innerHTML;
	var rev = false;
	for(var i = 0; i < st.length; ){
		if(_numPart(st[i])){
			var le = i;
			do
				++ i;
			while(i < st.length && _numPart(st[i]));
			var num = Number(st.substr(le, i - le));
			if(isNaN(num)){
				_showMsg(bar, 'Invalid input!'); // invalid number form
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
					_showMsg(bar, 'Invalid input!'); // surplus heading +/- 
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
				_showMsg(bar, 'Invalid input!'); // ( and ) do not match
				return;
			}
			if(s[j] == '[')
				ex.push('-');
			s.length = j; // pop the tails
			++ i;
		} else{
			_showMsg(bar, 'Invalid input!'); // illegal character
			return;
		}
	}
	for(var i = s.length - 1; i >= 0; i --){
		if(s[i] == '(' || s[i] == '['){
			_showMsg(bar, 'Invalid input!'); // ( and ) do not match 
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
				_showMsg(bar, 'Invalid input!'); // lacking operands
				return;
			}
			if(ex[i] == '+')
				s[s.length - 2] = s[s.length - 2] + s[s.length - 1];
			else if(ex[i] == '-')
				s[s.length - 2] = s[s.length - 2] - s[s.length - 1];
			else if(ex[i] == '*')
				s[s.length - 2] = s[s.length - 2] * s[s.length - 1];
			else if(s[s.length - 1] == 0){
				_showMsg(bar, 'A division by zero occurred!');
				return;
			} else
				s[s.length - 2] = s[s.length - 2] / s[s.length - 1];
			s.pop();
		}
	}
	if(s.length != 1){
		_showMsg(bar, 'Invalid input!'); // surplus operands
		return;
	}
	field.innerHTML = String(s[0]);
}

function _react(field, bar, cmd){
	if(cmd == 'back'){
		if(field.innerHTML != '')
			field.innerHTML = field.innerHTML.substr(0, field.innerHTML.length - 1);
	} else if(cmd == 'clear'){
		field.innerHTML = '';
	} else if(cmd == '='){
		_calc(field, bar);
	} else{
		field.innerHTML += cmd;
	}
}

function _createButton(field, bar, txt, cmd){
	var btn = document.createElement('div');
	btn.className = 'tincalc-btn';
	btn.innerHTML = txt;
	btn.style['display'] = 'table-cell';
	btn.onclick = function(){
		_react(field, bar, cmd);
	};
	return btn;
}

