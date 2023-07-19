import { query } from '../db/index.js';
import fetch from "node-fetch";

/* The initial request to load all APIs and populate their responses */
export async function getApis() {
    const response = await query(`SELECT * FROM API_LIST INNER JOIN API_RESPONSE ON api_list.api_id=api_response.api_id`);

    let api;

    for(api of response.rows) {
        let fetchResponse = await fetch(api.api_url);
        if (fetchResponse !== undefined) {
            try {
                const json = await fetchResponse.json()
                updateApiResponse(api.api_id, json, true, 200, true);
            } catch (e) {
                updateApiResponse(api.api_id, {"status":"API down"}, false, 400, false);
            }
            
        }
    }


    const updatedResponse = await query(`SELECT * FROM API_LIST INNER JOIN API_RESPONSE ON api_list.api_id=api_response.api_id`);
    return updatedResponse.rows;
}



/* Create a new API entry */
export async function createApi(api) {
    if(api.api_url.length <= 0 || api.api_name.length <= 0){ 
        return undefined;
    }
    const response = await query(`INSERT INTO API_LIST (api_name, api_url, tags, doclink) VALUES ($1, $2, $3, $4) RETURNING *`, [api.api_name, api.api_url, api.tags, api.doclink]);
    const response2 = await query(`INSERT INTO API_RESPONSE (api_id) VALUES ($1) RETURNING *`,[response.rows[0].api_id]);
    return response.rows[0];
}

/* Update the API table */
export async function updateApiResponse(id, json, get_success, response_code, response_status) {
    const response = await query(`UPDATE API_RESPONSE SET json=$1, get=$2, response_code=$3, response=$4 WHERE api_id=$5 RETURNING *`, [json, get_success, response_code, response_status, id]);
    return response.rows;
}

//delete from an entry from both tables
export async function deleteApi(id){
    let response = await query("DELETE FROM api_response WHERE api_id=$1 RETURNING *", [id]);
    response = await query("DELETE FROM API_LIST WHERE api_id=$1 RETURNING *", [id]);
    return response.rows;
}
