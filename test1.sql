drop table zt_tmp11;
create table zt_Tmp11 as
select a.*,b.offer_id plan_id,b.order_name plan_name,b.state_name
from zt_tmp10 a 
left join zt_user b on a.user_id=b.user_id;

drop table hzh_tmp12;
create table hzh_tmp12 as
select distinct a.*,case when b.user_id is not null then 1 else 0 end flag_5g
from hzh_tmp11 a
left join (select to_number(user_id) user_id from zt_tmp11 where plan_id in(select offer_id from crm3_dnp_lc_plan_1 where offer_type='5G套餐') /*union 
select user_id from so1.ins_offer_792@from_crmdba1_clone  where offer_id in(212080720876,212080720877,
212080720878,212080720879,310095400425,310095400426,310095400433) and state=1 and expire_date>sysdate*/) b on a.user_id=b.user_id;


drop table hzh_Tmp13;
create table hzh_tmp13 as
select distinct a.*,b.arpu_x arpu_dy,c.arpu_x arpu_sy,d.arpu_x arpu_s4
from hzh_tmp12 a
left join datamart.mart_group_fee_202105 b on a.user_id=b.user_id
left join datamart.mart_group_fee_202104 c on a.user_id=c.user_id
left join (select user_id,round(avg(arpu_x),2) arpu_x from (
select * from hjj_bill_202012_tcxtcz union all
select * from hjj_bill_202011_tcxtcz union all
select * from hjj_bill_202010_tcxtcz) group by user_id) d on a.user_id=d.user_id;

drop table hzh_Tmp14;
create table hzh_tmp14 as
select distinct a.*,
case when b.serv_id is not null then 1 else 0 end flag_5gzd,
case when c.user_id is not null then 1 else 0 end flag_yjt,
case when d.serv_id is not null then 1 else 0 end flag_kd,e.if_jtsx
from hzh_tmp13 a
 left join (select serv_id from xwp_wc_zy_202105 a inner join datamart.mart_int_91005_ms b on substr(a.imei,1,8)=b.tac
 where b.is_5g=1) b on a.user_id=b.serv_id
 left join crm3_dnp_user_yjt_202104 c on a.user_id=c.user_id
 left join zt_user_broadband_202104 d on a.user_id=d.user_id
 left join mart_qqt_jsk_detail_dm e on a.phone_id=e.phone_no;

select * from hzh_tmp14;