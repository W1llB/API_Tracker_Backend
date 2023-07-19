import { pool } from "./index.js";

export async function createApisTable() {
  return await pool.query(
    `CREATE TABLE api_list (
        api_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  		  user_id varchar(100),
        api_name varchar(100),
        endpoint_url varchar(200),
  		  docs_url varchar(200),
        tags varchar(100),
  		  status integer,
  		  response_code integer,
  		  last_downtime Date
      );`
  );
}

export async function dropApisTable() {
  return await pool.query(`DROP TABLE if exists api_list;`);
}

export async function seedApisTables() {
  return await pool.query(
    `INSERT into api_list (user_id, api_name, endpoint_url, docs_url, tags, status, response_code, last_downtime ) VALUES ('e96e4c6d-e0cf-4ca0-82e3-354ed8e9c9a6','Astronomy Picture of the Day','https://go-apod.herokuapp.com/apod','https://go-apod.herokuapp.com/','astronomy, images', 1, 200, 'August 19, 1975 23:15:30');`
  );
}

export async function resetApisTable() {
  return [
    await dropApisTable(),
    await createApisTable(),
    await seedApisTables(),
  ];
}
