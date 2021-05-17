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
inner join zsy_tmp b on a.user_number=b.phone_id
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
inner join zsy_tmp141 b on substr(a.user_number,1,11)=substr(b.phone_id,1,11)
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
(select b.phone_id,a.* , case when a.地市 is not null then '是' else '否' end 是否通话 
 from sheet1 a INNER JOIN converse b on a.集团成员手机号 = b.phone_id) a LEFT JOIN tel c on a.phone_id = c.phoneNumber) d GROUP BY 区县编号 WITH ROLLUP) f 