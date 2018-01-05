/*console.log ("script is happening in page");
    $(window).ready(function () {console.log("window.ready is happening");});
    $(document).ready(function () {console.log("document.ready is happening");});*/
var i=0;
/*window.onload = function() {
	i++;
	document.write(i);
}*/

console.log ("script is happening in page");



$('head').append('<link rel="stylesheet" href="css/style.css" type="text/css" />');
$( window ).resize(function() {
	this.winX = window.innerWidth;
	console.log ("resize");
});

$(window).focus(function() {
    console.log ("in");
});

$(window).blur(function() {
    console.log ("out");
});



	//document.write("");
	//document.body.innerHTML = '<div style="width:100px;height:100px;background:red;border-radius:50%;position:fixed;bottom:100px;left:100px;">asdasdasdasdsadas</div>';
	
	

	//$("html").append('<div id="b" style="position:fixed;bottom:0px;left:600px;"><div class="image"><img src="" style="width:50px;height:50px;animation-direction:reverse;"></div>');
	//$("html").append('<div id="c" style="position:fixed;bottom:0px;left:600px;"><div class="image"><img src="" style="width:50px;height:50px;animation-direction:reverse;"></div>');
	//$("html").append('<div id="d" style="position:fixed;bottom:0px;left:600px;"><div class="image"><img src="" style="width:50px;height:50px;animation-direction:reverse;"></div>');
	//$("html").append('<div id="e" style="position:fixed;bottom:0px;left:600px;"><div class="image"><img src="" style="width:50px;height:50px;animation-direction:reverse;"></div>');
	//$('#elem').cssInt('top');
	var css_pet = "z-index:888888;position:fixed;bottom:0px;user-drag: none;user-select: none;-moz-user-select: none;-webkit-user-drag: none;-webkit-user-select: none;-ms-user-select: none;";
	var css_pet_image = "border-radius:50%";
	var css_pet_ = "";
	
	
	/*var css_pet_status= "position:absolute;left:50%;top:0px;transform:translate(-50%,-100%);white-space: nowrap;";
	var css_pet_status_button="background:Red;border-radius:50%;height:38px;width:38px; display:inline-block; vertical-align:middle;";
	
	
	$("#a").prepend('<div class="ah_a_status" style="'+css_pet_menu+'"><img class="ah_a_status_button1" src="" style="'+css_pet_status_button+'"><img class="ah_a_status_button1" src="" style="'+css_pet_status_button+'"></div>');
	*/
jQuery.fn.cssInt = function (prop) {
    return parseInt(this.css(prop), 10) || 0;
};



var winX = window.innerWidth;
//var petY = 0;


//////////////////////////////////////////
var petSys = [];
var petStat = [];
var plants = [];
var enemys=[];

$(document).ready(function () {
	for(i=1;i<=9;i++){
		petIni(i);
	}
});



function petIni(no){
	//var no = 3;
	var id = petSys.length;
	var target = "ah_a"+id;
	
	var pet_weight = 58;
	var pet_img = "pets/p"+no+"/0.png";
	var pet_left = "left:"+(Math.floor((Math.random() * (winX-100))+50))+"px;";
	
	petSys.push([target,no,null,null,null,null]);
	petStat.push([2]);
	
	$("html").append('<div id="'+target+'" class="ah_a" style="'+css_pet+pet_left+'"><div class="ah_a_image" style="'+css_pet_image+'"><img src="'+pet_img+'" style="width:'+pet_weight+'px;"></div></div>');
	
	petMove(id);
	
	$("#"+target).on("contextmenu",function(){
		petLeftClick(id);
		return false;
    });
	//$("#"+target).on( 'dragstart', function() { return false; } );
	$("#"+target).click(function(){showPetMenu();});
	
	
	
	

	
}


function showPetMenu(){
	
}



function petMove(id){
	
	var target = "#"+petSys[id][0];
	var no = petSys[id][1];
	var timeout = Math.floor((Math.random() * 10)+10)*100;
	
	var speed = petStat[id][0];
	
	//console.log(timeout);
	petSys[id][4] = setTimeout(function(){
		
		//console.log("*");
		var state = Math.floor((Math.random() * 2));
		clearInterval(petSys[id][3]);
		if(state){
			
			var targetX = $(target).cssInt('left');
			var targetY = $(target).cssInt('bottom');
			var targetWeight = $(target).cssInt('weight')/2;
			if(targetX<0+targetWeight){
				moving(id,speed,0);
			}
			else if (targetX>winX+targetWeight){
				moving(id,-speed,0);
			}
			else{
				var to = Math.floor((Math.random() * winX) + 1);
				
				if(to<$(target).cssInt('left'))
					moving(id,-speed,0);
				else if(to>$(target).cssInt('left'))
					moving(id,speed,0);
			}
			petAni(id,speed,1);
			
			
		}
		else{
			petAni(id,speed,0);
		}
		petMove(id);
	}, timeout);
		
}
function petLeftClick(id){
	clearInterval(petSys[id][3]);
	clearTimeout(petSys[id][4]);
	clearTimeout(petSys[id][5]);
	
	var target = "#"+petSys[id][0];
	var no = petSys[id][1];
	var timeout = Math.floor((Math.random() * 15)+15)*100;
	
	var speed = petStat[id][0]+2;
	
		
	var w = window.innerWidth;
	var to = Math.floor((Math.random() * w) + 1);
	
	petAni(id,speed,1);
	
	if(to<$(target).cssInt('left'))
		moving(id,-speed,0);
	else if(to>$(target).cssInt('left'))
		moving(id,speed,0);	
	
	
	
	
		//console.log("1");
	//console.log(timeout);
	petSys[id][5] = setTimeout(function(){
		//console.log("2");
		petMove(id);
	}, timeout);
		
}
function petAni(id,speed,state) {
	
	var target = "#"+petSys[id][0];
	var no = petSys[id][1];
	var arr = getpet(no);
	var img = $(target).children('.ah_a_image').children('img');
	var i = 1;
	var len = arr.length-1;
	
	
	clearInterval(petSys[id][2]);
	if(state){
		petSys[id][2] = setInterval(function(){
			$(img).attr('src',"pets/"+arr[i%len+1]);
			i++;
		}, 200/speed);
	}
	else {
		$(img).attr('src',"pets/"+arr[0]);
	}
}

//clearInterval();



function getpet(no){
	arr = [];
	n=3;
	switch(no){
		case 1:
			break;
		default:
			break;
	}
	
	for(i=0;i<=n;i++)
		arr.push("p"+no+"/"+i+".png");
	
	for(i=n-1;i>1;i--)
		arr.push("p"+no+"/"+i+".png");
	
	return arr;
}



function moving(id,x,y){
	var target = petSys[id][0];
	
	var htmlTarget = document.getElementById(target).querySelector(".ah_a_image").style;
	if(x>0){
		// Code for Safari
		htmlTarget.WebkitTransform = "rotateY(180deg)"; 
		// Code for IE9
		htmlTarget.msTransform = "rotateY(180deg)"; 
		// Standard syntax
		htmlTarget.transform = "rotateY(180deg)";
	}
	else{
		
		// Code for Safari
		htmlTarget.WebkitTransform = "rotateY(0deg)"; 
		// Code for IE9
		htmlTarget.msTransform = "rotateY(0deg)"; 
		// Standard syntax
		htmlTarget.transform = "rotateY(0deg)";
	}
	var target = "#"+target;
	var targetX = $(target).cssInt('left');
	var targetY = $(target).cssInt('bottom');
	var targetWeight = $(target).cssInt('weight')/2;
	petSys[id][3] = setInterval(function(){
		targetX += x;
		targetY += y;
		$(target).css({'left':targetX,'bottom':targetY});
		if(targetX<0+targetWeight ||  targetX>winX+targetWeight){
			console.log("-------------------------");
			clearInterval(petSys[id][3]);
			clearTimeout(petSys[id][4]);
			clearTimeout(petSys[id][5]);
			petMove(id);
		}
		
			
	}, 40);
	
	
	
}

function conliLim(id,speed){
	clearInterval(petSys[id][3]);
	clearTimeout(petSys[id][4]);
	clearTimeout(petSys[id][5]);
	var state = Math.floor((Math.random() * 2));
	clearInterval(petSys[id][3]);
	if(state){
		var w =window.innerWidth;
		var to = Math.floor((Math.random() * w) + 1);
		
		petAni(id,Math.abs(speed),1);
		moving(id,speed,0);
	}
	else 
		petAni(id,Math.abs(speed),0);
	
	petSys[id][4] = setTimeout(function(){
		
		//console.log("*");
		
		petMove(id);
	}, 2000);
	
}


/*setInterval(function(){
	console.log ("+");
	
	}, 500);


setInterval(function(){
	console.log ("=");
	
	}, 500);*/








