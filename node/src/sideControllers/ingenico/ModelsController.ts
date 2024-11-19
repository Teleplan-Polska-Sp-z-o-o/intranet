// SELECT
//     ipct.part_no,
//     ipct.characteristic_code AS char_code,
//     ipct.attr_value as char_val,
//     REGEXP_REPLACE(ct.description, '^AI Model - (.*) time$', '\1') AS char_desc
// FROM
//     public.inventory_part_char_tab ipct
// JOIN
//     ifsapp_emrept02.characteristic_tab ct
// ON
//     ipct.characteristic_code = ct.characteristic_code
// WHERE
// 	ipct.characteristic_code BETWEEN 'IV031' AND 'IV049'
// 	and ipct.contract = '12194';

import { Request, Response } from "express";
import { HttpResponseMessage } from "../../enums/response";
import { InventoryCharacteristic } from "../../orm/sideEntity/postgres/InventoryCharacteristicEntity";
import { SideDataSources } from "../../config/SideDataSources";

const getIngenicoModels = async (req: Request, res: Response): Promise<Response> => {
  try {
    const ingenicoModels: InventoryCharacteristic[] = await SideDataSources.postgres.query(`
      SELECT 
        ipct.part_no,
        ipct.attr_value AS char_val,
        REGEXP_REPLACE(ct.description, '^AI Model - (.*) time$', '\\1') AS char_desc
      FROM 
        public.inventory_part_char_tab ipct
      JOIN
        ifsapp_emrept02.characteristic_tab ct
      ON 
        ipct.characteristic_code = ct.characteristic_code
      WHERE 
        ipct.characteristic_code BETWEEN 'IV031' AND 'IV049'
        AND ipct.contract = '12194';
    `);

    return res.status(200).json({
      models: ingenicoModels,
      message: "Ingenico models retrieved successfully",
      statusMessage: HttpResponseMessage.GET_SUCCESS,
    });
  } catch (error) {
    console.error("Error retrieving Ingenico models:", error);
    return res.status(500).json({
      models: [],
      message: "Unknown error occurred. Failed to retrieve Ingenico models.",
      statusMessage: HttpResponseMessage.UNKNOWN,
    });
  }
};

export { getIngenicoModels };
