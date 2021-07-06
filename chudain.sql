--===导入投诉号码
create table zsy_tmp140 (phone_id varchar2(20));

select  *  from zsy_tmp140 for update 


create table zsy_tmp141 as 
select * from zsy_tmp139  union all
select * from zsy_tmp140 



---===导入客户经理号码 
drop table zsy_tmp1;  
create table zsy_tmp1 (phone_id varchar2(15));
select * from zsy_tmp1 for update;  

---==详单
drop table zsy_tmp2;
create table zsy_tmp2 as
select a.bill_month,a.user_number,a.user_id,a.opp_user_number,a.call_type,a.duration,a.start_time
from jf.dr_gsm_792_20210203@jfxdcx a 
inner join zsy_tmp b on a.user_number=b.s_tel
inner join zsy_tmp1 c on a.opp_user_number=c.phone_id where 1=2; 

select  max(start_time)  from zsy_tmp2 

Declare  
p_bill_date varchar2(8);---zhoushuangye---
b_date varchar2(8);
e_date varchar2(8);
v_sql varchar2(1024);
m Number(4);
i Number;
rec varchar2(2000);
begin
/*Execute Immediate 'Truncate Table zt_zsy_temp2';*/
b_date:='20210416';
e_date:='20210421';
m:=to_date(e_date,'yyyymmdd')-to_date(b_date,'yyyymmdd');
Loop
 p_bill_date  := to_char(to_date(e_date,'yyyymmdd')-m,'yyyymmdd');
 execute immediate 'insert into zsy_tmp2 
select a.bill_month,a.user_number,a.user_id,a.opp_user_number,a.call_type,a.duration,a.start_time
from jf.dr_gsm_792_'||p_bill_date||'@jfxdcx a 
inner join zsy_tmp141 b on substr(a.user_number,1,11)=substr(b.s_tel,1,11)
inner join zsy_tmp1 c on substr(a.opp_user_number,1,11)=substr(c.phone_id,1,11) ';
 commit;
 Exit When m=0;
  m:=m-1;
  End Loop;
  End; 

--==投诉接触情况


select *  from zt_zsy_tmp 

select distinct a.*,case when b.user_number is not null then 1 else 0 end 接触
from zsy_tmp141 a
left join zsy_tmp2 b on a.phone_id=b.user_number;  



    RowDataPacket {
      phoneNumber: '13970257999',
      '地市': '九江',
      '集团名称(与证件上一致)': '江西全鑫科技化工有限公司',
      '集团成员手机号': '13970257999',
      '建档集团编号(92、JX)': 'JX0003391661',
      '建档集团名称': '江西全鑫科技化工有限公司',
      '区县编号': '9218',
      '看管人BOSS工号': '79206023',
      '看管人姓名': '陈敏',
      '看管人手机号码': '15279200188',
      '集团成员姓名': '樊祥',
      '集团成员职务': '',
      '关键成员标识\n(下拉可选)': '8-副科级',
      '成员属性\n(下拉可选)': '4-关键人',
      '看管线条\n(下拉可选)': '集客',
      '主管/网格长姓名': '喻爱林',
      '主管/网格长工号': '79206342',
      '主管/网格长手机号码': '13507025836',
      '备注': '0129提供',
      '是否走访': '是'
    },


---集客触点汇总数据提取 
SELECT f.* ,(f.通话用户数/f.目标用户数) as 通话率,(f.走访用户数/f.目标用户数) as 走访率 from  (select COALESCE(d.区县编号,'总计') AS 区县编号,count(区县编号) 目标用户数,SUM(d.是否通话) 通话用户数,SUM(d.是否走访) 走访用户数  from
(select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
(select b.s_tel,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
 from sheet1 a INNER JOIN converse b on a.集团成员手机号 = b.s_tel) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) d GROUP BY 区县编号 WITH ROLLUP) f 


 =A1&B1&C1&D1&E1&F1&G1&H1&I1&J1&K1&L1&M1&N1&O1&P1&Q1&R1&S1&T1&U1&V1&W1&X1&Y1&Z1&AA1



select m.*,n.二月流量,n.imei from (select e.*,f.三月流量 from (select b.s_tel,sum(total单位kb)  as 四月流量 from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202104 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel) e right join 
(select b.s_tel,sum(total单位kb)  as 三月流量 from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202103 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel) f on e.phone_id = f.s_tel) m right join
(select b.s_tel,sum(total单位kb)  as 二月流量,b.imei from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202102 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel,b.imei) n on m.phone_id = n.s_tel








--小微取数需求
--select * from crm3_dnp_lc_plan_1 where REGEXP_LIKE(offer_value,'18')

--drop table crm3_hzh_small;
--create table crm3_hzh_small(s_id varchar(100),s_name varchar(100),s_type varchar(100),s_typecode varchar(100),
--s_tel varchar(100),s_pname varchar(100),s_citycode varchar(100),s_cityname varchar(100),s_wanggename varchar(100),s_adname varchar(100));

--  套餐值 select * from crm3_dnp_lc_plan_1
select * from crm3_hzh_small
select b.*, a.state_name,a.offer_id,a.order_name,a.create_date,a.county_name,a.organize_name,a.weigth,a.is_kd,a.is_zdyj,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id from crm3_zt_sa a 
right join crm3_hzh_small b on b.s_tel = a.phone_id


--drop table crm3_hzh_flowsmall;
--create table crm3_hzh_flowsmall as
select m.*,n.二月流量 from (select e.*,f.三月流量 from (select b.s_tel,sum(total单位kb)  as 四月流量 from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202104 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel) e right join 
(select b.s_tel,sum(total单位kb)  as 三月流量 from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202103 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel) f on e.s_tel = f.s_tel) m right join
(select b.s_tel,sum(total单位kb)  as 二月流量,b.imei from 
(select b.s_tel,a.rating_res total单位kb,a.imei from zt_gprs_202102 a right join crm3_hzh_small b on a.user_number = b.s_tel) b 
group by b.s_tel,b.imei) n on m.s_tel = n.s_tel


select * from crm3_zt_sa
select * from zt_gprs_202104
select m.四月流量,m.三月流量,m.二月流量 from crm3_hzh_flowsmall m right join (select b.*, a.state_name,a.offer_id,a.order_name,a.create_date,a.county_name,a.organize_name,a.weigth,a.is_kd,a.is_zdyj,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id from crm3_zt_sa a 
right join crm3_hzh_small b on b.s_tel = a.phone_id) n on m.s_tel = n.s_tel




select f.*,g.offer_value from (select b.*,a.* from crm3_hzh_flowsmall a right join (select b.*, a.state_name,a.offer_id,a.order_name,a.create_date,a.county_name,a.organize_name,a.weigth,a.is_kd,a.is_zdyj,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id from crm3_zt_sa a 
right join crm3_hzh_small b on b.s_tel = a.phone_id) b on a.s_tel = b.s_tel) f left join crm3_dnp_lc_plan_1 g on f.offer_id = g.offer_id


select b.*,a.* from crm3_hzh_flowsmall a right join (select b.*, a.state_name,a.offer_id,a.order_name,a.create_date,a.county_name,a.organize_name,a.weigth,a.is_kd,a.is_zdyj,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id from crm3_zt_sa a 
right join crm3_hzh_small b on b.s_tel = a.phone_id) b on a.s_tel = b.s_tel



select * from crm3_dnp_lc_plan_1



select * from crm3_hzh_flowsmall m right join ()



















select b.*, a.state_name,a.offer_id,a.order_name,a.create_date,a.county_name,a.organize_name,a.weigth,a.is_kd,a.is_zdyj,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id from crm3_zt_sa a 
right join crm3_hzh_small b on b.s_tel = a.phone_id

create table crm3_hzh_small(s_id varchar(100),s_name varchar(100),s_type varchar(100),s_typecode varchar(100),
s_tel varchar(100),s_pname varchar(100),s_citycode varchar(100),s_cityname varchar(100),s_wanggename varchar(100),s_adname varchar(100));






,
a.fee_1 四月消费,a.fee_2 三月消费,a.fee_3 二月消费,a.volume_1 四月语音,a.volume_2 三月语音,a.volume_3 二月语音,a.积分,a.offer_id



 SELECT f.* ,concat(TRUNCATE((f.通话用户数/f.目标用户数)* 100,2),'%') as 通话率,concat(TRUNCATE((f.走访用户数/f.目标用户数)* 100,2),'%') as 走访率 from  
 (select COALESCE(d.区县编号,'总计') AS 区县编号,count(区县编号) 目标用户数,sum(case when d.是否通话 ='是' then 1 else 0 end) 通话用户数,sum(case when d.是否走访 ='是' then 1 else 0 end) 走访用户数  from
      (select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
    (select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
   from sheet1 a INNER JOIN converse b on a.集团成员手机号 = b.phone_id) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) d GROUP BY 区县编号,d.是否通话,d.是否走访 WITH ROLLUP) f ;


SELECT f.* ,concat(TRUNCATE((f.通话用户数/f.目标用户数)* 100,2),'%') as 通话率,concat(TRUNCATE((f.走访用户数/f.目标用户数)* 100,2),'%') as 走访率 from  
(select COALESCE(d.看管人姓名,'总计') AS 看管人姓名,d.区县编号,count(看管人姓名) 目标用户数,SUM(d.是否通话) 通话用户数,SUM(d.是否走访) 走访用户数  from
      (select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
      (select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
       from sheet1 a INNER JOIN converse b on a.集团成员手机号 = b.phone_id) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) d GROUP BY 区县编号,看管人姓名  WITH ROLLUP) f ;


-- 
-- 以导入的excel表得到通话人数7847条
-- select * from (select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
--      (select b.phone_id,a.*,case when b.是否通话 = 1 then '是' else '否' end 是否通话
				from sheet1 a RIGHT JOIN converse b on a.集团成员手机号 = b.phone_id ) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) q where q.是否通话 = '是' 

                for (var val1 in tableData1) {
                  var itemData1 = tableData1[val1]
                  for (var i = 0; i < itemData1.data.length; i++) {
                  // 0为表头数据
                    if (i === 0) {
                      singleIndex = itemData1.data[i].findIndex((item) => item === itemData1.data[0][0])
                      continue
                    }
                    // var regx1 = /(1[\d]{2}[\s]?[\d]{4}[\s]?[\d]{4})/g
                    var str1 = itemData1.data[i]
                    // var phoneNums1 = str1.match(regx1)
                    // if (phoneNums1 !== null) {
                    // }
                    userTableData1.push(str1)
                  }
                  console.log('通话表数据提取：', userTableData1)
                  var phoneData1 = [];
                  (async() => {
                    pool.getConnection((err, conn) => {
                      if (err) throw err
                      var sql = `Truncate Table converse;`
                      conn.query(sql, (err, result) => {
                        if (err) throw err
                      })
                      conn.release()
                    })
                    for (const i of userTableData1) {
                      const sql = `insert converse(phone_id,是否通话) values('${i[0]}','${i[1]}')`
                      await insert(sql)
                      phoneData1.push(i[0])
                    }
                    console.log('通话表已经导入数据库')
                    resolve()
                  })()
                }


--以匹配本地数据库 的方式进行通话记录查询
select * from (select a.* ,case when c.phoneNumber  is not null then '是' else '否' end 是否走访  from 
      (select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
      from sheet1 a RIGHT JOIN converse b on a.集团成员手机号 = b.phone_id ) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) q where q.是否通话 = '是' 














