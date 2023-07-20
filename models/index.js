import { query } from "../db/index.js";

/* The initial request to load all APIs and populate their responses */
export async function getApis() {
  const response = await query(`SELECT * FROM api_list;`);
  return response.rows;
}

/* Create a new API entry */
export async function createApi(api) {
  if (api.api_url.length <= 0 || api.api_name.length <= 0) {
    return undefined;
  }
  const response = await query(
    `INSERT into api_list (user_id, api_name, endpoint_url, docs_url, tags, status, response_code, last_downtime ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
    [
      api.user_id,
      api.api_name,
      api.endpoint_url,
      api.docs_url,
      api.tags,
      api.status,
      api.responseCode,
      api.last_downtime,
    ]
  );
  return response.rows[0];
}

/* Update the API table */
export async function updateApiResponse(
  apiId,
  status,
  responseCode,
  lastDowntime
) {
  const response = await query(
    `UPDATE api_list SET status=$1, response_code=$2, last_downtime=$3 WHERE api_id=$5 RETURNING *`,
    [status, responseCode, lastDowntime, apiId]
  );
  return response.rows;
}

//delete from an entry from both tables
export async function deleteApi(apiId) {
  console.log(apiId);
  let response = await query(
    "DELETE FROM api_list WHERE api_id=$1 RETURNING *;",
    [apiId]
  );
  return response.rows;
}
