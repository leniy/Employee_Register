<?php
/*
	Plugin Name:Employee Register后台市县json接口
	Plugin URI: http://leniy.org
	Version: 0.0.1
	Author: Leniy
	Author URI: http://leniy.org/
	声明：Leniy版权所有，严禁任何人抄袭使用类似的接口通讯方式、数据库组织结构、功能逻辑
*/
header('Content-Type:text/json; charset=utf-8');
include __DIR__ . '/config/leniy_config.php';//配置文件

//打开此页面，直接返回市县的json列表

try { //建立持久化的PDO连接
	$dsn = "$db_type:host=$db_host;dbname=$db_name;charset=$db_code";
	$pdo = new PDO($dsn, $db_user, $db_pass, array(PDO::ATTR_PERSISTENT => true));
	$pdo->exec("set names $db_type");
} catch (Exception $e) {
	echo json_encode(array(
		"status"  => "error",
		"message" => "连接数据库失败"
	));
	die;
}

$getcitys = $pdo->prepare("select city from tb_employee group by city order by citysort asc");
$getcitys->execute();
$getcitysresult = $getcitys->fetchAll(PDO::FETCH_ASSOC);

$returnarr = array();

foreach ($getcitysresult as $thiscity) {
	$getcountrys = $pdo->prepare("select country from tb_employee where city LIKE :country group by country order by countrysort asc");
	$getcountrys->bindParam(':country', $thiscity["city"], PDO::PARAM_STR);
	$getcountrys->execute();
	$getcountrysresult = $getcountrys->fetchAll(PDO::FETCH_ASSOC);
	$temp_country_list = [];
	foreach ($getcountrysresult as $thiscountry) {
		array_push($temp_country_list, $thiscountry["country"]);
	}
	$returnarr[$thiscity["city"]] = $temp_country_list;
}
echo json_encode($returnarr);
