# TODO

select ips.\*,
ip.description
from info_emprod02.ingenico_parts_stat ips left join ifsapp_emprod02.inventory_part ip ON ip.part_no = ips.part_no and ip.contract = '12194'
