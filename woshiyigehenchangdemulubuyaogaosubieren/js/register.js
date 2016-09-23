areaList=$.ajax({url:"/Employee_Register/backend/getcitylist.php",async:false});
areaList=$.parseJSON(areaList.responseText);

function show_citys() {
	var city = document.getElementById("regcity");
	city.innerHTML = "";
	for (var key in areaList) {
		city.add(new Option(key,key));
	}
}
function city_change(v) {
	var country = document.getElementById("regcountry");
	country.innerHTML = "";
	eval("var countrys = areaList[v];");
	for(var i=0;i<countrys.length;i++){
		country.add(new Option(countrys[i],countrys[i]));
	}
}
function checkMobile() {
	phone = document.getElementById("phone").value;
	if(phone == ""){
        alert("手机号不能为空！");
    }
    else{
        var re = /^1\d{10}$/
        if ( ! re.test(phone)){
			alert("手机号格式错误！");
		}
	}
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

$("#regbtn").on('click', function(){
	//注册按钮
	if( confirm("请注意，系统已经根据ip记录您的分公司或部门，并可手动定位到个人，请勿乱填，修改内容请点击‘取消’按钮，提交点击‘确定’") ){
		if ( confirm("请再检查一遍您输入的内容，‘确定’提交，‘取消’重新编辑") ){
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
	}
});

$('.nav-tabs a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});
