var _winX = window.innerWidth;
var _winY = window.innerHeight;
$('head').append('<link rel="stylesheet" href="css/style.css" type="text/css" />');
console.log("window resize: _winX=" + _winX + " _winY=" + _winY);
$(window).resize(function () {
	this._winX = window.innerWidth;
	this._winY = window.innerHeight;
	console.log("window resize: _winX=" + _winX + " _winY=" + _winY);
});
$(window).focus(function() {
    console.log ("in");
});

$(window).blur(function() {
    console.log ("out");
});


class Pet {
	constructor(data) {

		let _data = data;
		let _aniNum = 3;
		let _aniArr = [];
		let _aniArrIndex = 0;
		let _aniArrLen = 0;
		let _x = 0;
		let _y = 0;
		let _vX = 0;
		let _vY = 0;
		let _timeout = 0;
		let _maxTimeout = 8000;

		let $_target = null;
		let $_targetImage = null;
		let _targetX = 0;
		let _targetY = 0;
		let _targetWidth = 0;
		let _targetHeight = 0;

		let _move = null;
		let _animate = null;
		let _state = true;

		// let _id = 0;
		let _no = _data["type"];
		let _speed = 1;
		let _petWeight = 35;
		let _maxLimitHeight = 0.05;

		let imagePath= "heo/";
		
		let init = () => {
			newTimeout();
			let petLeft = "left:" + (Math.floor((Math.random() * (_winX - 100)) + 50)) + "px;";
			let petBottom = "bottom:" + (Math.floor((Math.random() * (_winY * _maxLimitHeight)))) + "px;";
			let petImg = getUrlPath(_no + "/0.png");
			let cssPetImage = "border-radius:50%";
			let cssPet = "z-index:888888;position:fixed;user-drag: none;user-select: none;-moz-user-select: none;-webkit-user-drag: none;-webkit-user-select: none;-ms-user-select: none;";

			$_target = $("<div>", { "class": "HEOa", "style": cssPet + petLeft + petBottom });
			$_target.append('<div class="HEOaa" style="' + cssPetImage + '"><img src="' + petImg + '" style="width:' + _petWeight + 'px;"></div>');
			$_targetImage = $_target.children(".HEOaa").children("img");
			$("html").append($_target);

			_targetWidth = $_target.cssInt('width') / 2;
			_targetHeight = $_target.cssInt('height');

			$_target.on("contextmenu", function () {
				LeftClick();
				return false;
			});
			//$("#"+target).on( 'dragstart', function() { return false; } );
			$_target.click(function () { showPetMenu(); });
			petAniInit();
			run();
		}
		// start pet
		let run = () => {
			setTimeout(function () {
				let state = Math.floor((Math.random() * 2));
				//stay
				petStay();
				//move
				// new Position;
				newPosition();
				if (_state) {
					//check moving direction
					petDirection();
					_move = move();
					_animate = animate();
				}
				_state = !_state;
				run();
			}, _timeout);
		}

		//convert style px tp int
		jQuery.fn.cssInt = function (prop) {
			return parseInt(this.css(prop), 10) || 0;
		};
		// pet moving
		let move = () => {
			clearInterval(_move);
			return setInterval(function () {
				_targetX += _vX;
				_targetY += _vY;
				limitPosition();
				$_target.css({ 'left': _targetX, 'bottom': _targetY });
			}, 50);
		}

		//pet animation
		let animate = () => {
			_aniArrIndex = 1;
			return setInterval(function () {
				$_targetImage.attr('src', getUrlPath(_aniArr[_aniArrIndex % _aniArrLen + 1]));
				_aniArrIndex++;
			}, 200 / _speed);

		}

		//limit conllision 
		let limitPosition = () => {
			if (_targetX < -_targetWidth) {
				// petStay();
				// _x = -_x;
				_targetX = -_targetWidth;
				// console.log("------------limit left-------------");
			}
			else if (_targetX > _winX - _targetWidth) {
				// petStay();
				// _x = -_x;
				_targetX = _winX - _targetWidth;
				// console.log("------------limit right-------------");
			}
		}
		let newTimeout = () => {
			_timeout = Math.floor((Math.random() * 10) + 10) * 100;
		}

		//pet rotation when change direction
		let petDirection = () => {
			// WebkitTransform Code for Safari
			// msTransform Code for IE9
			// transform Standard syntax
			let cssRotate = "";
			if (_vX > 0)
				cssRotate = "rotateY(180deg)";
			else
				cssRotate = "rotateY(0deg)";
			$_target.children(".HEOaa").css({ "-ms-transform": cssRotate, "-webkit-transform": cssRotate, "transform": cssRotate });
		}

		//random position to move
		let newPosition = () => {
			_targetX = $_target.cssInt('left');
			_targetY = $_target.cssInt('bottom');
			_x = Math.floor((Math.random() * (_winX + _targetWidth)) + _targetWidth);
			_y = Math.floor((Math.random() * (_winY * _maxLimitHeight)));
			// $("#test").css({"left":(_x-2)+"px","bottom":(_y-2)+"px"});
			// console.log(_targetX+"--"+_targetY);
			// $("#test2").css({"left":(_targetX-2)+"px","bottom":(_targetY-2)+"px"});
			let delX = _x - _targetX;
			let delY = _y - _targetY;
			let S = Math.sqrt(delX * delX + delY * delY);
			let t = S / _speed;
			_vX = delX / t;
			_vY = delY / t;
			_timeout = Math.round(t * 50);
			if (_timeout > _maxTimeout)
				_timeout = _maxTimeout;
			// console.log("(_x=" + _x + ") (_y=" + _y + ") (delX=" + delX + ") (delY=" + delY + ") (_vX=" + _vX + ") (_vY=" + _vY + ") (_targetWidth=" + _targetWidth + ") (_t=" + t + ") (_timeout=" + _timeout + ")");
		}
		// get pet image to array
		let petAniInit = () => {
			switch (_no) {
				case 1:
					break;
				default:
					break;
			}

			for (let i = 0; i <= _aniNum; i++)
				_aniArr.push(_no + "/" + i + ".png");

			for (let i = _aniNum - 1; i > 1; i--)
				_aniArr.push(_no + "/" + i + ".png");
			_aniArrLen = _aniArr.length - 1;

		}
		let petStay = () => {
			clearInterval(_move);
			clearInterval(_animate);
			$_targetImage.attr('src', getUrlPath(_aniArr[0]));
		}
		let getUrlPath = (url) =>{
			return chrome.extension.getURL(imagePath+url);
		}

		init();
	}
}
// (_x=592) (_y=10) (delX=358.99995267366273) (delY=-3.9408210620704462) (_vX=0.9999397557772052) (_vY=-0.010976557576180095) (_targetWidth=17.5) (_t=359.0215816498158)

let pet = new Pet({"type":"1"});
let pet1 = new Pet({"type":"2"});
let pet2 = new Pet({"type":"3"});