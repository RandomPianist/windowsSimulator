/*
WINDOWS SIMULATOR © 2022-2024
Desenvolvido por Reynolds Costa, no Notepad++

O uso é permitido; a comercialização, proibida.
*/

/*
         ---------------
Esse é o |==PRINCIPAL==| arquivo dessa biblioteca.
         ---------------
AVISO:
Não altere se não souber o que está fazendo.
*/

let WS;
let WS_isLoaded = false;
let WS_isLoading = false;
let WS_menu_bar_json = new Array();
const WS_doNotCallback = Math.random();

function WindowsSimulator() {
	const keyCodes = {
		0: "Erro",
		8: "Backspace",
		9: "Tab",
		13: "Enter",
		16: "Shift",
		17: "Ctrl",
		18: "Alt",
		19: "Pause/break",
		20: "Caps Lock",
		32: "Espaço",
		33: "Page up",
		34: "Page down",
		35: "End",
		36: "Home",
		37: "←",
		38: "↑",
		39: "→",
		40: "↓",
		44: "Print Screen",
		45: "Insert",
		46: "Delete",
		48: "0",
		49: "1",
		50: "2",
		51: "3",
		52: "4",
		53: "5",
		54: "6",
		55: "7",
		56: "8",
		57: "9",
		59: ";",
		65: "A",
		66: "B",
		67: "C",
		68: "D",
		69: "E",
		70: "F",
		71: "G",
		72: "H",
		73: "I",
		74: "J",
		75: "K",
		76: "L",
		77: "M",
		78: "N",
		79: "O",
		80: "P",
		81: "Q",
		82: "R",
		83: "S",
		84: "T",
		85: "U",
		86: "V",
		87: "W",
		88: "X",
		89: "Y",
		90: "Z",
		91: "Windows Esquerdo",
		93: "Windows Direito",
		95: "sleep",
		96: "0 Numérico",
		97: "1 Numérico",
		98: "2 Numérico",
		99: "3 Numérico",
		100: "4 Numérico",
		101: "5 Numérico",
		102: "6 Numérico",
		103: "7 Numérico",
		104: "8 Numérico",
		105: "9 Numérico",
		106: "*",
		107: "+",
		108: ".",
		109: "-",
		110: ".",
		111: "/",
		112: "F1",
		113: "F2",
		114: "F3",
		115: "F4",
		116: "F5",
		117: "F6",
		118: "F7",
		119: "F8",
		120: "F9",
		121: "F10",
		122: "F11",
		123: "F12",
		124: "F13",
		125: "F14",
		126: "F15",
		127: "F16",
		128: "F17",
		129: "F18",
		130: "F19",
		131: "F20",
		132: "F21",
		133: "F22",
		134: "F23",
		135: "F24",
		136: "F25",
		137: "F26",
		138: "F27",
		139: "F28",
		140: "F29",
		141: "F30",
		142: "F31",
		143: "F32",
		144: "Num lock",
		145: "Scroll lock",
		173: "Mute/unmute",
		174: "Diminuir volume",
		175: "Aumentar volume",
		176: "Próximo",
		177: "Anterior",
		178: "Parar",
		179: "Tocar"
	}
	
	let clonar = function(obj) {
		let obj2 = (obj.constructor === Array) ? [] : {};
		for (x in obj) {
			let val = obj[x];
			obj2[x] = (typeof val === "object") ? clonar(val) : val;
		}
		return obj2;
	}
	
	const Control = function() {
        let that = this;

		let executaKC = function(cod) {
			return (
				!WS.menu.context.isOpen || ([18, 27].indexOf(cod) == -1 && ([13, 37, 38, 39, 40].indexOf(cod) == -1 || WS.menu.context.selected === null))
			) && (
				!WS_menu_bar_json.length || (cod != 18 && ([13, 27, 37, 38, 39, 40].indexOf(cod) == -1 || WS.menu.bar.selectedRoot === null))
			) && !WS.boxes.resources.getLast("active")
		}
		
		this.alt = function(tipo, abrir) {
			Array.from(document.querySelectorAll("#ws-menu" + tipo + " span")).forEach((el) => {
				if (abrir) {
					if (el.dataset.alt !== undefined) {
						let conteudo = el.innerHTML;
						let indice = parseInt(el.dataset.alt.replace("charAt", ""));
						let letra = conteudo.substring(indice, indice + 1);
						el.innerHTML = conteudo.substring(0, indice) + "<u>" + letra + "</u>" + conteudo.substring(indice + 1);
						WS.menu[tipo].altList.push(letra.toUpperCase());
					}
				} else el.innerHTML = el.innerHTML.replace("<u>", "").replace("</u>", "");
			});
			WS.menu[tipo].alt = abrir;
			if (!abrir) WS.menu[tipo].altList = new Array();
		}
		
		this.click = function(e) {
			let continua = true;
			["context", "bar"].forEach((tipo) => {
				if (WS.menu[tipo].isOpen && continua) {
					let impedido = false;
					Array.from(document.querySelectorAll("#ws-menu" + tipo + " a.disabled, #ws-menu" + tipo + " a.filhos")).forEach((el) => {
						if (el.contains(e.target)) impedido = true;
					});
					if (!impedido) {
						WS.menu[tipo].close();
						that.alt(tipo, false);
					}
					continua = false;
				}
			});
            if (continua) continua = WS.boxes._control.click(e);
		}
		
		this.keydown = function(e) {
			let encontrar = function(somar, _lista, node, tag) {
				let indice = -1;
				for (let i = 0; i < _lista.length && indice == -1; i++) {
					if (_lista[i].querySelector(tag).isEqualNode(node)) indice = i;
				}
				indice += somar;
				if (indice < 0) indice = _lista.length - 1;
				else if (indice > _lista.length - 1) indice = 0;
				return _lista[indice].querySelector(tag);
			}
			
			let setas = function(_cod, _selecionado, _caixa, bar) {
				let el = null;
				if (_cod != 39) {
					let lista = new Array();
					Array.from(_caixa.children).forEach((el) => {
						if (el.querySelector("a") !== null) lista.push(el);
					});
					el = encontrar(_cod - 39, lista, _selecionado, "a");
				} else if (_selecionado.classList.contains("filhos")) el = _selecionado.nextElementSibling.firstElementChild.firstElementChild;
				if (el !== null) WS.menu.over(el, false, WS.menu[bar ? "bar" : "context"], bar);
				return el === null;
			}
			
			let fAlt = false;
			let altPressionado = function(bar, _cod) {
				WS.menu[bar ? "bar" : "context"].altList.forEach((letra) => {
					for (x in keyCodes) {
						if (keyCodes[x] == letra && x == _cod) {
							let seletores = bar ? ["#ws-menubar .ws-menubox span", "#ws-menubar > ul > li > span"] : ["#ws-menucontext span"];
							for (let i = 0; i < seletores.length; i++) {
								Array.from(document.querySelectorAll(seletores[i])).forEach((el) => {
									if (el.dataset.alt !== undefined) {
										let indice = parseInt(el.dataset.alt.replace("charAt", ""));
										if (el.innerHTML.substring(indice + 3, indice + 4).toUpperCase() == letra) {
											if (!i) {
												let aux = el;
												do {
													aux = aux.parentElement;
												} while (aux.tagName != "A")
												WS.menu.over(aux, false, WS.menu[bar ? "bar" : "context"], bar);
											} else {
												WS.menu.bar.selectedRoot = el;
												WS.menu.bar.selected = null;
												fAlt = true;
											}
											_cod = 13;
										}
									}
								});
							};
						}
					}
				});
				return _cod;
			}
			
			if (WS.menu.bar.shortcuts.keydown(e)) {
				let cod = e.keyCode;
				if (!executaKC(cod)) {
					if (WS.menu.context.isOpen) {
						cod = altPressionado(false, cod);				
						if ([13, 18, 27, 37, 38, 39, 40].indexOf(cod) > -1) {
							e.preventDefault();
							const selecionado = WS.menu.context.selected;
							if ([37, 38, 39, 40].indexOf(cod) > -1) {
								const div = document.getElementById("ws-menucontext");
								if (selecionado !== null) {
									let caixa = selecionado.parentElement.parentElement;
									if ([38, 39, 40].indexOf(cod) > -1) setas(cod, selecionado, caixa, false);
									else if (!caixa.parentElement.isEqualNode(div)) {
										caixa.style.removeProperty("display");
										WS.menu.context.selected = caixa.parentElement.firstElementChild;
									}
								} else WS.menu.over(div.firstElementChild.firstElementChild.firstElementChild, false, WS.menu.context, false);
							} else if (cod == 13 && selecionado !== null) {
								if (selecionado.href) {
									WS.menu.context.close();
									eval(selecionado.href.replace("javascript:", ""));
								} else WS.menu.over(selecionado.nextElementSibling.firstElementChild.firstElementChild, false, WS.menu.context, false);
							} else if (cod == 27) {
								if (WS.menu.context.alt) that.alt("context", false);
								else WS.menu.context.close();
							} else if (cod == 18) that.alt("context", !WS.menu.context.alt);
						}
					} else if (WS.boxes.resources.getLast("active")) WS.boxes._control.keydown(e);
					else if (WS_menu_bar_json.length) {
						cod = altPressionado(true, cod);
						if ([13, 18, 27, 37, 38, 39, 40].indexOf(cod) > -1) {
							e.preventDefault();
							const raiz = WS.menu.bar.selectedRoot;
							const selecionado = WS.menu.bar.selected;
							if ([37, 38, 39, 40].indexOf(cod) > -1 && raiz !== null) {
								let mudaRoot = false;
								if (selecionado !== null) {
									let caixa = selecionado.parentElement.parentElement;
									if ([38, 39, 40].indexOf(cod) > -1) mudaRoot = setas(cod, selecionado, caixa, true);
									else if (!caixa.classList.contains("ws-menu-lvl-1")) {
										caixa.style.removeProperty("display");
										WS.menu.bar.selected = caixa.parentElement.firstElementChild;
									} else mudaRoot = true;
								} else if ([38, 40].indexOf(cod) > -1) {
									let lista = raiz.nextElementSibling.querySelectorAll("a");
									WS.menu.over(lista[cod == 38 ? lista.length - 1 : 0], false, WS.menu.bar, true);
								} else mudaRoot = true;
								if (mudaRoot && [37, 39].indexOf(cod) > -1) {
									const novo = encontrar(cod - 38, raiz.parentElement.parentElement.children, raiz, "span");
									WS.menu.bar.open(novo, false);
									WS.menu.over(novo.nextElementSibling.querySelector("a"), false, WS.menu.bar, true);
								}
							} else if (cod == 13) {
								if (selecionado !== null) {
									if (selecionado.href) {
										WS.menu.bar.close();
										that.alt("bar", false);
										eval(selecionado.href.replace("javascript:", ""));
									} else WS.menu.over(selecionado.nextElementSibling.firstElementChild.firstElementChild, false, WS.menu.bar, true);
								} else if (raiz !== null && (!WS.menu.bar.isOpen || fAlt)) {
									WS.menu.bar.open(raiz, true);
									WS.menu.over(raiz.nextElementSibling.querySelector("a"), false, WS.menu.bar, true);
								}
							} else if (cod == 18) {
								that.alt("bar", !WS.menu.bar.alt && !WS.menu.bar.isOpen);
								if (WS.menu.bar.alt) {
									WS.menu.bar.open(document.querySelector("#ws-menubar > ul > li > span"), false);
									WS.menu.over(document.querySelector("#ws-menubar .ws-menu-lvl-1 a"), false, WS.menu.bar, true);
								} else WS.menu.bar.close();
							} else if (cod == 27) {
								if (!WS.menu.bar.isOpen) {
									WS.menu.bar.close();
									that.alt("bar", false);
								} else WS.menu.bar.clear(false);
							}
						}
					}
				} else WS.keycombo.keydown(e);
			}
		}
		
		this.keyup = function(e) {
			WS.menu.bar.shortcuts.keyup(e);
			if (executaKC(e.keyCode)) WS.keycombo.keyup(e);
			WS.boxes._control.keyup(e);
		}
		
		this.resize = function() {
			WS.boxes._control.resize();
		}
	}
	
	const KeyCombo = function(arr) {
		let erro = arr === undefined ? "Os comandos não foram declarados" : "";	
		if (!erro) {
			if (arr.constructor !== Array) erro = "Os comandos foram declarados incorretamente";
		}
		if (!erro) {
			arr.forEach((command) => {
				if (!erro) {
					if (command.constructor !== Array) erro = "Um comando foi declarado incorretamente";
				}
				if (!erro) {
					if (command[0] === undefined) erro = "Um atalho não foi declarado";
				}
				if (!erro) {
					if (command[0].constructor !== Array) erro = "Um atalho foi declarado incorretamente";
				}
				if (!erro) {
					command[0].forEach((tecla) => {
						if (!erro) {
							if (typeof tecla != "number") erro = "Um código de tecla foi declarado incorretamente";
						}
						if (!erro) {
							if (parseInt(tecla) !== tecla) erro = tecla + " não é um inteiro válido";
						}
						if (!erro) {
							if (keyCodes[tecla] === undefined) erro = tecla + " não é um código de tecla válido";
						}
					});
				}
				if (!erro) {
					if (typeof command[1] != "function") erro = "Uma função foi declarada incorretamente";
				}
			});
		}
		if (!erro) {
			let atal = new Array();
			arr.forEach((command) => {
				if (atal.indexOf(command[0].join(",")) == -1) atal.push(command[0].join(","));
				else erro = "Há atalhos repetidos";
			});
		}
		if (erro) console.error(
			"WS.keycombo não pôde ser construído devido a uma falha no parâmetro.\n" +
			erro + "."
		);
		
		let pressionados = new Array();
		
		const prevent = function(e) {
			arr.forEach((command) => {
				command[0].forEach((tecla) => {
					if (tecla == e.keyCode && ["INPUT", "TEXTAREA"].indexOf(document.activeElement.tagName) == -1) e.preventDefault();
				});
			});
		}

		this.keyup = function(e) {
			if (!erro) {
				prevent(e);
				pressionados.splice(pressionados.indexOf(e.keyCode), 1);
			}
		}
		
		this.keydown = function(e) {
			let continua = true;
			if (!erro) {
				prevent(e);
				if (pressionados.indexOf(e.keyCode) == -1) pressionados.push(e.keyCode);
				arr.forEach((command) => {
					if (command[0].join(",") == pressionados.join(",")) {
						command[1]();
						continua = false;
						pressionados = new Array();
					}
				});
			}
			return continua;
		}
	}
	
	const Menu = function() {
		let shortcutList = new Array();
		
		let validar = function(obj, bar) {
			let erro = "";
			let aviso = "";
			let local = "";
			let altIndexArr = new Array();
			let elArr = new Array();
			try {
				var principal = clonar(obj);
			} catch(err) {}
			
			const main = function(arr, raiz) {
				if (!erro) {
					if (arr === undefined) {
						erro = "As informações foram declaradas incorretamente";
						local = "";
					}
				}
				if (!erro) {
					if (arr.constructor !== Array) {
						erro = "As informações foram declaradas incorretamente";
						local = "";
					}
				}
				if (!erro) {
					arr.forEach((el) => {
						if (!erro) {
							if (typeof el != "object") {
								erro = "Cada elemento deve ser um objeto";
								local = "";
							}
						}
						if (!erro) {
							if (el.label === undefined) {
								erro = "Há um elemento com título faltante";
								local = "";
							}
						}
						if (!erro) {
							if (typeof el.label != "string") {
								erro = "O texto de cada elemento deve do tipo string.\n" + el.label + " não reconhecido";
								local = "";
							}
						}
						if (!erro) {
							if (!el.label) {
								erro = "Há um elemento com título em branco";
								local = "";
							}
						}
						if (!erro) local = el.label;
						for (x in el) {
							let lista = ["label", "altIndex", "disabled", "fn", "children", "divider"];
							if (bar) lista.push("shortcut");
							else if (x == "shortcut") erro = 'O parâmetro "' + x + '" não pode ser declarado no menu contextual';
							if (!erro && lista.indexOf(x) == -1) aviso = 'Parâmetro "' + x + '" não conhecido';
						}
						if (!erro) {
							if (["undefined", "number"].indexOf(typeof el.altIndex) == -1) {
								erro = 'O parâmetro "altIndex", se declarado, deve ser do tipo number.\n' + el.altIndex + " não reconhecido";
							}
						}
						if (!erro) {
							if (!WS_properties["menu_" + (bar ? "bar" : "context") + "_alt"]) {
								if (typeof el.altIndex == "number") {
									if (parseInt(el.altIndex) != el.altIndex) {
										erro = 'O parâmetro "altIndex", se declarado, deve ser um inteiro.\n' + el.altIndex + " não reconhecido";
									}
									if (!erro) {
										if (el.altIndex + 1 > el.label.length) erro = "O índice da letra de atalho excede o limite " + el.label.length;
									}
									if (!erro) {
										let letra = el.label.substring(el.altIndex, el.altIndex + 1).toUpperCase();
										if (altIndexArr.indexOf(letra) > -1) {
											erro = 'Ocorreu um erro ao instanciar os atalhos na raiz.\nHá repetições no parâmetro "altIndex".\nLocais: "' +
												elArr[altIndexArr.indexOf(letra)] + '" e "' + el.label + '"';
											local = "";
										} else {
											altIndexArr.push(letra);
											elArr.push(el.label);
										}
									}
								}
							} else {
								let cont = 0;
								do {
									var letra = el.label.substring(cont, cont + 1).toUpperCase();
									cont++;
								} while (altIndexArr.indexOf(letra) > -1 && cont < el.label.length);
								altIndexArr.push(letra);
								el.altIndex = cont - 1;
								if (cont >= el.label.length) {
									erro = "Não foi possível incluir os atalhos automáticos";
									local = "";
								}
							}
						}
						if (!erro) {
							if (el.children === undefined && el.fn === undefined) erro = "Para cada elemento deve haver filhos ou uma função";
						}
						if (!erro) {
							if (el.children !== undefined && el.fn !== undefined) erro = "Um elemento não pode possuir filhos e uma função ao mesmo tempo";
						}
						if (!erro) {
							if (el.children !== undefined && el.shortcut !== undefined) erro = "Um elemento não pode possuir filhos e um atalho ao mesmo tempo";
						}
						if (!erro) {
							if (el.children !== undefined) {
								if (el.children.constructor !== Array) erro = "Os filhos devem seguir a mesma estrutura do pai";
							}
						}
						if (!erro) {
							if (el.fn !== undefined) {
								if (typeof el.fn != "function") erro = "Há um erro na função";
							}
						}
						if (!erro) {
							if (["undefined", "boolean"].indexOf(typeof el.divider) > -1) {
								if (el.divider !== undefined && raiz && bar) erro = 'O parâmetro "divider" não pode ser declarado em elementos na raiz da barra de menu';
							} else erro = 'O parâmetro "divider", se declarado, deve ser do tipo boolean';
						}
						if (!erro) {
							if (["undefined", "boolean"].indexOf(typeof el.disabled) == -1) {
								erro = 'O parâmetro "disabled", se declarado, deve ser do tipo boolean';
							}
						}
						if (!erro) {
							if (el.shortcut !== undefined) {
								if (el.shortcut.constructor !== Array) erro = 'O parâmetro "shortcut", se declarado, deve ser um Array';
								else if (el.fn === undefined) warnG = 'Há um atalho que não aponta para função alguma.\nLocal: "' + local + '"';
							}
						}
						if (!erro) {
							if (el.children !== undefined) main(el.children, false);
						}
					});
				}
			}
			
			if (principal !== undefined) {
				if (principal.constructor === Array) main(principal, true);
				else erro = "As informações foram declaradas incorretamente";
			} else erro = "As informações não foram declaradas";
			if (erro) {
				if (local) erro += '.\nLocal: "' + local + '"';
				console.error(
					"WS.menu." + (bar ? "bar" : "context") + " não pôde ser construído devido a uma falha no parâmetro.\n" +
					erro + "."
				);
			} else if (aviso) console.warn(aviso);
			return !erro ? principal : false;
		}
		
		let html = function(arr, nivel, left, bar, obj) {
			const tipo = bar ? "bar" : "context";
			let maior_label = 0;
			let maior_shortcut = 0;
			arr.forEach((item) => {
				if (item.label.length > maior_label) maior_label = item.label.length;
				if (item.shortcut) {
					let atalho = new Array();
					item.shortcut.forEach((cod) => {
						atalho.push(keyCodes[cod]);
					});
					if (!item.disabled) shortcutList.push([item.shortcut, item.fn]);
					let atalho_texto = atalho.join("+");
					if (atalho_texto.length > maior_shortcut) maior_shortcut = atalho_texto.length;
				}
			});
			const maior = maior_label + maior_shortcut;
			
			const largura = maior_shortcut ? parseInt(
				(0.0419753 * Math.pow(maior, 3)) -
				((371 / 135) * Math.pow(maior, 2)) +
				((2843 / 45) * maior) -
				325.0320988
			) : parseInt((5.0526316 * maior) + 70.6315789);
			let resultado = "<ul " +
				"class = 'ws-menubox ws-menu-lvl-" + nivel + "' " +
				"style = 'width:" + largura + "px;left:" + left + "px" + (!nivel ? ";display:block" : "") + "'" +
			">";
			left = largura;
			arr.forEach((item) => {
				let caret_ou_atalho = "";
				let filhos = "";
				let classes_arr = new Array();
				let atalho = new Array();
				if (item.children && !item.disabled) {
					caret_ou_atalho = "<td class = 'caret'></td>";
					filhos = html(item.children, nivel + 1, left, bar, obj);
					classes_arr.push("filhos");
				} else if (item.shortcut) {
					item.shortcut.forEach((cod) => {
						atalho.push(keyCodes[cod]);
					});
					caret_ou_atalho = "<td class = 'shortcut'>" + atalho.join("+") + "</td>";
				}
				if (item.disabled) classes_arr.push("disabled");
				else if (item.fn) obj.fnList.push(item.fn);
				let classes = classes_arr.join(" ");
				classes = " class = '" + classes + "'";
				if (item.divider) {
					resultado += "<li class = 'divider'>" +
						"<table>" +
							"<tr>" +
								"<td class = 'margin'>&nbsp;</td>" +
								"<td class = 'label'>" +
									"<hr />" +
								"</td>" +
							"</tr>" +
						"</table>" +
					"</li>";
				}
				resultado += "<li>" +
					"<a " +
						"onmousemove = 'WS.menu.over(this, true, WS.menu." + tipo + ", " + (bar ? "true" : "false") + ")'" +
						(!item.children && !item.disabled ? " href = 'javascript:WS.menu." + tipo + ".fnList[" + (obj.fnList.length - 1) + "]()'" : "") +
						classes +
					">" +
						"<table>" +
							"<tr>" +
								"<td class = 'margin'>&nbsp;</td>" +
								"<td class = 'label'>" +
									"<span" + (item.altIndex !== undefined ? " data-alt = 'charAt" + item.altIndex + "'" : "") + ">" + item.label + "</span>" +
								"</td>" +
								caret_ou_atalho +
							"</tr>" +
						"</table>" +
					"</a>" +
					filhos +
				"</li>";
			});
			resultado += "</ul>";
			return resultado;
		}
		
		const fechar = function(obj) {
			obj.isOpen = false;
			obj.selected = null;
			obj.alt = false;
			obj.altList = new Array();
		}
		
		const Bar = function() {
			let that = this;
			
			let obj = validar(WS_menu_bar_json, true);
			
			let criar = function() {
				let resultado = "<ul>";
				obj.forEach((item) => {
					resultado += "<li>" +
						"<span " +
							"onclick = 'WS.menu.bar.open(this, false)' " +
							"onmousemove = 'if(WS.menu.bar.isOpen&&!this.isEqualNode(WS.menu.bar.selectedRoot))WS.menu.bar.open(this, false)' " +
							(item.altIndex !== undefined ? " data-alt = 'charAt" + item.altIndex + "'" : "") +
						">" + item.label + "</span>" +
						(item.children ? html(item.children, 1, 0, true, that) : "")
					"</li>";
				});
				resultado += "</ul>";
				that.shortcuts = new KeyCombo(shortcutList);
				return resultado;
			}
			
			this.selectedRoot = null;
			this.selected = null;
			this.isOpen = false;
			this.alt = false;
			this.altList = new Array();
			this.fnList = new Array();
			
			this.clear = function(deactivate) {
				Array.from(document.querySelectorAll("#ws-menubar .ws-menubox")).forEach((el) => {
					el.style.removeProperty("display");
				});
				Array.from(document.querySelectorAll("#ws-menubar a")).forEach((aux) => {
					aux.classList.remove("hover");
				});
				that.selected = null;
				that.isOpen = false;
				if (deactivate) {
					Array.from(document.querySelectorAll("#ws-menubar > ul > li > span")).forEach((el) => {
						el.classList.remove("active");
					});
				}
			}
			
			this.close = function() {
				fechar(that);
				that.selectedRoot = null;
				that.clear(true);
			}
			
			this.open = function(el, ignorar) {
				if (!el.classList.contains("active") || ignorar) {
					that.clear(true);
					el.classList.add("active");
					that.selectedRoot = el;
					let caixa = el.nextElementSibling;
					if (caixa !== null) {
						let estilo = el.nextElementSibling.style;
						estilo.display = "block";
                        estilo.zIndex = WS.boxes.resources.zIndex() + 1;
						setTimeout(function() {
							that.isOpen = true;
						}, 400);
					}
				} else that.close();
			}
			
			this.change = function(index, enabled) {
				let erro = "";
				let el = document.getElementById("ws-menubar");
				if (el === null) erro = "A barra de menu não existe";
				if (!erro && index === undefined) erro = "O índice não foi definido";
				if (!erro) {
					if (index.constructor !== Array) erro = "O índice deve ser um Array";
				}
				if (!erro) {
					index.forEach((el) => {
						if (!erro) {
							if (typeof el !== "number") erro = "Cada elemento do índice deve ser um número";
						}
						if (!erro) {
							if (el !== parseInt(el)) erro = "Cada elemento do índice deve ser um inteiro";
						}
					});
				}
				if (!erro) {
					if (["undefined", "boolean"].indexOf(typeof enabled) == -1) erro = 'O parâmetro "enabled", se declarado, deve ser do tipo boolean';
				}
				if (!erro) {
					var itemAtual = obj;
					let ate = "";
					for (let i = 0; i < index.length - 1; i++) {
						if (ate) ate += ",";
						ate += index[i];
						if (!erro) {
							if (itemAtual[index[i] - 1].children !== undefined) itemAtual = itemAtual[index[i] - 1].children;
							else erro = "O índice [" + ate + "] é inválido";
						}
					}
				}
				if (!erro) {
					if (itemAtual[index[index.length - 1] - 1] !== undefined) {
						itemAtual[index[index.length - 1] - 1].disabled = enabled !== undefined ? !enabled : !itemAtual[index[index.length - 1] - 1].disabled;
					} else erro = "O índice [" + index.join(",") + "] é inválido";
				}
				if (!erro) {	
					shortcutList = new Array();
					that.selectedRoot = null;
					that.selected = null;
					that.isOpen = false;
					that.alt = false;
					that.altList = new Array();
					that.fnList = new Array();
					el.innerHTML = criar();
				} else console.error(erro);
			}
			
			if (typeof obj == "object") {
				let alturaAll = window.innerHeight;
				document.body.innerHTML = "<div id = 'ws-menubar' class = 'ws ws-menu'>" + criar() + "</div>" +
					"<div id = 'ws-menubar-cover' class = 'ws-menu'></div>" +
					"<div id = 'ws-all'>" + document.body.innerHTML + "</div>";
				let estilo = document.getElementById("ws-all").style;
				if (obj.length) {
					document.getElementById("ws-menubar").style.display = "block";
					alturaAll -= 27;
				} else estilo.margin = "0px";
				estilo.height = alturaAll + "px";
			}
		}
		
		const Context = function() {
			let that = this;
			
			this.close = function() {
				fechar(that);
				document.getElementById("ws-menucontext").innerHTML = "";
			}

			this.create = function(triggers, obj, except, container) {
				obj = validar(obj, false);
				if (typeof obj == "object") {
					let lista = "*";
					if (except !== undefined) except = "";
					if (except) lista += ":not(" + except + ")";
					Array.from(document.querySelectorAll(lista)).forEach((el) => {
						el.oncontextmenu = function() {}
					});
					Array.from(triggers).forEach((el) => {
						el.oncontextmenu = function(e) {
                            try {
                                if (WS.menu.bar.isOpen) {
                                    WS.menu.bar.close();
                                    WS._control.alt("bar", false);
                                }
                            } catch(err) {}
							e.preventDefault();
							let caixa = document.getElementById("ws-menucontext");
							let estilo = caixa.style;
							caixa.innerHTML = html(obj, 0, 0, false, that);
							const aux = caixa.firstElementChild;
							let top = e.clientY + 24;
							let left = e.clientX;
							const altura = aux.offsetHeight;
							const largura = aux.offsetWidth;
							if ((top + altura) > (container !== undefined ? container.offsetHeight : window.innerHeight)) top -= altura;
							if ((left + largura) > (container !== undefined ? container.offsetWidth : window.innerWidth)) left -= largura;
							estilo.top = top + "px";
							estilo.left = left + "px";
							estilo.display = "block";
							that.isOpen = true;
							const zIndex = WS.boxes.resources.zIndex();
							if (zIndex) estilo.zIndex = zIndex;
						}
					});
				}
			}
			
			this.selected = null;
			this.isOpen = false;
			this.alt = false;
			this.altList = new Array();
			this.fnList = new Array();
			
			document.body.innerHTML += "<div id = 'ws-menucontext' class = 'ws ws-menu'></div>";
		}
		
		this.over = function(el, mouse, obj, bar) {
			Array.from(document.querySelectorAll(".ws-menu ul")).forEach((aux) => {
				aux.style.removeProperty("display");
                aux.style.removeProperty("z-index");
			});
			Array.from(document.querySelectorAll(".ws-menu a")).forEach((aux) => {
				aux.classList.remove("hover");
			});
			obj.selected = el;
			if (mouse && el.classList.contains("filhos")) el.parentElement.querySelector("ul").style.display = "block";
			let parar = false;
			do {
				el = el.parentElement;
				if (el.classList.contains("ws-menu")) parar = true;
				if (!parar) {
					switch(el.tagName) {
                        case "UL":
							el.style.display = "block";
                            el.style.zIndex = WS.boxes.resources.zIndex() + 1;
							break;
						case "LI":
							el.querySelector("a").classList.add("hover");
							break;
					}
				}
			} while (!parar);
			if (bar) {
				for (let i = 1; document.getElementsByClassName("ws-menu-lvl-" + i).length; i++) {
					let lista = document.querySelectorAll(".ws-menu-lvl-" + i + " > li > a.hover");
					if (lista.length > 1) lista[0].classList.remove("hover");
				}
			}
		}
		
		this.bar = new Bar();
		this.context = new Context();
	}
	
	const Boxes = function() {
		const Create = function() {
			const that2 = this;

			let validarPadrao = function(val, max) {
				if (val === undefined) val = 0;
				if (typeof val != "number") {
					console.error('O parâmetro "padrao", se declarado, deve ser um número');
					return 0;
				}
				if (parseInt(val) != val) {
					console.error('O parâmetro "padrao", se declarado, deve ser um inteiro');
					return 0;
				}
				if (val < 0 || val > max) {
					console.error('O botão indicado por ' + val + ' não existe');
					return 0;
				}
				return val;
			}

			this.main = function(obj) {
				criando = true;
				return new Box(obj);
			}

			this.alert = function(_content, _title, callback) {
				let erro = false;
				if (callback === undefined) callback = function(param) {};
				else if (!validarParam("callback", callback, "function", true, false, true)) erro = true;
				if (_title === undefined) _title = "Aviso";
				else if (!validarParam("_title", _title, "string", true, false, false)) erro = true;
				else if (!_title) _title = "Aviso";
				let btn = that.resources.standardButton();
				if (!erro) {
					btn.fn = function() {
						that.maintance.close();
					};
					return that2.main({
						id : "alert",
						content : {
							head : {
								title : _title,
								buttons : {
									maximize : false,
									close : function() {
										callback();
									}
								}
							},
							body : "<p>" + _content + "</p>",
							standardButton : 0,
							buttons : [
								{
									"Ok" : btn
								}
							]
						},
						style : {
							maximize : false
						},
						config : {
							close : {
								mouse    : false,
								keyboard : true
							}
						}
					});
				}
				return false;
			}

			this.confirm = function(_content, _title, cancel, callback, standard) {
				if (
					validarParam("callback", callback, "function", false, false, true) &&
					validarParam("cancel",   cancel,   "boolean",  false, false, true) &&
					validarParam("_title",   _title,   "string",   false, false, false) &&
					validarParam("_content", _content, "string",   false, false, true)
				) {
					if (!_title) _title = "Confirmar";
					let btnSim = that.resources.standardButton();
					let btnCancela = clonar(btnSim);
					btnSim.altIndex = 0;
					let btnNao = clonar(btnSim);
					btnSim.fn = function() {
						callback(salvarPorValor({
							confirma : 1
						}).confirma);
						that.maintance.close(WS_doNotCallback);
					};
					btnNao.fn = function() {
						callback(salvarPorValor({
							confirma : 0
						}).confirma);
						that.maintance.close(WS_doNotCallback);
					};
					btnCancela.fn = function() {
						callback(salvarPorValor({
							confirma : -1
						}).confirma);
						that.maintance.close(WS_doNotCallback);
					};
					let _botoes = [
						{
							"Sim" : btnSim
						}, {
							"Não" : btnNao
						}
					];
					if (cancel) {
						_botoes.push({
							"Cancelar" : btnCancela
						});
					}
					return that2.main({
						id : "confirm",
						content : {
							head : {
								title : _title,
								buttons : {
									maximize : false,
									close : cancel ? function() {
										callback(salvarPorValor({
											confirma : -1
										}).confirma);
									} : -1
								}
							},
							body : "<p>" + _content + "</p>",
							buttons : _botoes,
							standardButton : validarPadrao(standard, cancel ? 2 : 1)
						},
						style : {
							maximize : false
						},
						config : {
							close : {
								mouse    : false,
								keyboard : cancel
							}
						}
					});
				}
				return false;
			}

			this.prompt = function(_content, placeholder, _title, cancel, validate, callback, standard) {
				if (
					validarParam("callback",    callback,    "function", false, false, true) &&
					validarParam("validate",    validate,    "function", false, false, true) &&
					validarParam("cancel",      cancel,      "boolean",  false, false, true) &&
					validarParam("_title",      _title,      "string",   false, false, false) &&
					validarParam("placeholder", placeholder, "string",   false, false, false) &&
					validarParam("_content",    _content,    "string",   false, false, true)
				) {
					if (!_title) _title = "Inserindo dados";
					let btn = that.resources.standardButton();
					let cancela = clonar(btn);
					cancela.fn = function() {
						that.maintance.close();
					};
					btn.fn = function() {
						controle_prompt = that.resources.getLast("active");
						let valor = document.querySelector("#" + controle_prompt + " #prompt").value;
						let erro = validate(valor);
						if (typeof erro == "string") {
							that.maintance.close();
							if (erro) {
								if (controle_alerta === null) {
									controle_alerta = that2.alert(erro, "", function() {
										setTimeout(function() {
											that.maintance.reopen(controle_prompt);
											controle_prompt = null;
										}, 0);
									});
								} else controle_alerta.set.reopen();
							} else {
								callback(salvarPorValor({
									prompt : valor
								}).prompt);
								controle_prompt = null;
								controle_alerta = null;
							}
						} else console.error("A função de validação deve retornar uma string");
					};
					let _botoes = [
						{
							"Ok" : btn
						}
					];
					if (cancel) {
						_botoes.push({
							"Cancelar" : cancela
						});
					}
					return that2.main({
						id : "prompt",
						content : {
							head : {
								title : _title,
								buttons : {
									maximize : false,
									close : cancel ? function() { } : -1
								}
							},
							body : "<p>" + _content + "</p>" +
								"<input type = 'text' id = 'prompt' style = 'width:100%;margin-bottom:10px' value = '" + placeholder + "' />",
							buttons : _botoes,
							standardButton : validarPadrao(standard, cancel ? 1 : 0)
						},
						style : {
							maximize : false
						},
						config : {
							close : {
								mouse    : false,
								keyboard : cancel
							}
						}
					});
				}
				return false;
			}
		}

		const Change = function() {
			this.edit = function(id, obj) {
				if (validarParam("obj", obj, "object", false, false, false) && validarJanela(id, "editar", false, true)) {
					if (obj.style === undefined) {
						bloquear_visibilidade = true;
						setTimeout(function() {
							bloquear_visibilidade = false;
						}, 400);
					}
					criando = false;
					let main = validarJSON(obj, lista_global[id].objeto);
					let el = document.getElementById(id);
					let ref = lista_global[id];
					if (histGrava) {
						if (histEdit[id] === undefined) histEdit[id] = new Array();
						histEdit[id].push(clonar(ref.objeto));
					}
					ref.objeto  = clonar(main);
					ref.btnTopo = 0;
					if (main.style.white) el.classList.add("is-bright");
					else el.classList.remove("is-bright");
					if (typeof obj.content == "object") {
						const ref2 = obj.content;
						if (typeof ref2.head == "object") {
							if (typeof ref2.head.title == "string") document.querySelector("#" + id + " .title-bar-text").innerHTML = main.content.head.title;
						}
						if (typeof ref2.body    == "string") document.getElementById(id + "-body").innerHTML = main.content.body;
						if (typeof ref2.buttons == "object") document.querySelector("#" + id + " footer").innerHTML = botoesHTML(main.content.buttons, id);
					}
					let ref2 = main.content.head.buttons;
					document.getElementById(id + "-maxmin").style.display = !ref2.maximize ? "none" : "";
					document.getElementById(id + "-close").style.display = (typeof ref2.close != "function") ? "none" : "";
					if (ref2.maximize) ref.btnTopo++;
					if (typeof ref2.close == "function") ref.btnTopo++;
					let posiciona = false;
					if (typeof obj.style == "object") {
						posiciona = ["object", "string"].indexOf(typeof obj.style.position) > -1 || (typeof obj.style.dimensions == "object");
					}
					cria_e_altera(main, id, posiciona);
					ativarClasse(that.resources.getLast("active"));
				}
			}

			this.clearEdits = function(id, how_many) {
				if (validarJanela(id, "limpar as edições de", false, true)) {
					try {
						let num = how_many !== undefined ? histEdit[id].length - how_many : 0;
						if (histEdit[id][num] !== undefined) {
							histGrava = false;
							that.change.edit(id, histEdit[id][num]);
							let aux = new Array();
							for (let i = 0; i < num; i++) aux.push(histEdit[id][i]);
							histEdit[id] = aux;
							setTimeout(function() {
								histGrava = true;
							}, 0);
						} else {
							console.error(how_many === undefined ?
								'Não houveram edições feitas nesssa janela'
							:
								'O número não corresponde a uma quantidade de edições válida'
							);
						}
					} catch(err) {
						console.error('Não houveram edições feitas nessa janela');
					}
				}
			}

			this.alterButtonState = function(id, btn, activate) {
				if (validarJanela(id, "manipular o botão de uma", false, true)) {
					try {
						const conteudo = lista_global[id].objeto.content;
						let botoes = conteudo.buttons;
						let indice = [0, ""];
						switch(typeof btn) {
							case "string":
								indice[1] = btn;
								botoes.forEach((botao) => {
									for (x in botao) {
										if (x == btn) indice[0] = i;
									}
								});
								break;
							case "number":
								indice = [btn, obterBotao(botoes[btn]).nome];
								break;
						}
						if (conteudo.standardButton != indice[0]) {
							let erro  = true;
							let botao = botoes[indice[0]][indice[1]];
							if (activate === undefined) {
								erro = false;
								activate = !botao.active;
							} else if (validarParam("activate", activate, "boolean", false, false, false)) erro = false;
							if (!erro) {
								if (botao.active != activate) {
									let lista = document.querySelectorAll("#" + id + " footer button");
									botao.active = activate;
									lista[indice[0]].disabled = !activate;
								} else console.warn("O botão já estava " + (!activate ? "in" : "") + "ativo");
								if (!activate) limparBotao();
							}
						} else console.error("Não é possível manipular o botão padrão de uma janela.");
					} catch(err) {
						console.error("O botão indicado não existe");
					}
				}
			}
		}

		const Maintance = function() {
			this.maxmin = function(id, maximize) {
				if (validarJanela(id, "maximizar ou restaurar", true, true)) {
					if (typeof id == "number") id = idFromPos(id);
					let erro = false;
					if (maximize !== undefined) erro = !validarParam("maximize", maximize, "boolean", true, false, true);
					if (that.resources.getLast("active") == id && !erro) {
						const ref    = lista_global[id];
						const ref2   = ref.objeto.config;
						const estilo = document.getElementById("ws-box-style");
						let el    = document.getElementById(id);
						let style = el.style;
						if (ref.objeto.content.head.buttons.maximize) {
							var btn         = document.getElementById(id + "-maxmin");
							var maximizado2 = btn.getAttribute("aria-label") != "Maximize";
						} else {
							var btn         = null;
							var maximizado2 = full.indexOf(id) > -1;
						}
						if (maximize === undefined) maximize = maximizado2;
						["top", "left", "width", "height"].forEach((propriedade) => {
							style.removeProperty(propriedade);
						});
						if (maximize) {
							if (btn !== null) btn.setAttribute("aria-label", "Maximize");
							full.splice(full.indexOf(id), 1);
							if (ref2.move) el.classList.add("draggable");
							estilo.innerHTML += "#" + id + "{" +
								"width  : " + ref.dimensions[0] + "px;" +
								"height : " + ref.dimensions[1] + "px" +
							"}";
							permissaoMouse = false;
							setTimeout(function() {
								permissaoMouse = true;
							}, 100);
						} else {
							const pai = elPai();
							const dim = dimensoes();
							estilo.innerHTML += "#" + id + "{" +
								"top    : 50%;" +
								"left   : 50%;" +
								"width  : " + Math.min(pai.width, dim.width) + "px;" +
								"height : " + Math.min(pai.height, dim.height) + "px" +
							"}";
							if (btn !== null) btn.setAttribute("aria-label", "Restore");
							if (ref2.move) el.classList.remove("draggable");
							full.push(id);
						}
						setTimeout(function() {
							redimensionar(id, false);
						}, 100);
					}
				}
			}

			this.close = function(id) {
				const callback = id !== WS_doNotCallback;
				id = callback ? idOuUltimo(id) : idOuUltimo();
				if (id == that.resources.getLast("active") && permissaoMouse) {
					fecharMain(id);
					ativarBotaoPadraoUltimo(true);
					permissaoMouse = false;
					setTimeout(function() {
						permissaoMouse = true;
						if (callback) {
							const fn = lista_global[id].objeto.content.head.buttons.close;
							if (typeof fn == "function") fn();
						}
					}, 100);
				}
				if (!that.resources.getLast("open")) {
					Array.from(document.querySelectorAll("button")).forEach((el) => {
						el.disabled = false;
					});
					document.getElementById("ws-menubar-cover").style.removeProperty("display");
				} else ativarClasse(that.resources.getLast("open"));
			}

			this.reopen = function(id) {
				try {
					if (typeof id == "object") id = id.id;
					id = idOuUltimo(id);
					if (validarJanela(id, "reabrir", false, false)) {
						document.getElementById(id).style.display = "block";
						lista_global[id].aberto = true;
						ativar(id);
					}
				} catch(err) {}
			}

			this.activate = function(id) {
				if (validarJanela(id, "ativar", false, true)) {
					ativar(id);
					if (id != that.resources.getLast("active")) {
						setTimeout(function() {
							limparBotao();
						}, 50);
						setTimeout(function() {
							ativarBotaoPadraoUltimo(false);
						}, 100);
					}
				}
			}
			
			this.resetButtons = function() {
				impedir_selecao = true;
				limparBotao();
				setTimeout(function() {
					impedir_selecao = false;
				}, 400);
			}
		}

		const Resources = function() {
			this.standardButton = function() {
				return obterBotao(clonar(WS_properties.boxes.standard.content.buttons[0])).objeto;
			}

			this.getLast = function(type) {
				let id = "";
				if (["active", "open"].indexOf(type) > -1) {
					for (x in lista_global) {
						if (lista_global[x][type.replace("active", "ativo").replace("open", "aberto")]) id = x;
					}
				} else console.error('"type" deve ser "active" ou "open"');
				return id;
			}

			this.zIndex = function(id) {
				let retorno = -1;
				if (id === undefined) {
					for (x in lista_global) {
						if (lista_global[x].zIndex > retorno) retorno = lista_global[x].zIndex;
					}
				} else if (validarJanela(id, "conhecer informações de", false, false)) retorno = lista_global[id].zIndex;
				return retorno == -1 ? false : retorno;
			}

			this.maxmin = function(id) {
				validarJanela(id, "conhecer informações de", false, false);
				return full.indexOf(idOuUltimo(id)) > -1;
			}
		}

		const Control = function() {
			let trocaAlt = function() {
				let retorno = false;
				limparBotao();
				if (!that.alt) {
					const _padrao = lista_global[that.resources.getLast("active")].objeto.content.standardButton;
					const botoes = sublinhaBotao();
					if (botoes.indexOf(_padrao) > -1) selecionaBotao(_padrao, true);
					else if (botoes.length) selecionaBotao(botoes[botoes.length - 1], true);
				} else retorno = true;
				that.alt = !that.alt;
				return retorno;
			}

			this.click = function(e) {
				let retorno = true;
				const ultimoAtivo = that.resources.getLast("active");
				if (WS_properties.boxes.mult) {
                    retorno = false;
					let abertos = new Array();
					for (x in lista_global) {
						if (lista_global[x].aberto) abertos.push(x);
					}
					abertos.forEach((jan) => {
						if (document.getElementById(jan).contains(e.target)) ativar(jan);
					});
				}
				if (retorno) {
					const el = document.getElementById(ultimoAtivo);
					if (el !== null) retorno = chamaFechar(!el.contains(e.target), "mouse");
				}
				return retorno;
			}

			this.keyup = function(e) {
				if (e.keyCode == 27) {
					if (that.alt) {
						trocaAlt();
						return true;
					}
					return chamaFechar(true, "keyboard");
				}
				return false;
			}

			this.keydown = function(e) {
				let cond = !that.resources.getLast("open");
				if (!cond) {
					const ultimoAtivo = that.resources.getLast("active");
					let lUltimoAtivo = lista_global[ultimoAtivo];
					if ([18, 37, 39].indexOf(e.keyCode) > -1) {
						if (e.keyCode == 18 || lUltimoAtivo.sel > -1) e.preventDefault();
						const conteudo = lUltimoAtivo.objeto.content;
						if ([37, 39].indexOf(e.keyCode) > -1 && lUltimoAtivo.sel > -1) {
							const botoes = conteudo.buttons;
							let ativos = new Array();
							for (let i = 0; i < botoes.length; i++) {
								if (obterBotao(botoes[i]).objeto.active) ativos.push(i);
							}
							let aux = ativos.indexOf(lUltimoAtivo.sel) + e.keyCode - 38;
							if (aux < 0) aux = ativos.length - 1;
							else if (aux > ativos.length - 1) aux = 0;
							let indice = ativos[aux];
							if (indice < ativos[0]) indice = ativos[ativos.length - 1];
							else if (indice > ativos[ativos.length - 1]) indice = ativos[0];
							limparBotao();
							selecionaBotao(indice, false);
							if (that.alt) sublinhaBotao();
						} else if (e.keyCode == 18) {
							if (trocaAlt()) botaoTecla = new Array();
						}
					} else if (e.keyCode == 13 && lUltimoAtivo.sel > -1 && lUltimoAtivo.objeto.content.buttons.length) {
						document.getElementById(ultimoAtivo + "_btn" + lUltimoAtivo.sel).onclick();
					} else if (botaoTecla[e.keyCode] !== undefined) botaoTecla[e.keyCode]();
				}
				return cond;
			}

			this.resize = function() {
				const pai = elPai();
				const dim = dimensoes();
				for (x in lista_global) {
					let ref = lista_global[x].dataEstilo;
					let el  = document.getElementById(x);
					if (full.indexOf(x) > -1) {
						el.style.opacity = "0";
						that.maintance.maxmin(x);
						setTimeout(function() {
							that.maintance.maxmin(x);
						}, 300);
						setTimeout(function() {
							el.style.removeProperty("opacity");
						}, 500);
					} else document.querySelector("#" + x + " .title-bar-text").style.removeProperty("margin-right");
					if (ref.length) posicionar(x, document.getElementById("ws-box-mov-" + x), ref[1] * 10, ref[0] * 10, el.offsetHeight, el.offsetWidth);
				}
				let alturaAll = window.innerHeight;
				if (WS_menu_bar_json.length) alturaAll -= 27;
				document.getElementById("ws-all").style.height = alturaAll + "px";
			}

			this.exec = function(index, index2) {
				const id = idFromPos(index);
				if (that.resources.getLast("active") == id) {
					const botao = obterBotao(lista_global[id].objeto.content.buttons[index2]).objeto;
					if (botao.active) botao.fn();
				}
			}
		}

		let offsetX, offsetY;

		let that                  = this;
		let full                  = new Array();
		let botaoTecla            = new Array();
		let histEdit              = new Array();
		let lista_global          = new Array();
		let histGrava             = true;
		let permissaoMouse        = true;
		let avisoPai              = false;
		let bloquear_visibilidade = false;
		let impedir_selecao       = false;
		let criando               = false;
		let el_ultimoAtivo        = null;

		let controle_alerta    = null;
		let controle_prompt    = null;
		let controle_indices   = new Array();
		let controle_respostas = new Array();

		this.alt       = false;
		this.list      = new Array();
		this.create    = new Create();
		this.change    = new Change();
		this.resources = new Resources();
		this.maintance = new Maintance();
		this._control  = new Control();

		setTimeout(function() {
			elCorpo().innerHTML += "<style type = 'text/css' id = 'ws-box-style'>" +
				".ws-box {" +
					"position: fixed;" +
					"transform: translate(-50%, -50%);" +
					"width: max-content" +
				"}" +
			"</style>";
			document.getElementById("ws-all").addEventListener("scroll", fechaQuandoPaiInvisivel);
		}, 0);

		let elCorpo = function() {
			return document.getElementById("ws-all");
		}

		let elPai = function() {
			let tudo = document.getElementById("ws-all");
			let pai = document.getElementById(WS_properties.boxes.container);
			if (!avisoPai && WS_properties.boxes.container != "" && pai === null) {
				console.warn(
					'O elemento "' + WS_properties.boxes.container + '" não pôde ser configurado em WS_properties.boxes.container pois ele não existe\n' +
					"As janelas serão criadas de forma livre"
				);
				avisoPai = true;
			}
			if (pai !== null) {
				pai = pai.getBoundingClientRect();
				tudo = tudo.getBoundingClientRect();
				var resultado = {
					top    : Math.max(pai.top,    tudo.top),
					left   : Math.max(pai.left,   tudo.left),
					height : Math.min(pai.height, tudo.height),
					width  : Math.min(pai.width,  tudo.width)
				};
			} else {
				const rect = tudo.getBoundingClientRect();
				var resultado = {
					top    : rect.top,
					left   : rect.left,
					height : rect.height,
					width  : rect.width
				};
			}
			return resultado;
		}

		let chamaFechar = function(cond, tipo) {
			const ultimoAtivo = that.resources.getLast("active");
			if (ultimoAtivo && cond) {
				if (lista_global[ultimoAtivo].objeto.config.close[tipo]) that.maintance.close();
				else animar();
			}
			return !that.resources.getLast("open");
		}

		let idFromPos = function(pos) {
			let id;
			for (x in controle_indices) {
				if (controle_indices[x] == pos) {
					id = x;
					break;
				}
			}
			return id;
		}

		let idOuUltimo = function(id) {
			const orig = id;
			if (id !== undefined) {
				if (typeof id == "number") id = idFromPos(id);
			} else id = that.resources.getLast("active");
			const aberto = that.resources.getLast("open");
			if (!id) id = aberto;
			if (!id && aberto) {
				if (orig === undefined) console.error('É necessário informar um id');
				else console.error('A janela "' + orig + '" não existe');
				return false;
			} else return id;
		}

		let validarParam = function(nome, obj, tipo, permiteUndefined, chave, permiteTags) {
			if (tipo.constructor !== Array) tipo = [tipo];
			let ret = tipo.indexOf(typeof obj) > -1;
			if (permiteUndefined) ret = ret || obj === undefined;
			let tipos = "";
			for (let i = 0; i < tipo.length; i++) {
				tipos += tipo[i];
				if (i < tipo.length - 1) tipos += (i < tipo.length - 2) ? ", " : " ou ";
			}
			let msg = !chave ? 'O parâmetro "' : 'A chave "';
			msg += nome + '"';
			if (permiteUndefined) {
				msg += ", se definid";
				msg += chave ? "a" : "o";
				msg += ",";
			}
			msg += " deve ser ";
			if (ret) {
				if (typeof obj == "string" && !permiteTags) {
					if (obj.indexOf("<") > -1 && obj.indexOf(">") > -1) {
						ret = false;
						msg += "do tipo " + tipos + " e não possuir tags HTML";
						console.error(msg);
					}
				} else if (typeof obj == "number") {
					if (parseInt(obj) == obj) {
						if (nome.indexOf("altura") > -1 || nome.indexOf("largura") > -1) {
							if (obj && obj < 150) {
								ret = false;
								msg += "um inteiro igual a 0 ou maior ou igual 150";
								console.error(msg);
							}
						}
					} else {
						ret = false;
						msg += "um inteiro";
						console.error(msg);
					}
				}
			} else {
				msg += "do tipo " + tipos;
				console.error(msg);
			}
			return ret && obj !== undefined;
		}

		let validarJanela = function(id, objetivo, numero, aberto) {
			let retorno = false;
			if (id !== undefined) {
				if (numero && typeof id == "number") id = idFromPos(id);
				if (typeof id == "string") {
					if (lista_global[id] !== undefined) {
						if (aberto) {
							if (lista_global[id].aberto) retorno = true;
							else if (paiInvisivel()) console.error("As janelas não podem ser construídas se o elemento pai não estiver visível");
							else console.error("Não é possível " + objetivo + " uma janela que não está aberta");
						} else retorno = true;
					} else console.error('A janela "' + id + '" não existe');
				} else console.error('O parâmetro "id" deve ser do tipo string');
			} else console.error('O parâmetro "id" não foi definido');
			return retorno;
		}

		let dimensoes = function() {
			return {
				height : Math.min(elCorpo().offsetHeight, window.innerHeight),
				width  : Math.min(elCorpo().offsetWidth,  window.innerWidth)
			};
		}

		let paiInvisivel = function() {
			const pai = elPai();
			return ((pai.top > dimensoes().height) || ((pai.top + pai.height) < 0));
		}

		let obterBotao = function(obj) {
			for (x in obj) {
				var botao = {
					nome   : x,
					objeto : obj[x]
				};
			}
			return botao;
		}

		let sublinhaBotao = function() {
			const ultimoAtivo = that.resources.getLast("active");
			const todos = lista_global[ultimoAtivo].objeto.content.buttons;
			let indices = new Array();
			let letras = new Array();
			for (let i = 0; i < todos.length; i++) {
				let obj = obterBotao(todos[i]).objeto;
				if (obj.altIndex > -1 && obj.active) {
					indices.push(i);
					letras.push(obj.altIndex);
				}
			}
			for (let i = 0; i < indices.length; i++) {
				let el = document.getElementById(ultimoAtivo + "_btn" + indices[i]);
				let letra = el.innerHTML.substring(letras[i], letras[i] + 1);
				botaoTecla[65 + "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(letra.toUpperCase())] = el.onclick;
				let texto = el.innerHTML.substring(0, letras[i]) +
					"<span style = 'text-decoration:underline'>" + letra + "</span>" +
					el.innerHTML.substring(letras[i] + 1);
				el.innerHTML = texto;
			}
			return indices;
		}

		let validarJSON = function(obj, ant) {
			let ref = obj;
			let sref = "obj";
			let main = ant === undefined ? clonar(WS_properties.boxes.standard) : clonar(ant);
			if (validarParam(sref + ".content", ref.content, "object", true, true, true)) {
				ref = ref.content;
				sref += ".content";
				if (validarParam(sref + ".head", ref.head, "object", true, true, true)) {
					ref = ref.head;
					sref += ".head";
					if (validarParam(sref + ".title", ref.title, "string", true, true, false)) main.content.head.title = ref.title;
					if (validarParam(sref + ".buttons", ref.buttons, "object", true, true, true)) {
						ref = ref.buttons;
						sref += ".buttons";
						if (validarParam(sref + ".maximize", ref.maximize, "boolean", true, true, true)) main.content.head.buttons.maximize = ref.maximize;
						if (ref.close !== undefined) main.content.head.buttons.close = ref.close;
					}
				}
				ref = obj.content;
				sref = "obj.content";
				if (validarParam(sref + ".body", ref.body, "string", true, true, true)) main.content.body = ref.body;
				if (obj.content.buttons !== undefined) {
					let erro = false;
					if (obj.content.buttons.constructor === Array) {
						obj.content.buttons.forEach((botao) => {
							if (typeof botao == "object" && !erro) {
								let ref2 = obterBotao(botao).objeto;
								if (typeof ref2 == "object" && !erro) {
									if (
										typeof ref2.fn != "function" ||
										typeof ref2.altIndex  != "number"   ||
										typeof ref2.active  != "boolean"  ||
										typeof ref2.descr  != "string"
									) erro = true;
									else if (
										parseInt(ref2.altIndex) != ref2.altIndex ||
										(ref2.descr.indexOf("<") > -1 && ref2.descr.indexOf(">") > -1)
									) erro = true;
									else if (ref2.altIndex < -1 || ref2.altIndex > obterBotao(botao).nome.length) erro = true;
								} else erro = true;
							} else erro = true;
						});
					} else erro = true;
					if (!erro) {
						main.content.buttons = obj.content.buttons;
						if (validarParam(sref + ".standardButton", ref.standardButton, "number", true, true, true)) {
							if (ref.standardButton >= -1 && ref.standardButton < main.content.buttons.length) main.content.standardButton = ref.standardButton;
							else console.error(
								'A chave "' + sref + '.standardButton", se definida, deve ser um inteiro entre -1 e a quantidade de botoes - 1'
							);
						}
					} else console.error("Ocorreu um erro na construção dos botões dessa janela");
				}
			}
			if (validarParam("obj.style", obj.style, "object", true, true, true)) {
				ref = obj.style;
				sref = "obj.style";
				if (validarParam(sref + ".maximize",   ref.maximize, "boolean", true, true, true)) main.style.maximize = ref.maximize;
				if (validarParam(sref + ".white",      ref.white,    "boolean", true, true, true)) main.style.white    = ref.white;
				if (validarParam(sref + ".dimensions", ref.dimensions, "object",  true, true, true)) {
					ref = ref.dimensions;
					sref += ".dimensions";
					if (validarParam(sref + ".height", ref.height, "number", true, true, true)) main.style.dimensions.height  = ref.height;
					if (validarParam(sref + ".width",  ref.width,  "number", true, true, true)) main.style.dimensions.width = ref.width;
				}
				ref = obj.style;
				if (validarParam(sref + ".position", ref.position, ["string", "object"], true, true, false)) {
					if (ref.position !== undefined) {
						sref += ".position";
						if (typeof ref.position == "object") {
							ref = ref.position;
							if (ref.horizontal !== undefined) {
								if (["left", "center", "right"].indexOf(ref.horizontal) > -1) var horizontal = ref.horizontal;
								else console.error(
									'A chave "' + sref + '.horizontal", se definida, deve ser ' + 
									'do tipo string e ser igual a "left", "center" ou "right"'
								);
							}
							if (ref.vertical !== undefined) {
								if (["top", "center", "bottom"].indexOf(ref.vertical) > -1) var vertical = ref.vertical;
								else console.error(
									'A chave "' + sref + '.vertical", se definida, deve ser do tipo string e ser igual a "top", "center" ou "bottom"'
								);
							}
							main.style.position = {};
							main.style.position.horizontal = (horizontal !== undefined) ? horizontal : false;
							main.style.position.vertical   = (vertical   !== undefined) ? vertical   : false;
						} else if (ref.position == "auto") main.style.position = ref.position;
						else console.error('A chave "' + sref + '", se definida, deve ser do tipo object ou uma string igual a "auto"');
					}
				}
			}
			if (validarParam("obj.config", obj.config, "object", true, true, true)) {
				ref = obj.config;
				sref = "obj.config";
				if (validarParam(sref + ".move",  ref.move,  "boolean", true, true, true)) main.config.move = ref.move;
				if (validarParam(sref + ".close", ref.close, "object",  true, true, true)) {
					ref = ref.close;
					sref += ".close";
					if (validarParam(sref + ".mouse",    ref.mouse,    "boolean", true, true, true)) main.config.close.mouse   = ref.mouse;
					if (validarParam(sref + ".keyboard", ref.keyboard, "boolean", true, true, true)) main.config.close.keyboard = ref.keyboard;
				}
			}
			return main;
		}

		let botoesHTML = function(arr, jan) {
			let resultado = "";
			let indice    = controle_indices[jan];
			for (let i = 0; i < arr.length; i++) {
				let ref = obterBotao(arr[i]).objeto;
				let descr = ref.descr ? " title = '" + ref.descr + "'" : "";
				let inativo = !ref.active ? " disabled" : "";
				resultado += "<button " +
					"onclick = 'WS.boxes._control.exec(" + [indice, i].join(",") + ")' " +
					"id = '" + jan + "_btn" + i + "'" +
					descr +
					inativo +
				">" +
					x +
				"</button>";
			}
			return resultado;
		}

		let salvarPorValor = function(json, id) {
			if (validarParam("json", json, "object", false, false, true)) {
				id = idOuUltimo(id);
				let respostas = new Array();
				for (x in json) respostas[x] = json[x];
				controle_respostas[id] = respostas;
				return respostas;
			} else return false;
		}

		const animar = function() {
			if (permissaoMouse) {
				el_ultimoAtivo = document.getElementById(that.resources.getLast("active")).classList;
				el_ultimoAtivo.add("glass");
				setTimeout(function() {
					el_ultimoAtivo.remove("glass");
				}, 50);
				setTimeout(function() {
					el_ultimoAtivo.add("glass");
				}, 100);
				setTimeout(function() {
					el_ultimoAtivo.remove("glass");
				}, 150);
			}
		}

		const fecharMain = function(id) {
			lista_global[id].aberto = false;
			lista_global[id].ativo = false;
			lista_global[id].sel = -1;
			full.splice(full.indexOf(id), 1);
			document.getElementById(id).style.display = "none";
		}

		const fechaQuandoPaiInvisivel = function() {
			const pai_invisivel = paiInvisivel();
			let abertos = 0;
			for (x in lista_global) {
				if (lista_global[x].aberto) {
					if (pai_invisivel) {
						fecharMain(x);
						const fn = lista_global[x].objeto.content.head.buttons.close;
						if (typeof fn == "function") fn();
					} else redimensionar(x, false);
					abertos++;
				}
			}
			if (pai_invisivel) {
				Array.from(document.querySelectorAll("button")).forEach((el) => {
					el.disabled = false;
				});
				if (abertos > 0) {
					let aviso = abertos == 1 ? "A janela" : "As janelas";
					aviso += " não ";
					aviso += abertos == 1 ? "pôde" : "puderam";
					aviso += " ser redimensionada";
					if (abertos > 1) aviso += "s";
					aviso += " no espaço destinado a ela";
					if (abertos > 1) aviso += "s";
					aviso += " e ";
					aviso += abertos == 1 ? "foi" : "foram";
					aviso += " fechada";
					if (abertos > 1) aviso += "s";
					if (document.getElementById(WS_properties.boxes.container) !== null) aviso += "\nEscolha um elemento pai diferente";
					console.warn(aviso);
				}
			}
		}

		const ativarClasse = function(id) {
			let ativaBtn = id != that.resources.getLast("active");
			Array.from(document.querySelectorAll("button")).forEach((el) => {
				el.disabled = true;
			});
			for (x in lista_global) {
				Array.from(document.querySelectorAll("#" + x + " *")).forEach((el) => {
					el.disabled = false;
				});
				Array.from(document.querySelectorAll(
					"#" + x + (WS_properties.boxes.mult ? " footer" : "") + " *, " +
					"#" + x + " button, #" + x + " input[type=checkbox]"
				)).forEach((el) => {
					el.disabled = x != id;
					if (x != id && el.tagName == "BUTTON") el.classList.remove("focused");
				});
				
				lista_global[x].ativo = x == id;
				document.getElementById(x).classList.remove("active");
				if (x == id) {
					lista = document.querySelectorAll("#" + x + " footer button");
					for (let i = 0; i < lista.length; i++) lista[i].disabled = !obterBotao(lista_global[id].objeto.content.buttons[i]).objeto.active;
				}
			}
			if (ativaBtn) ativarBotaoPadraoUltimo(true);
			document.getElementById(id).classList.add("active");
			let indice = 3;
			for (x in lista_global) {
				let val;
				if (lista_global[x].aberto) {
					val = indice;
					indice += 1;
				} else val = 0;
				lista_global[x].zIndex = val;
				document.getElementById(x).style.zIndex = val;
			}
			if (WS_menu_bar_json.length) {
				if (!WS_properties.boxes.mult) document.getElementById("ws-menubar-cover").style.display = "block";
				WS.menu.bar.close();
			}
		}

		const ativar = function(id) {
			setTimeout(function() {
				id = idOuUltimo(id);
				if (id) {
					let aux = lista_global[id];
					delete lista_global[id];
					lista_global[id] = aux;
					aux = that.list[id];
					delete that.list[id];
					that.list[id] = aux;
					ativarClasse(id);
				}	
			}, 50);
		}

		const limparBotao = function() {
			for (x in lista_global) {
				let ref = lista_global[x];
				if (ref.aberto) {
					let todos = ref.objeto.content.buttons;
					for (let i = 0; i < todos.length; i++) {
						let el = document.getElementById(x + "_btn" + i);
						el.classList.remove("focused");
						for (y in todos[i]) var nome = y;
						el.innerHTML = nome;
					}
					ref.sel = -1;
				}
			}
		}

		const selecionaBotao = function(indice, espera) {
			const msgErro = "Foi solicitado um botão que não ";
			let ultimoAtivo = that.resources.getLast("active");
			let lUltimoAtivo = lista_global[ultimoAtivo];
			const botoes = lUltimoAtivo.objeto.content.buttons;
			if (indice > -1 && indice < botoes.length) {
				let ativos = new Array();
				for (let i = 0; i < botoes.length; i++) {
					if (obterBotao(botoes[i]).objeto.active) ativos.push(i);
				}
				if (ativos.indexOf(indice) > -1) {
					if (!impedir_selecao) {
						setTimeout(function() {
							try {
								ultimoAtivo = that.resources.getLast("active");
								lUltimoAtivo = lista_global[ultimoAtivo];
								lUltimoAtivo.sel = indice;
								document.getElementById(ultimoAtivo + "_btn" + lUltimoAtivo.sel).classList.add("focused");
							} catch(err) {}
						}, espera ? 100 : 0);
					}
				} else console.error(msgErro + "está ativo.");
			} else console.error(msgErro + "existe.");
		}

		const ativarBotaoPadraoUltimo = function(espera) {
			setTimeout(function() {
				const ultimoAtivo = that.resources.getLast("active");
				if (ultimoAtivo) {
					const _padrao = lista_global[ultimoAtivo].objeto.content.standardButton;
					if (_padrao > -1) {
						limparBotao();
						selecionaBotao(_padrao, espera);
					}
				}
			}, 0);
		}

		const posicionar = function(id, estilo, top, left, altura, largura) {
			const style = estilo.id == "ws-box-style";
			const sinalTop  = (top  < 5 || !style) ? "+" : "-";
			const sinalLeft = (left < 5 || !style) ? "+" : "-";
			if (style) {
				if (top  == 5) altura  = 0;
				if (left == 5) largura = 0;
			}
			const resultado = "#" + id + "{" +
				"top  : calc(" + (top  * 10) + "% " + sinalTop  + " " + (altura / 2)  + "px);" +
				"left : calc(" + (left * 10) + "% " + sinalLeft + " " + (largura / 2) + "px)" +
			"}";
			if (style) {
				estilo.innerHTML += resultado;
				for (x in lista_global) {
					let el = document.getElementById("ws-box-mov-" + x);
					if (el !== null) el.innerHTML = "";
				}
			} else estilo.innerHTML = resultado;
		}

		const redimensionar = function(id, parar) {
			const el   = document.getElementById(id);
			const ref  = getComputedStyle(el);
			const ref2 = lista_global[id];
			const ref3 = ref2.dimensions;
			let estilo = el.style;
			let pai    = elPai();
			let rect   = {
				top    : parseInt(ref.top.replace("px", "")),
				left   : parseInt(ref.left.replace("px", "")),
				width  : parseInt(ref.width.replace("px", "")),
				height : parseInt(ref.height.replace("px", ""))
			};
			rect.top  -= rect.height / 2;
			rect.left -= rect.width  / 2;
			const cond = {
				top        : rect.top    < pai.top  || rect.top  < 0,
				left       : rect.left   < pai.left || rect.left < 0,
				min_width  : rect.width  < ref3[0],
				min_height : rect.height < ref3[1],
				max_width  : (rect.left + rect.width)  > (pai.left + pai.width),
				max_height : (rect.top  + rect.height) > (pai.top  + pai.height)
			};
			if (pai.top  < 0) pai.top  = 0;
			if (pai.left < 0) pai.left = 0;
			const ultima = !cond.max_width && !cond.max_height;
			estilo.removeProperty("top");
			estilo.removeProperty("left");
			estilo.visibility = !bloquear_visibilidade || criando ? parar ? "" : "hidden" : "";
			if (cond.min_width) estilo.width = ref3[0] + "px";
			else if (cond.max_width) {
				if (!cond.left && ((rect.left - 10) > pai.left)) estilo.left = (rect.left - 10) + "px";
				else estilo.width = (rect.width - 10) + "px";
			}
			if (cond.min_height) estilo.height = ref3[1] + "px";
			else if (cond.max_height) {
				if (!cond.top && ((rect.top - 10) > pai.top)) estilo.top = (rect.top - 10) + "px";
				else estilo.height = (rect.height - 10) + "px";
			}
			if (cond.top)  estilo.top  = (pai.top  + (rect.height / 2)) + "px";
			if (cond.left) estilo.left = (pai.left + (rect.width  / 2)) + "px";
			if (!parar) {
				setTimeout(function() {
					redimensionar(id, ultima);
				}, ultima ? 100 : 0);
			}
		}

		const cria_e_altera = function(main, id, posiciona) {
			let estilo    = document.getElementById("ws-box-style");
			let el        = document.getElementById(id);
			let el_maxmin = document.getElementById(id + "-maxmin");
			let el_close  = document.getElementById(id + "-close").style;
			let ref2      = lista_global[id];
			let ref3      = main.style.dimensions;
			let abertos   = 0;
			let definidos = 0;
			let listaTop  = new Array();
			let listaLeft = new Array();
			const altura  = ref3.height  >= 150 ? ref3.height  : el.offsetHeight;
			const largura = ref3.width >= 150 ? ref3.width : el.offsetWidth;
			for (x in lista_global) {
				let ref4 = lista_global[x];
				if (ref4.aberto) {
					listaTop.push(ref4.position[0]);
					listaLeft.push(ref4.position[1]);
					abertos++;
				}
			}
			if (posiciona) {
				if (typeof main.style.position == "object") {
					let ref = main.style.position;
					switch(ref.vertical) {
						case "top":
							var top = 0;
							break;
						case "center":
							var top = 5;
							break;
						case "bottom":
							var top = 10;
							break;
					}
					switch(ref.horizontal) {
						case "left":
							var left = 0;
							break;
						case "center":
							var left = 5;
							break;
						case "right":
							var left = 10;
							break;
					}
					if (top  !== undefined) definidos++;
					if (left !== undefined) definidos++;
				}
				if (definidos < 2) {
					if (abertos > 1) {
						const tentarTop  = top  === undefined;
						const tentarLeft = left === undefined;
						let tentativa = 0;
						do {
							if (tentarTop)  top  = Math.floor(Math.random() * 9) + 1;
							if (tentarLeft) left = Math.floor(Math.random() * 9) + 1;
							tentativa++;
						} while (((listaTop.indexOf(top) > -1 && tentarTop) || (listaLeft.indexOf(left) > -1 && tentarLeft)) && tentativa < 10);
						if (tentativa >= 10) console.warn("Há muitas janelas abertas, isso pode provocar lentidão.");
					} else {
						if (top  === undefined) top  = 5;
						if (left === undefined) left = 5;
					}
					posicionar(id, estilo, top, left, altura, largura);
				} else posicionar(id, estilo, top, left, altura, largura);
			}
			if (ref3.height >= 150) estilo.innerHTML += "#" + id + "{height : " + ref3.height + "px}";
			estilo.innerHTML += ref3.width <= 150 ? "#" + id + " .title-bar-text{" +
				"margin-right:" + ((35 + (100 * (main.content.buttons.length - 1))) + (135 - (ref2.btnTopo * 50))) + "px" +
			"}" : "#" + id + "{width : " + ref3.width + "px}";
			ref2.position = [top, left];
			ref3 = el_maxmin.parentElement.style;
			el_maxmin = el_maxmin.style;
			ref3.visibility = !ref2.btnTopo ? "hidden" : "";
			ref2.dimensions = [largura, altura];
			switch(ref2.btnTopo) {
				case 1:
					if (ref2.objeto.content.head.buttons.maximize) {
						ref3.borderRightWidth = "0px";
						el_maxmin.borderBottomRightRadius = "5px";
					} else el_close.borderBottomLeftRadius = "5px";
					break;
				case 2:
					ref3.removeProperty("border-right-width");
					el_close.removeProperty("border-bottom-left-radius");
					el_maxmin.removeProperty("border-bottom-right-radius");
					break;
			}
			if (main.config.move) el.classList.add("draggable");
			else el.classList.remove("draggable");
			Array.from(document.querySelectorAll(".ws-box .title-bar")).forEach((barra) => {
				let id = barra.parentElement.id;
				if (lista_global[id].objeto.content.head.buttons.maximize) {
					barra.ondblclick = function() {
						if (lista_global[id].objeto.content.head.buttons.maximize) that.maintance.maxmin(id);
					};
				}
			});
			Array.from(document.getElementsByClassName("ws-box")).forEach((dragDiv) => {
				let id     = dragDiv.id;
				let ref    = lista_global[id];
				let header = dragDiv.firstElementChild;
				if (dragDiv.className.indexOf("draggable") > -1) {
					header.onmousedown = function(e) {
						let emBotao = false;
						Array.from(document.getElementsByClassName("title-bar-controls")).forEach((botao) => {
							if (botao.contains(e.target)) emBotao = true;
						});
						if (full.indexOf(id) == -1 && !emBotao && that.resources.getLast("active") == id) {
							ref.movendo = true;
							offsetX = e.clientX - (dragDiv.offsetWidth / 2) - dragDiv.getBoundingClientRect().left;
							offsetY = (-0.5169492 * dragDiv.offsetHeight) + 18;
						}
					}
					header.onmouseout = function() {
						ref.movendo = false;
					}
				} else header.onmousedown = function() {}
				document.addEventListener("mousemove", (e) => {
					if (ref.movendo && ref.objeto.config.move) {
						let pai = elPai();
						let x = e.clientX - offsetX;
						let y = e.clientY - offsetY;

						let limite = dragDiv.offsetWidth / 2;
						if (x >= limite) {
							let limite2 = window.innerWidth - limite;
							if (x > limite2) x = limite2;
						} else x = limite;
						while ((x + limite) > (pai.left + pai.width)) x--;
						while ((x - limite) < pai.left) x++;
						let x2 = (x - limite) / window.innerWidth;

						limite = dragDiv.offsetHeight / 2;
						if (y >= limite) {
							let limite2 = window.innerHeight - limite;
							if (y > limite2) y = limite2;
						} else y = limite;
						while ((y + limite) > (pai.top + pai.height)) y--;
						while ((y - limite) < pai.top) y++;
						let y2 = (y - limite) / window.innerHeight;

						ref.dataEstilo = [x2, y2];
						posicionar(id, document.getElementById("ws-box-mov-" + id), y2 * 10, x2 * 10, dragDiv.offsetHeight, dragDiv.offsetWidth);
					}
				});
				document.addEventListener("mouseup", () => {
					ref.movendo = false;
				});
			});
			fechaQuandoPaiInvisivel();
			setTimeout(function() {
				that.maintance.activate(id);
				ativarBotaoPadraoUltimo(true);
				redimensionar(id, false);
			}, 100);
		}

		const Box = function(obj) {
			let janId;

			let that2 = this;

			let validarId = function(acao) {
				let retorno = false;
				if (janId === undefined) console.error("Não é possível " + acao + " uma janela na mesma função que a criou.");
				else retorno = true;
				return retorno;
			}

			const Get = function() {
				const acao = "conhecer informações de";

				this.id = function() {
					return validarId(acao) ? janId : "";
				}

				this.zIndex = function() {
					return validarId(acao) ? that.resources.zIndex(janId) : -1;
				}

				this.maxmin = function() {
					return validarId(acao) ? that.resources.maxmin(janId) : null;
				}
			}

			const Set = function() {
				this.edit = function(obj) {
					if (validarId("editar")) that.change.edit(janId, obj);
				}

				this.clearEdits = function(qtd) {
					if (validarId("limpar as edições de")) that.change.clearEdits(janId, qtd);
				}

				this.activate = function() {
					if (validarId("ativar")) that.maintance.activate(janId);
				}

				this.close = function() {
					if (validarId("fechar")) that.maintance.close(janId);
				}

				this.reopen = function() {
					if (validarId("reabrir")) that.maintance.reopen(janId);
				}

				this.maxmin = function(maximizado) {
					if (validarId("maximizar ou restaurar")) that.maintance.maxmin(janId, maximizado);
				}

				this.alterButtonState = function(btn, ativar) {
					if (validarId("ativar ou desativar um botao de")) that.change.alterButtonState(janId, btn, ativar);
				}
			}

			setTimeout(function() {
				janId = "";
				if (validarParam("obj", obj, "object", true, true, true)) {
					let main = validarJSON(obj);
					if (obj.id === undefined) obj.id = "box";
					if (typeof obj.id == "string") {
						let cont = 1;
						for (x in lista_global) {
							if (x == "ws-" + obj.id + cont) cont++;
						}
						let _id = "ws-" + obj.id + cont;
						lista_global[_id] = {
							aberto     : true,
							ativo      : true,
							movendo    : false,
							position   : [],
							dataEstilo : [],
							dimensions : [],
							btnTopo    : 0,
							zIndex     : 0,
							sel        : -1,
							objeto     : clonar(main)
						};
						that.list[_id] = clonar(main);
						if (controle_indices[_id] === undefined) {
							cont = 0;
							for (x in controle_indices) cont++;
							controle_indices[_id] = cont;
						}
						let ref         = lista_global[_id];
						let ref2        = main.content.buttons;
						const semBotoes = !ref2.length ? "no-buttons" : "";
						janId = _id;
						let resultado = document.createElement("div");
						resultado.id = _id;
						resultado.classList.add("ws-box");
						if (main.style.white) resultado.classList.add("is-bright");
						resultado.innerHTML = "<div class = 'title-bar'>" +
							"<div class = 'title-bar-text'>" + main.content.head.title + "</div>" +
							"<div class = 'title-bar-controls'>" +
								"<button " +
									"id = '" + _id + "-maxmin' " +
									"aria-label = 'Maximize' " +
									"style = 'display:none' " +
									"onclick = 'WS.boxes.maintance.maxmin(" + cont + ")'" +
								"></button>" +
								"<button " +
									"id = '" + _id + "-close'" +
									"aria-label = 'Close' " +
									"style = 'display:none' " +
									"onclick = 'WS.boxes.maintance.close(" + cont + ")'" +
								"></button>" +
							"</div>" +
						"</div>" +
						"<div class = 'window-body " + semBotoes + "' id = '" + _id + "-body'>" +
							main.content.body +
						"</div>" +
						"<footer class = '" + semBotoes + "'>" +
							botoesHTML(ref2, _id) +
						"</footer>";
						elCorpo().appendChild(resultado);
						resultado = document.createElement("style");
						resultado.id = "ws-box-mov-" + _id;
						elCorpo().appendChild(resultado);
						ref2 = main.content.head.buttons;
						if (ref2.maximize) {
							document.getElementById(_id + "-maxmin").style.display = "";
							ref.btnTopo++;
						}
						if (typeof ref2.close == "function") {
							document.getElementById(_id + "-close").style.display = "";
							ref.btnTopo++;
						}
						cria_e_altera(main, _id, true);
						if (main.style.maximize) {
							let estilo = document.getElementById(_id).style;
							estilo.visibility = "hidden";
							setTimeout(function() {
								estilo.removeProperty("visibility");
								that.maintance.maxmin(_id);
							}, 150);
						}
					} else console.error('O parâmetro "obj.id" deve ser do tipo string');
				}
			}, 0);

			this.set = new Set();
			this.get = new Get();
		}
		
		const Economic = function() {
			let that2 = this;

			const centralizar = function(nome) {
				setTimeout(function() {
					that2.list[nome].set.edit({
						style : {
							position : {
								vertical : "center",
								horizontal : "center"
							}
						}
					});
				}, 100);
			}

			const reabrir = function(_conteudo, _titulo, nome) {
				that2.main(nome, {
					content : {
						head : {
							title : _titulo 
						},
						body : _conteudo
					}
				});
			}

			this.list = new Array();

			this.alert = function(_content, _title, name) {
				if (name === undefined) name = "alerta";
				if (_title === undefined) _title = "Aviso";
				if (that2.list[name] !== undefined) {
					_content = "<p>" + _content + "</p>";
					reabrir(_content, _title, name);
				} else that2.list[name] = that.create.alert(_content, _title);
				centralizar(name);
			}

			this.confirm = function(_content, _title, callback, name) {
				if (name === undefined) name = "confirma";
				if (that2.list[name] !== undefined) {
					_content = "<p>" + _content + "</p>";
					reabrir(_content, _title, name);
				} else that2.list[name] = that.create.confirm(_content, _title, false, callback);
				centralizar(name);
			}

			this.prompt = function(_content, placeholder, _title, validate, callback, name) {
				if (name === undefined) name = "prompt";
				if (that2.list[name] !== undefined) {
					_content = "<p>" + _content + "</p>" +
						"<input type = 'text' id = 'prompt' style = 'width:100%;margin-bottom:10px' value = '" + placeholder + "' />";
					reabrir(_content, _title, name);
				} else that2.list[name] = that.create.prompt(_content, placeholder, _title, true, validate, callback);
				centralizar(name);
			}

			this.main = function(name, obj, callback) {
				if (that2.list[name] !== undefined) {
					let estilo = document.getElementById(that2.list[name].get.id()).style;
					that2.list[name].set.reopen();
					estilo.visibility = "hidden";
					setTimeout(function() {
						that2.list[name].set.edit(obj);
					}, 100);
					setTimeout(function() {
						estilo.removeProperty("visibility");
					}, 200);
				} else {
					setTimeout(function() {
						that2.list[name] = that.create.main(obj);
					}, 100);
				}
				if (callback !== undefined) {
					setTimeout(function() {
						callback();
					}, 600);
				}
			}
			
			this.loader = function(total, label, _title) {
				if (label === undefined) label = "Carregando...";
				if (_title === undefined) _title = "Carregando";
				let that3 = this;
				let tempo = 0;
				let totalGeral = total;
                let antMult = WS_properties.boxes.mult;

				const temporizador = setInterval(function() {
					let tempoFormatado = function(val) {
						let horas = Math.floor(val / 3600);
						let minutos = Math.floor((val - (horas * 3600)) / 60);
						let segundos = Math.floor(val - (horas * 3600) - (minutos * 60));
						let resultado = minutos.toString().padStart(2, "0") + ":" + segundos.toString().padStart(2, "0");
                        if (horas) resultado = horas.toString().padStart(2, "0") + ":" + resultado;
						return resultado;
					}

					tempo++;
					document.getElementById("ws-elapsed").innerHTML = tempoFormatado(tempo);
					document.getElementById("ws-estimated").innerHTML = total && that3.current ? tempoFormatado((tempo / (that3.current / totalGeral)) - tempo) : "Indisponível";
				}, 1000);

				const fechar = function() {
					WS_properties.boxes.mult = antMult;
					WS_isLoading = false;
					clearInterval(temporizador);
					tempo = 0;
					that2.list.loader.set.close();
				}

				this.go = function(portion) {
					let estilo = document.querySelector("#ws-loader div").style;
					that3.current += portion;
					if (total > 0 && that3.current < total) {
						estilo.width = (parseInt((that3.current * 100) / total)) + "%";
						return;
					}
					that3.proceed = false;
					estilo.width = "100%";
					setTimeout(function() {
						fechar();
						document.querySelector("#ws-loader style").innerHTML = "";
					}, 500);
				}

				this.reset = function(_total) {
					that3.current = 0;
					total = _total;
					totalGeral += _total;
					document.querySelector("#ws-loader div").style.width = "0%";
				}

				this.setLabel = function(label) {
					document.querySelector("p.ws-progress").innerHTML = label;
				}

				this.current = 0;
				this.proceed = true;

				let botoes = new Array();
				if (total) {
					let btn = WS.boxes.resources.standardButton();
					btn.fn = function() {
						that3.proceed = false;
						fechar();
					};
					botoes.push({
						"Cancelar" : btn
					});
				} else {
					setTimeout(function() {
						document.querySelector("#ws-loader style").innerHTML = "* {cursor:wait !important}";
					}, 500);
				}

				WS_properties.boxes.mult = false;
				WS_isLoading = true;
				that2.main("loader", {
					content : {
						head : {
							title : _title,
							buttons : {
								maximize : false
							}
						},
						body : "<p class = 'ws-progress' style = 'margin:10px 0'>" + label + "</p>" +
						"<div id = 'ws-loader' class = 'ws-progress animate" + (!total ? " marquee" : "") + "'>" +
							"<div style = 'width:0%'></div>" +
							"<style type = 'text/css'></style>" +
						"</div>" +
						"<table class = 'ws-progress'>" +
							"<tr>" +
								"<td>Tempo decorrido:</td>" +
								"<td id = 'ws-elapsed'>Calculando...</td>" +
							"</tr>" +
							"<tr>" +
								"<td>Tempo estimado:</td>" +
								"<td id = 'ws-estimated'>Calculando...</td>" +
							"</tr>" +
						"</table>",
						buttons : botoes,
						config : {
							close : {
								keyboard : false
							}
						}
					},
					style : {
						maximize : false,
						dimensions : {
							height : total ? 200 : 170,
							width : 248
						}
					}
				});
				return this;
			}
		}
		
		this.economic = new Economic();
	}
	
	this._control = new Control();
	this.keycombo = new KeyCombo(WS_properties.key_combo);
	this.menu = new Menu();
	this.boxes = new Boxes();
	
	WS_isLoaded = true;
}
