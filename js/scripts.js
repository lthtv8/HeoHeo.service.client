
var _winX = window.innerWidth;
var _winY = window.innerHeight;
$('head').append('<link rel="stylesheet" href="css/style.css" type="text/css" />');
console.log("window resize: _winX=" + _winX + " _winY=" + _winY);
$(window).resize(function () {
	this._winX = window.innerWidth;
	this._winY = window.innerHeight;
	console.log("window resize: _winX=" + _winX + " _winY=" + _winY);
});
//if be using this browser tab
$(window).focus(function () {
	console.log("in");
});
//if be not using this browser tab
$(window).blur(function () {
	console.log("out");
});



class Heo {
	constructor(data) {
		let _heoData = {};

		let _aniNum = 3;
		let _aniArr = [];
		let _aniArrIndex = 0;
		let _aniArrLen = 0;
		let _x = 0;
		let _y = 0;
		//x velocity
		let _vX = 0;
		//y velocity
		let _vY = 0;
		let _timeout = 0;
		let _maxTimeout = 8000;

		//check heo's mother object loaded before or not
		let _isMomLoaded = false;
		//check heo's father object loaded before or not
		let _isDadLoaded = false;
		//heo's mother object
		let _momObj = null;
		//heo's father object
		let _dadObj = null;

		let $_target = null;
		let $_targetImage = null;
		//the distance from browser's left side to left of heo's image
		let _targetX = 0;
		//the distance from browser's bottom side to bottom of heo's image
		let _targetY = 0;
		//the distance from browser's left side to center of heo's image
		let _targetWidth = 0;
		//the distance from browser's bottom side to center of heo's image
		let _targetHeight = 0;

		//interval move
		let _move = null;
		//interval animate
		let _animate = null;
		//true: moving , false:stay
		let _state = true;
		
		//movement speed
		let _speed = 1;
		//affect to size of heo
		let _petWeight = 35;
		//the max of height that heo could be. This thing work on responsive
		let _maxLimitHeight = 0.05;

		let imagePath = "heo/";
		// html object
		let $_htmlInfo;
		let $_htmlInfoContent;

		//heo info
		let name = "";
		let breed;
		let gender;
		let weight;
		let feeling;
		let stamina;

		// let gen=[];
		// let genList=[{},{},{},{},{}];
		// let gen3;
		// let gen4;
		// let gen5;
		// let breed;
		// let breed;
		// let breed;
		// let breed;


		//create heo UI
		let init = () => {
			newTimeout();
			// css position x of heo
			let petLeft = "left:" + (Math.floor((Math.random() * (_winX - 100)) + 50)) + "px;";
			// css position y of heo
			let petBottom = "bottom:" + (Math.floor((Math.random() * (_winY * _maxLimitHeight)))) + "px;";
			// get heo default image
			let petImg = getUrlPath(_heoData.kind + "/0.png");
			let cssPetImage = "border-radius:50%";
			// create css for heo
			let cssPet = "z-index:888888;position:fixed;user-drag: none;user-select: none;-moz-user-select: none;-webkit-user-drag: none;-webkit-user-select: none;-ms-user-select: none;";
			
			//create heo html object with above css
			$_target = $("<div>", { "class": "HEOa", "style": cssPet + petLeft + petBottom });
			//add image to heo html object
			$_target.append('<div class="HEOaa" style="' + cssPetImage + '"><img src="' + petImg + '" style="width:' + _petWeight + 'px;"></div>');
			$_targetImage = $_target.children(".HEOaa").children("img");
			//add heo to browser
			$("html").append($_target);
			
			//get x center of heo
			_targetWidth = $_target.cssInt('width') / 2;
			//get y center of heo
			_targetHeight = $_target.cssInt('height');

			//disable right click and show heo info
			$_target.on("contextmenu", function () {
				showHeoInfo();
				return false;
			});
			//$("#"+target).on( 'dragstart', function() { return false; } );
			// $_target.click(function () { showPetMenu(); });

			//create array of movement images
			petAniInit();
			//heo start running
			run();
		}

		//convert sponse data to internal data
		let initHeoData = () => {
			_heoData.kind = data.kind;
			_heoData.image = imagePath + _heoData.kind + "/0.png"
			_heoData.name = data.name;
			if (data.breed == 0)
				_heoData.breed = "Thuần chủng";
			else
				_heoData.breed = "F" + data.breed;
			_heoData.weight = data.weight + "kg";
			if (data.gender == 0)
				_heoData.gender = "Đực";
			else if (data.gender == 1)
				_heoData.gender = "Cái";
			_heoData.feeling = _feeling[data.feeling];
			_heoData.stamina = data.stamina + "%";

			_heoData.production = data.production;
			_heoData.productionTime = _productionTime[data.production_time];

			_heoData.gene1 = _geneText[data.gene1];
			_heoData.geneData1 = data.gene1;

			_heoData.gene2 = _geneText[data.gene2];
			_heoData.geneData2 = data.gene2;

			_heoData.gene3 = _geneText[data.gene3];
			_heoData.geneData3 = data.gene3;

			_heoData.gene4 = _geneText[data.gene4];
			_heoData.geneData4 = data.gene4;

			_heoData.gene5 = _geneText[data.gene5];
			_heoData.geneData5 = data.gene5;
			console.log(_heoData);
			_heoData.specials = "";
			for (let i = 1; i <= 5; i++) {
				let heoSpecial = data["char" + i];
				if (heoSpecial == "0")
					continue;
				let specials = _specials[heoSpecial];
				_heoData.specials = _heoData.specials + '<div class="INFa1b1baa"> <div class="INFa1b1baab INFa1b1baab-' + specials.class + '" > <div ttinfo="' + specials.info + '">' + specials.text + '</div> </div> </div>';
			}
			_heoData.skills = "";
			for (let i = 1; i <= 5; i++) {
				let heoSkill = data["skill" + i];
				if (heoSkill == "0")
					break;
				let skill = _skills[heoSkill];
				_heoData.skills = _heoData.skills + '<div class="INFa1b1baa"> <div class="INFa1b1baab INFa1b1baab-' + skill.class + '" > <div ttinfo="' + skill.info + '">' + skill.text + '</div> </div> </div>';
			}

			_heoData.momId = data.mom_id;
			_heoData.momName = data.mom_name;
			_heoData.momKind = data.mom_kind;

			_heoData.dadId = data.dad_id;
			_heoData.dadName = data.dad_name;
			_heoData.dadKind = data.dad_kind;

		}
		// start running
		let run = () => {
			setTimeout(function () {
				//set image stay for heo
				petStay();
				//move
				if (_state) {
					// random a position to move;
					newPosition();
					//check moving direction
					petDirection();
					//call and store interval move
					_move = move();
					//call and store interval animate
					_animate = animate();
				}
				_state = !_state;

				//re-call run
				run();
			}, _timeout);
		}

		//convert style px tp int
		jQuery.fn.cssInt = function (prop) {
			return parseInt(this.css(prop), 10) || 0;
		};
		// pet moving
		let move = () => {
			//clear interval move before
			clearInterval(_move);
			// each 50ms heo's position will plus with velocity of x-axis and y-axis
			return setInterval(function () {
				_targetX += _vX;
				_targetY += _vY;
				//check limit postion can move
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
			//
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
			//if velocity of x-axis greater than 0. Heo will look at the right side else the left side
			if (_vX > 0)
				cssRotate = "rotateY(180deg)";
			else
				cssRotate = "rotateY(0deg)";

			$_target.children(".HEOaa").css({ "-ms-transform": cssRotate, "-webkit-transform": cssRotate, "transform": cssRotate });
		}

		//random position to move
		let newPosition = () => {
			//get current x, y of heo(not the center)
			_targetX = $_target.cssInt('left');
			_targetY = $_target.cssInt('bottom');
			// target x to move to
			_x = Math.floor((Math.random() * (_winX + _targetWidth)) + _targetWidth);
			// target y to move to
			_y = Math.floor((Math.random() * (_winY * _maxLimitHeight)));
			// $("#test").css({"left":(_x-2)+"px","bottom":(_y-2)+"px"});
			// console.log(_targetX+"--"+_targetY);
			// $("#test2").css({"left":(_targetX-2)+"px","bottom":(_targetY-2)+"px"});

			//different x and y between the current position to new postion
			let delX = _x - _targetX;
			let delY = _y - _targetY;
			//calculate distance 
			let S = Math.sqrt(delX * delX + delY * delY);
			//calculate time 
			let t = S / _speed;
			//calculate the velocity of x-axis and y-axis
			_vX = delX / t;
			_vY = delY / t;
			//time to finish moving
			_timeout = Math.round(t * 50);
			if (_timeout > _maxTimeout)
				_timeout = _maxTimeout;
			// console.log("(_x=" + _x + ") (_y=" + _y + ") (delX=" + delX + ") (delY=" + delY + ") (_vX=" + _vX + ") (_vY=" + _vY + ") (_targetWidth=" + _targetWidth + ") (_t=" + t + ") (_timeout=" + _timeout + ")");
		}
		// put heo's' images to array
		let petAniInit = () => {
			switch (_heoData.kind) {
				case 1:
					break;
				default:
					break;
			}
			//ex: we have 3 states of heo by images: 1 2 3. we will put them into array follow this order: 1 2 3 2 1
			for (let i = 0; i <= _aniNum; i++)
				_aniArr.push(_heoData.kind + "/" + i + ".png");

			for (let i = _aniNum - 1; i > 1; i--)
				_aniArr.push(_heoData.kind + "/" + i + ".png");

			_aniArrLen = _aniArr.length - 1;
		}

		//make heo no running
		let petStay = () => {
			//clear action moving
			clearInterval(_move);
			//clear image moving
			clearInterval(_animate);
			//set stay image
			$_targetImage.attr('src', getUrlPath(_aniArr[0]));
		}
		let getUrlPath = (url) => {
			return imagePath + url;
		}


		let heoInfoMenu = () => {
			//create menu background object
			let $menu = $('<div class="INFa1a"></div>');
			//init array's' name of tab button's title
			let arr = ["Thông tin", "Trạng thái", "Mã Gen", "Danh hiệu", "Thống kê"];
			arr.forEach(function (title, index) {
				//add tab button to menu object and set click event for that button
				$menu.append($('<div class="INFa1aa">' + title + '</div>').click(function () {
					//remove active class of all button
					$menu.children(".INFa1aa").removeClass("INFa1aa-0");
					//only set clicked button is active
					$(this).addClass("INFa1aa-0");
					
					//get all content boxes when clicking
					let $contentChild = $_htmlInfoContent.children("div");
					//hide those boxes
					$contentChild.hide();
					//only show the content box suit clicked button
					$contentChild.eq(index).show();
					
					//hide scroll bar of all content boxes
					$(".nicescroll-rails").hide();
					//only show scroll bar of the content box suit clicked button
					let scrollId = $contentChild.eq(index).find(".scroll-id").val();
					$("#ascrail" + scrollId).show();
					// $("#ascrail"+scrollId+"-hr").show();
				}));
			});
			//set first button is active tab
			$menu.children(".INFa1aa").first().addClass("INFa1aa-0");
			return $menu;
		}

		let heoInfoMenuContent1 = () => {
			// console.log(data);
			return '<div class="INFa1b1a"> <div class="INFa1b1aa"> <img class="INFa1b1aaa" src="' + _heoData.image + '"> <div class="INFa1b1aab" ' + _ttInfo.changeName + '> <a class="INFa1b1aaba">' + _heoData.name + '</a> </div> </div> <div class="INFa1b1ab"> <div class="INFa1b1aba"> <div class="INFa1b1abaa"> <span ' + _ttInfo.breed + '>' + _heoText.breed + '</span> <a>' + _heoData.breed + '</a> </div> <div class="INFa1b1abaa"> <span ' + _ttInfo.weight + '>' + _heoText.weight + '</span> <a>' + _heoData.weight + '</a> </div> <div class="INFa1b1abaa"> <span ' + _ttInfo.production + '>' + _heoText.production + '</span> <div class="INFa1b1abaaa"> ' + _heoData.production + '<img src="images/other/soul.png">/' + _heoData.productionTime + ' </div> </div> </div> <div class="INFa1b1aba"> <div class="INFa1b1abaa"> <span ' + _ttInfo.gender + '>' + _heoText.gender + '</span> <a>' + _heoData.gender + '</a> </div> <div class="INFa1b1abaa"> <span ' + _ttInfo.feeling + '>' + _heoText.feeling + '</span> <a>' + _heoData.feeling + '</a> </div> <div class="INFa1b1abaa"> <span ' + _ttInfo.stamina + '>' + _heoText.stamina + '</span> <a>' + _heoData.stamina + '</a> </div> </div> </div> </div> <div class="INFa1b1b"> <div class="INFa1b1ba INFa1b1ba-a"> <div class="INFa1b1bab" ' + _ttInfo.gene + '>' + _heoText.gene + '</div> <div class="INFa1b1baa"> <div class="INFa1b1baab"> <span ' + _ttInfo.gene1 + '>' + _heoText.gene1 + '</span> <a class="INFa1b1baaba-' + _heoData.geneData1 + '">' + _heoData.gene1 + '</a> </div> </div> <div class="INFa1b1baa"> <div class="INFa1b1baab"> <span ' + _ttInfo.gene2 + '>' + _heoText.gene2 + '</span> <a class="INFa1b1baaba-' + _heoData.geneData2 + '">' + _heoData.gene2 + '</a> </div> </div> <div class="INFa1b1baa"> <div class="INFa1b1baab"> <span ' + _ttInfo.gene3 + '>' + _heoText.gene3 + '</span> <a class="INFa1b1baaba-' + _heoData.geneData3 + '">' + _heoData.gene3 + '</a> </div> </div> <div class="INFa1b1baa"> <div class="INFa1b1baab"> <span ' + _ttInfo.gene4 + '>' + _heoText.gene4 + '</span> <a class="INFa1b1baaba-' + _heoData.geneData4 + '">' + _heoData.gene4 + '</a> </div> </div> <div class="INFa1b1baa"> <div class="INFa1b1baab"> <span ' + _ttInfo.gene5 + '>' + _heoText.gene5 + '</span> <a class="INFa1b1baaba-' + _heoData.geneData5 + '">' + _heoData.gene5 + '</a> </div> </div> </div> <div class="INFa1b1ba INFa1b1ba-b"> <div class="INFa1b1bab" ' + _ttInfo.special + '>' + _heoText.special + '</div>' + _heoData.specials + '</div> <div class="INFa1b1ba INFa1b1ba-c"> <div class="INFa1b1bab" ' + _ttInfo.skill + '>' + _heoText.skill + '</div>' + _heoData.skills + '</div> </div>';
		}
		let heoInfoMenuContent2 = () => {
			let $heoInfoContent = $('<div class="INFa1b4a"></div>');
			let arr = data.event.split(",");
			arr.forEach(function (value) {
				let feelingEvent = _feelingEvents[value];
				$heoInfoContent.append('<div class="INFa1b4aa"> <img id="INFa1b4aaa" class="INFa1b4aaa" src="' + feelingEvent.img + '"> <div class="INFa1b4aab"> <div id="INFa1b4aaba" class="INFa1b4aaba">' + feelingEvent.tit + '</div> <div id="INFa1b4aabc" class="INFa1b4aabc">' + feelingEvent.des + '</div> <div class="INFa1b4aabd">' + feelingEvent.aff + '</div> </div> </div>');
			});
			return $heoInfoContent;
		}
		let heoInfoMenuContent3 = () => {
			let $totalContent3 = $("<div></div>");
			let $heoInfoContent = $('<div class="INFa1b3a"></div>');
			let $heoMom = $('<div class="INFa1b3aa"> <div class="INFa1b3aaa">Mẹ Heo</div> <div class="INFa1b1aa"> <img class="INFa1b1aaa" src="' + imagePath + _heoData.momKind + '/0.png"> <div class="INFa1b1aab"> <a id="INFa1b1aaba" class="INFa1b1aaba">' + _heoData.momName + '</a> </div> </div> </div>');
			let $heoDad = $('<div class="INFa1b3aa"> <div class="INFa1b3aaa">Cha Heo</div> <div class="INFa1b1aa"> <img class="INFa1b1aaa" src="' + imagePath + _heoData.dadKind + '/0.png"> <div class="INFa1b1aab"> <a id="INFa1b1aaba" class="INFa1b1aaba">' + _heoData.dadName + '</a> </div> </div> </div>');
			$heoMom.click(function () {

				console.log("-------------------");
				if (!_isMomLoaded) {
					_isMomLoaded = true; console.log("falseeeeee");
					_momObj
				}
				console.log("-------------------");
			});
			$heoDad.click(function () {
				console.log("-------------------");
				if (!_isDadLoaded) {
					_isDadLoaded = true; console.log("falseeeeee");
					_dadObj
				}
				console.log("-------------------");
			});

			$heoInfoContent.append($heoMom);
			$heoInfoContent.append($heoDad);

			let $heoGene = $('<div class="INFa1b3b"><div class="INFa1b3ba"></div></div>').children('.INFa1b3ba');

			for (let i = 1; i <= 5; i++) {
				$heoGene.append('<div class="INFa1b3baa INFa1b3baa-0"> <div class="INFa1b3baaa INFa1b3baaa-' + _heoData["geneData" + i] + '">' + _heoText["gene" + i] + ': ' + _heoData["gene" + i] + '</div> <div class="INFa1b3baab"> <div class="INFa1b3baaba"> <span ' + _ttInfo.geneShown + '>Gen trội:</span> <a ttInfo="' + _ttInfo.geneShown + '" class="INFa1b3baaba INFa1b3baaba-8">Đẻ nhanh 18</a> </div> <div class="INFa1b3baaba"> <span ' + _ttInfo.geneHidden + '>Gen lặn:</span> </div> </div> </div>');
			}
			$totalContent3.append($heoInfoContent).append($heoGene.parent());
			return $totalContent3.html();
		}
		let heoInfoContent = () => {
			$_htmlInfoContent.children().eq(0).html(heoInfoMenuContent1());
			$_htmlInfoContent.children("div").eq(0).css({ "display": "block" });
			$_htmlInfoContent.children().eq(1).html(heoInfoMenuContent2());
			$_htmlInfoContent.children().eq(2).html(heoInfoMenuContent3());
			return $_htmlInfoContent;
		}

		let showHeoInfo = () => {
			$_htmlInfo = $('<div class="INFa1 INF1"></div>');
			$_htmlInfoContent = $('<div class="INFa1b"><div>asdfasdf</div><div></div><div></div><div></div><div></div></div>');
			$_htmlInfo.prepend(heoInfoMenu());
			$_htmlInfo.append(heoInfoContent());
			$("html").append($_htmlInfo);
			addNiceScroll(".INFa1b3b");
			addNiceScroll(".INFa1b4a");
		}
		
		initHeoData();
		init();
	}
}

var _niceScroll_index = 1999;
//plugin add nice scroll bar
var addNiceScroll = (target) => {
	$(target).niceScroll({
		cursorwidth: 8,
		cursoropacitymin: 0.4,
		cursorcolor: '#686868',
		cursorborder: 'none',
		cursorborderradius: 4,
		autohidemode: 'leave',
		horizrailenabled: false
	});
	$(target).append('<input class="scroll-id" type="hidden" value="' + (++_niceScroll_index) + '">');
}

var _ttInfo, _heoText;
var _feeling = ["Tồi tệ", "Rất buồn", "Buồn", "Bình thường", "Vui", "Rất vui", "Hạnh phúc"];
var _geneText = ["", "Khủng khiếp", "Rất Tệ", "Tệ", "Trung bình", "Tốt", "Rất Tốt", "Hoàn hảo", ""];
var _specials = [{}, { "class": "1", "info": "", "text": "Rùa bò" }, { "class": "2", "info": "", "text": "chậm" }, { "class": "3", "info": "", "text": "nhanh" }, { "class": "4", "info": "", "text": "Siêu tốc độ" }, { "class": "3", "info": "", "text": "mập" }];
var _skills = [{}, { "class": "1", "info": "", "text": "Rùa bò" }, { "class": "2", "info": "", "text": "chậm" }, { "class": "3", "info": "", "text": "nhanh" }, { "class": "4", "info": "", "text": "Siêu tốc độ" }, { "class": "3", "info": "", "text": "mập" }];
var _productionTime = ["15m", "30m", "1h", "2h", "4h", "8h", "12h", "1d"];
var _feelingEventData = [{ "type": 0, "data": 10 }, { "type": 1, "data": 20 }, { "type": 2, "data": 30 }];
var _feelingEvents = [{ "img": "", "tit": "asdasdas", "des": "aaaaaaaaaaa", "aff": "" + _feelingEventData[0].data + "%" }, { "img": "", "tit": "Không hài lòng đồng đội", "des": "Không vui với HEO MỌI", "aff": "" + _feelingEventData[0].data + "%" }, { "img": "", "tit": "Chuồng quá hẹp", "des": "Quá đông heo làm heo không có chổ thở", "aff": "" + _feelingEventData[1].data + "%" }, { "img": "", "tit": "Ăn không no", "des": "Cho ăn ít quá", "aff": "" + _feelingEventData[2].data + "%" }];


// menu text
let initJsonData = () => {
	_ttInfo = JSON.parse('{"breed":"Giống thuần chủng là giống tốt nhất.","weight":"Cân Nặng ảnh làm chậm tốc độ của heo nhưng tăng khả năng sản xuất","production":"khả năng sản xuất của heo","gender":"Giới tính của heo. Heo đực có thể đem đi cho giống. Heo cái nhận giống và sinh sản","feeling":"Heo càng hạnh phúc thì cách chỉ số sẽ được tăng thêm","stamina":"Thể lực sẽ tiêu heo khi Thi đấu, luyện tập...","gene":"Mã gen của heo","gene1":"Gen sinh sản","gene2":"Gen tốc độ","gene3":"Gen thể lực","gene4":"Gen thể trọng","gene5":"Gen đặc tính","special":"Những đặc tính của heo","skill":"Kỹ năng của heo","geneShown":"","geneHidden":""}');
	_heoText = JSON.parse('{"breed":"Giống:","weight":"Nặng:","production":"Năng suất:","productionTime":"giờ","gender":"Giới tính:","feeling":"Tâm trạng:","stamina":"Thể lực:","gene":"GEN di truyền","gene1":"Sinh sản:","gene2":"Tốc độ:","gene3":"Thể lực:","gene4":"Thể trọng:","gene5":"Đặc tính","special":"Đặc tính","skill":"Kỹ năng"}');
	$.each(_ttInfo, function (key, value) {
		_ttInfo[key] = "ttInfo=\"" + value + "\"";
	});

}

initJsonData();
var _domain = { "aidia": "http://localhost/HeoHeo.service.server/" };
var _url = { "getHeoData": _domain.aidia + "heo/data" };


$(document).ready(function () {
	loadData();
	// loadMenu();
});
let loadMenu = () => {
	let $parent = $('<div class="INF1"></div>');
	let $menu = $('<div class="heo_menu"></div>');
	$parent.append($menu);
	let arr = ["Danh sách Heo", "Túi đồ", "Kiến trúc", "Huấn luyện", "Danh hiệu", "Nghiên cứu"];
	let ttinfo = ["Danh sách Heo", "Túi đồ", "Kiến trúc", "Huấn luyện", "Danh hiệu", "Nghiên cứu"];

	let image_menu = "images/menu/";
	arr.forEach(function (title, index) {
		$menu.append($('<div class="menu_item" ttInfo="'+ttinfo[index]+'"> <img src="' + image_menu + (index + 1) + '.png"> <div>' + title + '</div> </div>').click(function () {
			switch (index) {
				case 0:
					$parent.html(menu1());
					break;
				case 1:
					$parent.html(menu2());
					break;
				case 2:
					$parent.html(menu3());
					break;
				case 3:
					$parent.html(menu4());
					break;
				case 4:
					$parent.html(menu5());
					break;
				case 5:
					$parent.html(menu6());
					break;
			}
		}));
	});
	$("body").append($parent);
}

let menu1 = () => {
	let html = "";

	return html;
}
let menu2 = () => {
	let html = "";

	return html;
}
let menu3 = () => {
	let html = "";

	return html;
}
let menu4 = () => {
	let html = "";

	return html;
}
let menu5 = () => {
	let html = "";

	return html;
}
let menu6 = () => {
	let html = "";

	return html;
}


let loadData = () => {
	//test token
	let data_post = { "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsImhlb19pZHMiOlsyLDBdfQ.QvX-IFpNbZoZq5LneeefKcCwRcNjBpljnZ3_cyaoPjA" };
	//request to get data from api
	$.post(_url.getHeoData, data_post, function (heos) {
		console.log("------response data-------");
		console.log(heos);
		console.log("-------------");
		
		//call heo by response data
		heos.forEach(function (heo) {
			let h = new Heo(heo);
			// h.showHeoInfo();
		});
	});
	//pet.showHeoInfo();

	// if (typeof(Storage) !== "undefined") {
	// 	console.log("Code for localStorage/sessionStorage");
	// 	if(localStorage.getItem("lastname", "Smith") == null){
	// 		console.log("----null");localStorage.setItem("lastname", "Smith");
	// 	}
	// 	console.log("++++"+localStorage.getItem("lastname", "Smith"))

	// } else {
	// 	console.log("Sorry! No Web Storage support.");
	// }
}