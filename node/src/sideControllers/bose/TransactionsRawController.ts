/*

SELECT
	wosh.ID As Id,
    woh.ProgramID AS Contract,
    u.Username,  
    woh.PartNo,
    woh.SerialNo,
    ( -- from
        SELECT TOP 1 cwscd.Code
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.WorkStationID
    ) AS WorkStationCode,
    (
        SELECT TOP 1 cwscd.Description
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.WorkStationID
    ) AS WorkStationDesc,
    ( -- to
        SELECT TOP 1 cwscd.Code
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.ToWorkStationID
    ) AS NextWorkStationCode,
    (
        SELECT TOP 1 cwscd.Description
        FROM pls.CodeWorkStationCustomDescription cwscd
        WHERE cwscd.CodeWorkStationID = wosh.ToWorkStationID
    ) AS NextWorkStationDesc,
    woh.LastActivityDate
    
FROM 
    pls.WOHeader AS woh
INNER JOIN 
    pls.WOStationHistory wosh ON woh.ID = wosh.WOHeaderID
INNER JOIN 
    pls.[User] u ON woh.UserID = CAST(u.ID AS INT)
WHERE 
	woh.ProgramID = '10058' -- bose
    and wosh.Iteration = 1

*/
