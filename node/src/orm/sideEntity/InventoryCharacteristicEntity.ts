import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
  expression: `
    SELECT 
      ipct.part_no,
      ipct.characteristic_code AS char_code,
      ipct.attr_value as char_val,
      REGEXP_REPLACE(ct.description, '^AI Model - (.*) time$', '\\1') AS char_desc
    FROM 
      public.inventory_part_char_tab ipct
    JOIN
      ifsapp_emrept02.characteristic_tab ct
    ON 
      ipct.characteristic_code = ct.characteristic_code
    WHERE 
      ipct.characteristic_code BETWEEN 'IV031' AND 'IV049'
      AND ipct.contract = '12194'
  `,
})
export class InventoryCharacteristic {
  @ViewColumn()
  part_no: string;

  // @ViewColumn()
  // char_code: string;

  @ViewColumn()
  char_val: string;

  @ViewColumn()
  char_desc: string;
}
