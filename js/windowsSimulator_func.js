/*
WINDOWS SIMULATOR © 2022-2024
Desenvolvido por Reynolds Costa, no Notepad++

O uso é permitido; a comercialização, proibida.
*/

/*
Esse arquivo contém
      -------------
1) as |==FUNÇÕES==| que o script reescreve,
      -------------
2) o instanciamento de classes que são necessárias para o seu funcionamento e
3) a inclusão de listeners que interagem com o simulador.
Alterar esses códigos é desnecessário para a maioria das funções comuns.
*/

window.onload = function() {
	WS = new WindowsSimulator();
}

window.onclick = function(e) {
	if (WS_isLoaded) WS._control.click(e);
}

window.onkeydown = function(e) {
	if (WS_isLoaded) WS._control.keydown(e);
}

window.onkeyup = function(e) {
	if (WS_isLoaded) WS._control.keyup(e);
}

window.onresize = function() {
	if (WS_isLoaded) WS._control.resize();
}

window.oncontextmenu = function(e) {
	e.preventDefault();
	return false;
}