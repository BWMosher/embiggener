// declaring all of the elements of the HTML i want to look at to make decisions
var inputE=document.getElementById('inputbox');
var outputE=document.getElementById('output');
var outStyle=outputE.style;
var BGStyle=outStyle.background;

var scaleE=document.getElementById('scale');
var colorE=document.getElementById('outcolor');
var fontE=document.getElementById('fontfam');
var alignE=document.getElementById('aligny')
var spareE=document.getElementById('spare')
var lightE=document.getElementById('lightswitch')
var creditsE=document.getElementById('credits')
var controlsE=document.getElementById('controls')
var outcontainerE=document.getElementById('outputContainer')
var fitE=document.getElementById('fittoggle')

// use this to add the light mode class to the body to make everything else change appearance
function toggleBG() {
   var element = document.body;
   element.classList.toggle("light-mode");
}

// this function runs when the program is started
// all of the functions run in a specific order. Some of them need to run before others.
function initialize() {
  getParams();
  resizeOutput();
  useParams();
  writeSpares();
  callScale();
  colorChange();
  fontChange();
  alignChange();
  updateOutput();
  fitMaybe();
}

// starting these two variables so they become objects when they are added to
var result = {};
var spareparams = {};

// get the stuff in the url and put it all in an object
function getParams() {
  const params = window.location.search.replaceAll("?", "").split("&").map((item) => item.split("="));
  params.forEach((item) => {
    result = { ...result, [item[0]]: item[1] };
  });
}
// params is the list of things extracted from the url
// result is a list of keys and values



// for all of the keys in the dictionary "result", there are many things that need to be done. Here is where that happens
function useParams() {
	pulled = Object.keys(result)
	if (pulled.includes("input")) {
		inputE.value = decodeURIComponent(result.input).replaceAll("%23", "#").replaceAll('%25', '%').replace('%26', '&').replaceAll(/%3d/gi, "=").replaceAll(/%3a/gi,":");
    //the URL forcibly encodes some characters, this undoes it for the sake of eyes
    
	}
	if (pulled.includes("scale")) {
		scaleE.value = decodeURIComponent(result.scale);
	}
	if (pulled.includes("color")) {
		colorE.value = decodeURIComponent(result.color);
	}
	if (pulled.includes("font")) {
    fontE.value = decodeURIComponent(result.font);
	}  
	if (pulled.includes("align")) {
		alignE.value = decodeURIComponent(result.align);
	}
	if (pulled.includes("fg")) {
		outStyle.color = result.fg.replaceAll('%23','#');
	}
  else if (pulled.includes("fgh")) {
    outStyle.color = "#" + result.fgh;
  }
	if (pulled.includes("bg")) {
		outStyle.backgroundColor = result.bg.replaceAll('%23','#');
  }
  else if (pulled.includes("bgh")) {
    outStyle.backgroundColor = "#" + result.bgh;
  }
  if (pulled.includes("bgl")) {
    outStyle.background = "linear-gradient(" + result.bgl.replaceAll("+",", ").replaceAll('%23', "#") + ")"
  }
  else if (pulled.includes("bglt")) {
    outStyle.background = "linear-gradient(var(--a), " + result.bglt.replaceAll("+",", ").replaceAll('%23', "#") + ")"
  }
  else if (pulled.includes("bgr")) {
    outStyle.background = "radial-gradient(" + result.bgr.replaceAll("+",", ").replaceAll(/%23/gi, "#") + ")"
  }
  else if (pulled.includes("bgc")) {
    outStyle.background = "conic-gradient(" + result.bgc.replaceAll("+",", ").replaceAll(/%23/gi, "#") + ")"
  }
  if (pulled.includes("sway")) {
    outStyle.backgroundSize="200% 200%"
    outStyle.animation = "gradient " + result.sway + " ease infinite"
  }
  if (pulled.includes("spin")) {
    outStyle.animation = "spin " + result.spin + " linear infinite"
  }
	if (pulled.includes("weight")) {
		outStyle.fontWeight = result.weight;
	}
	else if (pulled.includes("bold")) {
		outStyle.fontWeight= "bold";
    //notice that i don't look at result.bold. There is no value there. There's no reason to do this either.
	}
  if (pulled.includes("shadow")) {
		outStyle.textShadow = result.shadow.replaceAll("+", " ").replaceAll(/%23/gi, "#");
	}
  else if (pulled.includes("border")) {
		settings=result.border.split("+");
		w=settings[0];
		col=settings[1].replace(/%23/g, "#");
		outStyle.textShadow = "-" + w + " 0px " + col + ", 0px -" + w + " " + col + ", " + w + " 0px " + col + ", 0px " + w + " " + col
    //the variables above aren't super needed but they do save on characters
	}
	else if (pulled.includes("glow")) {
		outStyle.textShadow = "0px 0px " + result.glow.replace(/\+/, " ").replaceAll(/%23/gi, "#");
	}
	if (pulled.includes("italic")) {
		outStyle.fontStyle= "italic";
	}
	if (pulled.includes("underline")) {
		outStyle.textDecoration= "underline";
	}
	if (pulled.includes("smallcaps")) {
		outStyle.fontVariant= "small-caps";
	}
  if (pulled.includes("title")) {
    document.title = result.title.replace(/%20/g," ");
  }
  

  if (pulled.includes("image")) {
    outStyle.backgroundImage = 'url("' + result.image + '")'
    outStyle.backgroundPosition = "right top"
    outStyle.backgroundSize = "25%"
    outStyle.backgroundRepeat = "no-repeat"
    //inside this I'm setting up the defaults
    if (pulled.includes("imagesize")) {
      //notice that this is only accessible in the code if image is also present in the object. this makes sense because these options aren't useful without an image.
      settings=result.imagesize.split("+");
      outStyle.backgroundSize = settings[0] + " " + settings[1];
    }
    else if (pulled.includes("imagestretch")) {
      outStyle.backgroundSize = "100% 100%"
    }
    else if (pulled.includes("imagewidth")) {
      outStyle.backgroundSize = result.imagewidth;
    }
    if (pulled.includes("imageposition")) {
      settings=result.imageposition.split("+");
      outStyle.backgroundPosition = settings[0] + " " + settings[1];
    }
    if (pulled.includes("imagerepeat")) {
		outStyle.backgroundRepeat= "repeat";
	  }
  }
  if (pulled.includes("lightmode")) {
    document.body.classList.toggle("light-mode")
    lightE.checked = true;
  }
  //this makes a deep copy of result
	spareparams = JSON.parse(JSON.stringify(result));

  var paramswithcontrols = ["input","scale","color","font","align","lightmode"] //all of the settings mentioned here don't end up in params

  //this removes all of the keys we don't need in spareparams
	for (var key of Object.keys(spareparams)){
		if (paramswithcontrols.includes(key)) {
			delete spareparams[key];
		}
	}
}

//for all of the things that are still in
function writeSpares() {
  sparestring=""
   Object.keys(spareparams).forEach((key)=>{
     sparestring+=key + "=" + spareparams[key].replace(/%23/g,'#').replace(/=/g, '%3d').replace(/&/g, '%26').replace(/\?/g, '%3F') + "&";
     console.log(sparestring);
   } );
  spareE.value=sparestring;
}

// this sets the size of the text according to the value in the scale control.
function callScale() {
  outStyle.fontSize=scaleE.value+"em";
}

// this sets the color of the text according to the value in the dropdown
function colorChange() {
  var newclasses=""
  if (lightE.value) {
     newclasses+="light-mode "
  }
  newclasses+="emphasis " + colorE.value;
  outputE.className=newclasses;
}

// this controls the value of the font according to the value in the dropdown
fonts={
  "georgia":"Georgia,serif",
  "garamond":"'EB Garamond',serif",
  "serif": "serif",
  "fira":"'Fira Code',monospace",
  "xanh":"'Xanh Mono',monospace",
  "mono":"monospace",
  "arial":"Arial,sans-serif",
  "sans":"sans-serif",
  "papyrus":"Papyrus,fantasy",
  "amiri": "Amiri, serif",
  "cairo": "Cairo, sans-serif",
  "messiri": "'El Messiri', sans-serif",
  "notoarabic":"'Noto Sans Arabic', sans-serif",
  "reem": "'Reem Kufi', sans-serif",
  "notosans": "'Noto Sans', sans-serif"
};
function fontChange() {
  fontkey=fontE.value;
  outStyle.fontFamily=fonts[fontkey];
}

// this controls the value of the alignment according to the value in the dropdown
function alignChange() {
  outStyle.textAlign=alignE.value;
}

// this controls the value of the output according to the value in the input box
function updateOutput() {
  potentialout="";
  if (pulled.includes("rfc1345")){
    potentialout=replaceDigraphs(inputE.value,result.rfc1345);
  }
  else{
    potentialout=inputE.value;
  }
  outputE.innerHTML=potentialout.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  //this is needed so that html isn't hidden in this output
  
}

function resizeOutput() {
  var screenHeight = window.innerHeight;
  var usedHeight = inputE.offsetHeight + controlsE.offsetHeight + spareE.offsetHeight + creditsE.offsetHeight;
  outStyle.height = (screenHeight - usedHeight) + "px";
  // this sets the size of the output so that the full screen never has to scroll
}

// this takes the values that are in all of the controls and the spare parameter box and adds them to the url when the save button is pressed
function writeParams() {
  input=inputE.value.replace(/=/g, '%3d').replace(/:/g, '%3A').replace(/#/g, '%23').replace(/%/g, '%25').replace(/&/g, '%26').replace(/\?/g, '%3F');
  scale=scaleE.value
  color=colorE.value
  font=fontE.value
  align=alignE.value
  spare=spareE.value.replace(/#/g,'%23').replace(" ","%20");
  var lightmode=""
  if (lightE.checked) {
    lightmode="&lightmode="
  }
  outstring='https://embiggener.bryanmosher1.repl.co/?input=' + input + "&scale=" + scale + "&color=" + color + "&font=" + font + "&align=" + align + lightmode + "&" + spare;
  document.location.href = outstring.replace(/\n\r?/g, '%0d');
}

// resizes the text to the largest possible without scrolling
function maxText() {
  fonttry=100;
  outStyle.fontSize = fonttry + "em";
  while (outputE.clientHeight < outputE.scrollHeight) {
    fonttry*=0.96;
    outStyle.fontSize = fonttry + "em"
  }
  console.log(fonttry);
  scaleE.value=fonttry.toFixed(2);
}

//if the autofit parameter is picked, apply fit
function fitMaybe (){
  if (Object.keys(result).includes("autofit")) {
    maxText();
  }
}

rfc1345 = {
"HT":"\t", "SP": " ", "Nb": "#", "DO": "$", "At": "@",
"<(": "[", "//": "\\", ")>": "]", "'>": "^", "'!": "`",
"(!": "{", "!!": "|", "!)": "}", "'?": "~", "NS": " ",
"!I": "¡", "Ct": "¢", "Pd": "£", "Cu": "¤", "Ye": "¥",
"BB": "¦", "SE": "§", "':": "¨", "Co": "©", "-a": "ª",
"<<": "«", "NO": "¬", "Rg": "®", "'m": "¯", "DG": "°",
"+-": "±", "2S": "²", "3S": "³", "''": "´", "My": "µ",
"PI": "¶", ".M": "·", "',": "¸", "1S": "¹", "-o": "º",
">>": "»", "14": "¼", "12": "½", "34": "¾", "?I": "¿",
"A!": "À", "A'": "Á", "A>": "Â", "A?": "Ã", "A:": "Ä",
"AA": "Å", "AE": "Æ", "C,": "Ç", "E!": "È", "E'": "É",
"E>": "Ê", "E:": "Ë", "I!": "Ì", "I'": "Í", "I>": "Î",
"I:": "Ï", "D-": "Ð", "N?": "Ñ", "O!": "Ò", "O'": "Ó",
"O>": "Ô", "O?": "Õ", "O:": "Ö", "*X": "×", "O/": "Ø",
"U!": "Ù", "U'": "Ú", "U>": "Û", "U:": "Ü", "Y'": "Ý",
"TH": "Þ", "ss": "ß", "a!": "à", "a'": "á", "a>": "â",
"a?": "ã", "a:": "ä", "aa": "å", "ae": "æ", "c,": "ç",
"e!": "è", "e'": "é", "e>": "ê", "e:": "ë", "i!": "ì",
"i'": "í", "i>": "î", "i:": "ï", "d-": "ð", "n?": "ñ",
"o!": "ò", "o'": "ó", "o>": "ô", "o?": "õ", "o:": "ö",
"-:": "÷", "o/": "ø", "u!": "ù", "u'": "ú", "u>": "û",
"u:": "ü", "y'": "ý", "th": "þ", "y:": "ÿ", "A-": "Ā",
"a-": "ā", "A(": "Ă", "a(": "ă", "A;": "Ą", "a;": "ą",
"C'": "Ć", "c'": "ć", "C>": "Ĉ", "c>": "ĉ", "C.": "Ċ",
"c.": "ċ", "C<": "Č", "c<": "č", "D<": "Ď", "d<": "ď",
"D/": "Đ", "d/": "đ", "E-": "Ē", "e-": "ē", "E(": "Ĕ",
"e(": "ĕ", "E.": "Ė", "e.": "ė", "E;": "Ę", "e;": "ę",
"E<": "Ě", "e<": "ě", "G>": "Ĝ", "g>": "ĝ", "G(": "Ğ",
"g(": "ğ", "G.": "Ġ", "g.": "ġ", "G,": "Ģ", "g,": "ģ",
"H>": "Ĥ", "h>": "ĥ", "H/": "Ħ", "h/": "ħ", "I?": "Ĩ",
"i?": "ĩ", "I-": "Ī", "i-": "ī", "I(": "Ĭ", "i(": "ĭ",
"I;": "Į", "i;": "į", "I.": "İ", "i.": "ı", "IJ": "Ĳ",
"ij": "ĳ", "J>": "Ĵ", "j>": "ĵ", "K,": "Ķ", "k,": "ķ",
"kk": "ĸ", "L'": "Ĺ", "l'": "ĺ", "L,": "Ļ", "l,": "ļ",
"L<": "Ľ", "l<": "ľ", "L.": "Ŀ", "l.": "ŀ", "L/": "Ł",
"l/": "ł", "N'": "Ń", "n'": "ń", "N,": "Ņ", "n,": "ņ",
"N<": "Ň", "n<": "ň", "'n": "ŉ", "NG": "Ŋ", "ng": "ŋ",
"O-": "Ō", "o-": "ō", "O(": "Ŏ", "o(": "ŏ", 'O"': "Ő",
'o"': "ő", "OE": "Œ", "oe": "œ", "R'": "Ŕ", "r'": "ŕ",
"R,": "Ŗ", "r,": "ŗ", "R<": "Ř", "r<": "ř", "S'": "Ś",
"s'": "ś", "S>": "Ŝ", "s>": "ŝ", "S,": "Ş", "s,": "ş",
"S<": "Š", "s<": "š", "T,": "Ţ", "t,": "ţ", "T<": "Ť",
"t<": "ť", "T/": "Ŧ", "t/": "ŧ", "U?": "Ũ", "u?": "ũ",
"U-": "Ū", "u-": "ū", "U(": "Ŭ", "u(": "ŭ", "U0": "Ů",
"u0": "ů", 'U"': "Ű", 'u"': "ű", "U;": "Ų", "u;": "ų",
"W>": "Ŵ", "w>": "ŵ", "Y>": "Ŷ", "y>": "ŷ", "Y:": "Ÿ",
"Z'": "Ź", "z'": "ź", "Z.": "Ż", "z.": "ż", "Z<": "Ž",
"z<": "ž", "O9": "Ơ", "o9": "ơ", "OI": "Ƣ", "oi": "ƣ",
"yr": "Ʀ", "U9": "Ư", "u9": "ư", "Z/": "Ƶ", "z/": "ƶ",
"ED": "Ʒ", "A<": "Ǎ", "a<": "ǎ", "I<": "Ǐ", "i<": "ǐ",
"O<": "Ǒ", "o<": "ǒ", "U<": "Ǔ", "u<": "ǔ", "A1": "Ǟ",
"a1": "ǟ", "A7": "Ǡ", "a7": "ǡ", "A3": "Ǣ", "a3": "ǣ",
"G/": "Ǥ", "g/": "ǥ", "G<": "Ǧ", "g<": "ǧ", "K<": "Ǩ",
"k<": "ǩ", "O;": "Ǫ", "o;": "ǫ", "O1": "Ǭ", "o1": "ǭ",
"EZ": "Ǯ", "ez": "ǯ", "j<": "ǰ", "G'": "Ǵ", "g'": "ǵ",
";S": "ʿ", "'<": "ˇ", "'(": "˘", "'.": "˙", "'0": "˚",
"';": "˛", "'\"": '˝', "A%": "Ά", "E%": "Έ", "Y%": "Ή",
"I%": "Ί", "O%": "Ό", "U%": "Ύ", "W%": "Ώ", "i3": "ΐ",
"A*": "Α", "B*": "Β", "G*": "Γ", "D*": "Δ", "E*": "Ε",
"Z*": "Ζ", "Y*": "Η", "H*": "Θ", "I*": "Ι", "K*": "Κ",
"L*": "Λ", "M*": "Μ", "N*": "Ν", "C*": "Ξ", "O*": "Ο",
"P*": "Π", "R*": "Ρ", "S*": "Σ", "T*": "Τ", "U*": "Υ",
"F*": "Φ", "X*": "Χ", "Q*": "Ψ", "W*": "Ω", "J*": "Ϊ",
"V*": "Ϋ", "a%": "ά", "e%": "έ", "y%": "ή", "i%": "ί",
"u3": "ΰ", "a*": "α", "b*": "β", "g*": "γ", "d*": "δ",
"e*": "ε", "z*": "ζ", "y*": "η", "h*": "θ", "i*": "ι",
"k*": "κ", "l*": "λ", "m*": "μ", "n*": "ν", "c*": "ξ",
"o*": "ο", "p*": "π", "r*": "ρ", "*s": "ς", "s*": "σ",
"t*": "τ", "u*": "υ", "f*": "φ", "x*": "χ", "q*": "ψ",
"w*": "ω", "j*": "ϊ", "v*": "ϋ", "o%": "ό", "u%": "ύ",
"w%": "ώ", "'G": "Ϙ", ",G": "ϙ", "T3": "Ϛ", "t3": "ϛ",
"M3": "Ϝ", "m3": "ϝ", "K3": "Ϟ", "k3": "ϟ", "P3": "Ϡ",
"p3": "ϡ", "'%": "ϴ", "j3": "ϵ", "IO": "Ё", "D%": "Ђ",
"G%": "Ѓ", "IE": "Є", "DS": "Ѕ", "II": "І", "YI": "Ї",
"J%": "Ј", "LJ": "Љ", "NJ": "Њ", "Ts": "Ћ", "KJ": "Ќ",
"V%": "Ў", "DZ": "Џ", "A=": "А", "B=": "Б", "V=": "В",
"G=": "Г", "D=": "Д", "E=": "Е", "Z%": "Ж", "Z=": "З",
"I=": "И", "J=": "Й", "K=": "К", "L=": "Л", "M=": "М",
"N=": "Н", "O=": "О", "P=": "П", "R=": "Р", "S=": "С",
"T=": "Т", "U=": "У", "F=": "Ф", "H=": "Х", "C=": "Ц",
"C%": "Ч", "S%": "Ш", "Sc": "Щ", '="': "Ъ", "Y=": "Ы",
'%"': "Ь", "JE": "Э", "JU": "Ю", "JA": "Я", "a=": "а",
"b=": "б", "v=": "в", "g=": "г", "d=": "д", "e=": "е",
"z%": "ж", "z=": "з", "i=": "и", "j=": "й", "k=": "к",
"l=": "л", "m=": "м", "n=": "н", "o=": "о", "p=": "п",
"r=": "р", "s=": "с", "t=": "т", "u=": "у", "f=": "ф",
"h=": "х", "c=": "ц", "c%": "ч", "s%": "ш", "sc": "щ",
"='": "ъ", "y=": "ы", "%'": "ь", "je": "э", "ju": "ю",
"ja": "я", "io": "ё", "d%": "ђ", "g%": "ѓ", "ie": "є",
"ds": "ѕ", "ii": "і", "yi": "ї", "j%": "ј", "lj": "љ",
"nj": "њ", "ts": "ћ", "kj": "ќ", "v%": "ў", "dz": "џ",
"Y3": "Ѣ", "y3": "ѣ", "O3": "Ѫ", "o3": "ѫ", "F3": "Ѳ",
"f3": "ѳ", "V3": "Ѵ", "v3": "ѵ", "C3": "Ҁ", "c3": "ҁ",
"G3": "Ґ", "g3": "ґ", "A+": "א", "B+": "ב", "G+": "ג",
"D+": "ד", "H+": "ה", "W+": "ו", "Z+": "ז", "X+": "ח",
"Tj": "ט", "J+": "י", "K%": "ך", "K+": "כ", "L+": "ל",
"M%": "ם", "M+": "מ", "N%": "ן", "N+": "נ", "S+": "ס",
"E+": "ע", "P%": "ף", "P+": "פ", "Zj": "ץ", "ZJ": "צ",
"Q+": "ק", "R+": "ר", "Sh": "ש", "T+": "ת", ",+": "،",
";+": "؛", "?+": "؟", "H'": "ء", "aM": "آ", "aH": "أ",
"wH": "ؤ", "ah": "إ", "yH": "ئ", "a+": "ا", "b+": "ب",
"tm": "ة", "t+": "ت", "tk": "ث", "g+": "ج", "hk": "ح",
"x+": "خ", "d+": "د", "dk": "ذ", "r+": "ر", "z+": "ز",
"s+": "س", "sn": "ش", "c+": "ص", "dd": "ض", "tj": "ط",
"zH": "ظ", "e+": "ع", "i+": "غ", "++": "ـ", "f+": "ف",
"q+": "ق", "k+": "ك", "l+": "ل", "m+": "م", "n+": "ن",
"h+": "ه", "w+": "و", "j+": "ى", "y+": "ي", "p+": "پ",
"v+": "ڤ", "gf": "گ", "0a": "۰", "1a": "۱", "2a": "۲",
"3a": "۳", "4a": "۴", "5a": "۵", "6a": "۶", "7a": "۷",
"8a": "۸", "9a": "۹", "B.": "Ḃ", "b.": "ḃ", "B_": "Ḇ",
"b_": "ḇ", "D.": "Ḋ", "d.": "ḋ", "D_": "Ḏ", "d_": "ḏ",
"D,": "Ḑ", "d,": "ḑ", "F.": "Ḟ", "f.": "ḟ", "G-": "Ḡ",
"g-": "ḡ", "H.": "Ḣ", "h.": "ḣ", "H:": "Ḧ", "h:": "ḧ",
"H,": "Ḩ", "h,": "ḩ", "K'": "Ḱ", "k'": "ḱ", "K_": "Ḵ",
"k_": "ḵ", "L_": "Ḻ", "l_": "ḻ", "M'": "Ḿ", "m'": "ḿ",
"M.": "Ṁ", "m.": "ṁ", "N.": "Ṅ", "n.": "ṅ", "N_": "Ṉ",
"n_": "ṉ", "P'": "Ṕ", "p'": "ṕ", "P.": "Ṗ", "p.": "ṗ",
"R.": "Ṙ", "r.": "ṙ", "R_": "Ṟ", "r_": "ṟ", "S.": "Ṡ",
"s.": "ṡ", "T.": "Ṫ", "t.": "ṫ", "T_": "Ṯ", "t_": "ṯ",
"V?": "Ṽ", "v?": "ṽ", "W!": "Ẁ", "w!": "ẁ", "W'": "Ẃ",
"w'": "ẃ", "W:": "Ẅ", "w:": "ẅ", "W.": "Ẇ", "w.": "ẇ",
"X.": "Ẋ", "x.": "ẋ", "X:": "Ẍ", "x:": "ẍ", "Y.": "Ẏ",
"y.": "ẏ", "Z>": "Ẑ", "z>": "ẑ", "Z_": "Ẕ", "z_": "ẕ",
"h_": "ẖ", "t:": "ẗ", "w0": "ẘ", "y0": "ẙ", "A2": "Ả",
"a2": "ả", "E2": "Ẻ", "e2": "ẻ", "E?": "Ẽ", "e?": "ẽ",
"I2": "Ỉ", "i2": "ỉ", "O2": "Ỏ", "o2": "ỏ", "U2": "Ủ",
"u2": "ủ", "Y!": "Ỳ", "y!": "ỳ", "Y2": "Ỷ", "y2": "ỷ",
"Y?": "Ỹ", "y?": "ỹ", ";'": "ἀ", ",'": "ἁ", ";!": "ἂ",
",!": "ἃ", "?;": "ἄ", "?,": "ἅ", "!:": "ἆ", "?:": "ἇ",
"1N": " ", "1M": " ", "3M": " ", "4M": " ", "6M": " ",
"1T": " ", "1H": " ", "-1": "‐", "-N": "–", "-M": "—",
"-3": "―", "!2": "‖", "=2": "‗", "'6": "‘", "'9": "’",
".9": "‚", "9'": "‛", '"6': "“", '"9': "”", ":9": "„",
'9"': "‟", "/-": "†", "/=": "‡", "..": "‥", ",.": "…",
"%0": "‰", "1'": "′", "2'": "″", "3'": "‴", '1"': "‵",
'2"': "‶", '3"': "‷", "Ca": "‸", "<1": "‹", ">1": "›",
":X": "※", "'-": "‾", "/f": "⁄", "0S": "⁰", "4S": "⁴",
"5S": "⁵", "6S": "⁶", "7S": "⁷", "8S": "⁸", "9S": "⁹",
"+S": "⁺", "-S": "⁻", "=S": "⁼", "(S": "⁽", ")S": "⁾",
"nS": "ⁿ", "0s": "₀", "1s": "₁", "2s": "₂", "3s": "₃",
"4s": "₄", "5s": "₅", "6s": "₆", "7s": "₇", "8s": "₈",
"9s": "₉", "+s": "₊", "-s": "₋", "=s": "₌", "(s": "₍",
")s": "₎", "Li": "₤", "Pt": "₧", "W=": "₩", "Eu": "€",
"=R": "₽", "=P": "₽", "oC": "℃", "co": "℅", "oF": "℉",
"N0": "№", "PO": "℗", "Rx": "℞", "SM": "℠", "TM": "™",
"Om": "Ω", "AO": "Å", "13": "⅓", "23": "⅔", "15": "⅕",
"25": "⅖", "35": "⅗", "45": "⅘", "16": "⅙", "56": "⅚",
"18": "⅛", "38": "⅜", "58": "⅝", "78": "⅞", "1R": "Ⅰ",
"2R": "Ⅱ", "3R": "Ⅲ", "4R": "Ⅳ", "5R": "Ⅴ", "6R": "Ⅵ",
"7R": "Ⅶ", "8R": "Ⅷ", "9R": "Ⅸ", "aR": "Ⅹ", "bR": "Ⅺ",
"cR": "Ⅻ", "1r": "ⅰ", "2r": "ⅱ", "3r": "ⅲ", "4r": "ⅳ",
"5r": "ⅴ", "6r": "ⅵ", "7r": "ⅶ", "8r": "ⅷ", "9r": "ⅸ",
"ar": "ⅹ", "br": "ⅺ", "cr": "ⅻ", "<-": "←", "-!": "↑",
"->": "→", "-v": "↓", "<>": "↔", "UD": "↕", "<=": "⇐",
"=>": "⇒", "==": "⇔", "FA": "∀", "dP": "∂", "TE": "∃",
"/0": "∅", "DE": "∆", "NB": "∇", "(-": "∈", "-)": "∋",
"*P": "∏", "+Z": "∑", "-2": "−", "-+": "∓", "*-": "∗",
"Ob": "∘", "Sb": "∙", "RT": "√", "0(": "∝", "00": "∞",
"-L": "∟", "-V": "∠", "PP": "∥", "AN": "∧", "OR": "∨",
"(U": "∩", ")U": "∪", "In": "∫", "DI": "∬", "Io": "∮",
".:": "∴", ":.": "∵", ":R": "∶", "::": "∷", "?1": "∼",
"CG": "∾", "?-": "≃", "?=": "≅", "?2": "≈", "=?": "≌",
"HI": "≓", "!=": "≠", "=3": "≡", "=<": "≤", ">=": "≥",
"<*": "≪", "*>": "≫", "!<": "≮", "!>": "≯", "(C": "⊂",
")C": "⊃", "(_": "⊆", ")_": "⊇", "0.": "⊙", "02": "⊚",
"-T": "⊥", ".P": "⋅", ":3": "⋮", ".3": "⋯", "Eh": "⌂",
"<7": "⌈", ">7": "⌉", "7<": "⌊", "7>": "⌋", "NI": "⌐",
"(A": "⌒", "TR": "⌕", "Iu": "⌠", "Il": "⌡", "</": "〈",
"/>": "〉", "Vs": "␣", "1h": "⑀", "3h": "⑁", "2h": "⑂",
"4h": "⑃", "1j": "⑆", "2j": "⑇", "3j": "⑈", "4j": "⑉",
"1.": "⒈", "2.": "⒉", "3.": "⒊", "4.": "⒋", "5.": "⒌",
"6.": "⒍", "7.": "⒎", "8.": "⒏", "9.": "⒐", "hh": "─",
"HH": "━", "vv": "│", "VV": "┃", "3-": "┄", "3_": "┅",
"3!": "┆", "3/": "┇", "4-": "┈", "4_": "┉", "4!": "┊",
"4/": "┋", "dr": "┌", "dR": "┍", "Dr": "┎", "DR": "┏",
"dl": "┐", "dL": "┑", "Dl": "┒", "LD": "┓", "ur": "└",
"uR": "┕", "Ur": "┖", "UR": "┗", "ul": "┘", "uL": "┙",
"Ul": "┚", "UL": "┛", "vr": "├", "vR": "┝", "Vr": "┠",
"VR": "┣", "vl": "┤", "vL": "┥", "Vl": "┨", "VL": "┫",
"dh": "┬", "dH": "┯", "Dh": "┰", "DH": "┳", "uh": "┴",
"uH": "┷", "Uh": "┸", "UH": "┻", "vh": "┼", "vH": "┿",
"Vh": "╂", "VH": "╋", "FD": "╱", "BD": "╲", "TB": "▀",
"LB": "▄", "FB": "█", "lB": "▌", "RB": "▐", ".S": "░",
":S": "▒", "?S": "▓", "fS": "■", "OS": "□", "RO": "▢",
"Rr": "▣", "RF": "▤", "RY": "▥", "RH": "▦", "RZ": "▧",
"RK": "▨", "RX": "▩", "sB": "▪", "SR": "▬", "Or": "▭",
"UT": "▲", "uT": "△", "PR": "▶", "Tr": "▷", "Dt": "▼",
"dT": "▽", "PL": "◀", "Tl": "◁", "Db": "◆", "Dw": "◇",
"LZ": "◊", "0m": "○", "0o": "◎", "0M": "●", "0L": "◐",
"0R": "◑", "Sn": "◘", "Ic": "◙", "Fd": "◢", "Bd": "◣",
"*2": "★", "*1": "☆", "<H": "☜", ">H": "☞", "0u": "☺",
"0U": "☻", "SU": "☼", "Fm": "♀", "Ml": "♂", "cS": "♠",
"cH": "♡", "cD": "♢", "cC": "♣", "Md": "♩", "M8": "♪",
"M2": "♫", "Mb": "♭", "Mx": "♮", "MX": "♯", "OK": "✓",
"XX": "✗", "-X": "✠", "IS": "　", ",_": "、", "._": "。",
'+"': "〃", "+_": "〄", "*_": "々", ";_": "〆", "0_": "〇",
"<+": "《", ">+": "》", "<'": "「", ">'": "」", '<"': "『",
'>"': "』", '("': "【", ')"': "】", "=T": "〒", "=_": "〓",
"('": "〔", ")'": "〕", "(I": "〖", ")I": "〗", "-?": "〜",
"A5": "ぁ", "a5": "あ", "I5": "ぃ", "i5": "い", "U5": "ぅ",
"u5": "う", "E5": "ぇ", "e5": "え", "O5": "ぉ", "o5": "お",
"ka": "か", "ga": "が", "ki": "き", "gi": "ぎ", "ku": "く",
"gu": "ぐ", "ke": "け", "ge": "げ", "ko": "こ", "go": "ご",
"sa": "さ", "za": "ざ", "si": "し", "zi": "じ", "su": "す",
"zu": "ず", "se": "せ", "ze": "ぜ", "so": "そ", "zo": "ぞ",
"ta": "た", "da": "だ", "ti": "ち", "di": "ぢ", "tU": "っ",
"tu": "つ", "du": "づ", "te": "て", "de": "で", "to": "と",
"do": "ど", "na": "な", "ni": "に", "nu": "ぬ", "ne": "ね",
"no": "の", "ha": "は", "ba": "ば", "pa": "ぱ", "hi": "ひ",
"bi": "び", "pi": "ぴ", "hu": "ふ", "bu": "ぶ", "pu": "ぷ",
"he": "へ", "be": "べ", "pe": "ぺ", "ho": "ほ", "bo": "ぼ",
"po": "ぽ", "ma": "ま", "mi": "み", "mu": "む", "me": "め",
"mo": "も", "yA": "ゃ", "ya": "や", "yU": "ゅ", "yu": "ゆ",
"yO": "ょ", "yo": "よ", "ra": "ら", "ri": "り", "ru": "る",
"re": "れ", "ro": "ろ", "wA": "ゎ", "wa": "わ", "wi": "ゐ",
"we": "ゑ", "wo": "を", "n5": "ん", "vu": "ゔ", '"5': "゛",
"05": "゜", "*5": "ゝ", "+5": "ゞ", "a6": "ァ", "A6": "ア",
"i6": "ィ", "I6": "イ", "u6": "ゥ", "U6": "ウ", "e6": "ェ",
"E6": "エ", "o6": "ォ", "O6": "オ", "Ka": "カ", "Ga": "ガ",
"Ki": "キ", "Gi": "ギ", "Ku": "ク", "Gu": "グ", "Ke": "ケ",
"Ge": "ゲ", "Ko": "コ", "Go": "ゴ", "Sa": "サ", "Za": "ザ",
"Si": "シ", "Zi": "ジ", "Su": "ス", "Zu": "ズ", "Se": "セ",
"Ze": "ゼ", "So": "ソ", "Zo": "ゾ", "Ta": "タ", "Da": "ダ",
"Ti": "チ", "Di": "ヂ", "TU": "ッ", "Tu": "ツ", "Du": "ヅ",
"Te": "テ", "De": "デ", "To": "ト", "Do": "ド", "Na": "ナ",
"Ni": "ニ", "Nu": "ヌ", "Ne": "ネ", "No": "ノ", "Ha": "ハ",
"Ba": "バ", "Pa": "パ", "Hi": "ヒ", "Bi": "ビ", "Pi": "ピ",
"Hu": "フ", "Bu": "ブ", "Pu": "プ", "He": "ヘ", "Be": "ベ",
"Pe": "ペ", "Ho": "ホ", "Bo": "ボ", "Po": "ポ", "Ma": "マ",
"Mi": "ミ", "Mu": "ム", "Me": "メ", "Mo": "モ", "YA": "ャ",
"Ya": "ヤ", "YU": "ュ", "Yu": "ユ", "YO": "ョ", "Yo": "ヨ",
"Ra": "ラ", "Ri": "リ", "Ru": "ル", "Re": "レ", "Ro": "ロ",
"WA": "ヮ", "Wa": "ワ", "Wi": "ヰ", "We": "ヱ", "Wo": "ヲ",
"N6": "ン", "Vu": "ヴ", "KA": "ヵ", "KE": "ヶ", "Va": "ヷ",
"Vi": "ヸ", "Ve": "ヹ", "Vo": "ヺ", ".6": "・", "-6": "ー",
"*6": "ヽ", "+6": "ヾ", "b4": "ㄅ", "p4": "ㄆ", "m4": "ㄇ",
"f4": "ㄈ", "d4": "ㄉ", "t4": "ㄊ", "n4": "ㄋ", "l4": "ㄌ",
"g4": "ㄍ", "k4": "ㄎ", "h4": "ㄏ", "j4": "ㄐ", "q4": "ㄑ",
"x4": "ㄒ", "zh": "ㄓ", "ch": "ㄔ", "sh": "ㄕ", "r4": "ㄖ",
"z4": "ㄗ", "c4": "ㄘ", "s4": "ㄙ", "a4": "ㄚ", "o4": "ㄛ",
"e4": "ㄜ", "ai": "ㄞ", "ei": "ㄟ", "au": "ㄠ", "ou": "ㄡ",
"an": "ㄢ", "en": "ㄣ", "aN": "ㄤ", "eN": "ㄥ", "er": "ㄦ",
"i4": "ㄧ", "u4": "ㄨ", "iu": "ㄩ", "v4": "ㄪ", "nG": "ㄫ",
"gn": "ㄬ", "1c": "㈠", "2c": "㈡", "3c": "㈢", "4c": "㈣",
"5c": "㈤", "6c": "㈥", "7c": "㈦", "8c": "㈧", "9c": "㈨",
"ff": "ﬀ", "fi": "ﬁ", "fl": "ﬂ", "ft": "ﬅ", "st": "ﬆ", 
":+": "ً", '"+': "ٌ", "=+": "ٍ", "/+": "َ", "'+": "ُ",
"1+":"ِ", "3+":"ّ", "0+":"ْ", "aS":"ٰ" }


//thank you vv
function replaceDigraphs(inputText, signal) {
  const keys = Object.keys(rfc1345);

  return keys.reduce(
    (res, next) => {
    return res.replaceAll(signal + next, rfc1345[next]);
    }, inputText);
}
