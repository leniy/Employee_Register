areaList=$.ajax({url:"/Employee_Register/backend/getcitylist.php",async:false});
areaList=$.parseJSON(areaList.responseText);

function show_citys() {
	var city = document.getElementById("regcity");
	city.innerHTML = "";
	city.add(new Option("***请选择市公司***",""));
	for (var key in areaList) {
		city.add(new Option(key,key));
	}
}
function city_change(v) {
	var country = document.getElementById("regcountry");
	country.innerHTML = "";
	var countrys = areaList[v];
	country.add(new Option("***请选择县区公司***",""));
	for(var i=0;i<countrys.length;i++){
		country.add(new Option(countrys[i],countrys[i]));
	}
}
function checkMobile() {
	phone = document.getElementById("phone").value;
	if(phone == ""){
        layer.open({content: '手机号不能为空！',btn: '我知道了'});
    }
    else{
        var re = /^1\d{10}$/
        if ( ! re.test(phone)){
			layer.open({content: '手机号格式错误！',btn: '我知道了'});
		}
	}
}
$("#regbtn").on('click', regfunc1);//注册按钮
function regfunc1() {
	layer.open({
		content: '请注意，系统已经根据ip记录您的分公司或部门，并可手动定位到个人，请勿乱填'
		,btn: ['下一步', '我要修改']
		,yes: regfunc2
	});
}
function regfunc2() {
	layer.open({
		content: '请再检查一遍您输入的内容'
		,btn: ['下一步', '我要修改']
		,yes: regfunc3
	});
}
function regfunc3() {
	layer.open({
		content: '第三次提醒，请再检查一遍您输入的内容<br />输入错误不可修改，需要向省公司递交正式申请！！！！'
		,btn: ['下一步', '我要修改']
		,yes: regfunc4
	});
}
function regfunc4() {
	layer.open({
		content: '==========<br />本人承诺：<br />我确认输入的信息无误，由于信息错误造成的一切后果自负<br />=========='
		,btn: ['提交数据', '我要修改']
		,yes: function(index){
			layer.close(index);
			regfunc5();
		}
	});
}
function regfunc5() {
	$.ajax({
			url : '/Employee_Register/backend/leniy_register.php' + window.location.search,
			type : 'POST',
			dataType : 'json',
			data : JSON.stringify({
				"type"  : "reg",
				"name"  : $("#name").val(),
				"phone" : $("#phone").val(),
				"city" : $("#regcity").val(),
				"country" : $("#regcountry").val()
			}),
			contentType : "application/json",
			async : true,
			success : function(data) {
					$("#results").html(data["message"]);
			},
			error : function(e) {
				$("#results").html(e.responseText);
			}
	});
}

$("#checkbtn").on('click', function(){
	//搜索按钮
	$.ajax({
			url : '/Employee_Register/backend/leniy_register.php' + window.location.search,
			type : 'POST',
			dataType : 'json',
			data : JSON.stringify({
				"type"  : "search",
				"name"  : $("#name").val(),
				"phone" : $("#phone").val()
			}),
			contentType : "application/json",
			async : true,
			success : function(data) {
				if( "error" == data["status"])
					$("#results").html(data["message"]);
				if( "success" == data["status"])
					temp = data["message"];
					tempstr = '<table class="table table-hover">';
					tempstr += '<thead><tr><th>查询项目</th><th>结果</th></tr></thead>';
					tempstr += '<tbody>';
					tempstr += '<tr><td>工号</td><td>'+temp["id"]+'</td></tr>';
					tempstr += '<tr><td>姓名</td><td>'+temp["name"]+'</td></tr>';
					tempstr += '<tr><td>手机</td><td>'+temp["phone"]+'</td></tr>';
					tempstr += '<tr><td>市公司</td><td>'+temp["city"]+'</td></tr>';
					tempstr += '<tr><td>县公司/市部门</td><td>'+temp["country"]+'</td></tr>';
					tempstr += '<tr><td>注册时间</td><td>'+temp["createdate"]+'</td></tr>';
					tempstr += '<tr><td>来源ip</td><td>'+temp["regsourceip"]+'</td></tr>';
					tempstr += '</tbody></table>';
					$("#results").html(tempstr);
			},
			error : function(e) {
				$("#results").html(e.responseText);
			}
		});
});

$('.nav-tabs a').click(function (e) {
	e.preventDefault();
	$(this).tab('show');
});

$(document).ready(function() {
	show_citys();
});
