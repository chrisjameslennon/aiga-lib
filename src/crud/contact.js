import { format } from "date-fns";

import framework from 'framework';

import * as contactSchema from '../models/contact.js';

export async function getCategories(postgresClient, refreshCache) {

    const categories = framework.cache.get('odooCategories');

    if (categories && !refreshCache) {
        return categories;
    }

    const sql = `SELECT * FROM res_partner_category`;

    const result = await postgresClient.query(sql);

    for (const row of result.rows) {
        row.tag = Object.values(row.name)[0];
    }

    framework.cache.set('odooCategories', result.rows);

    return result.rows;
}

export async function createContact(postgresClient, webContact, type) {

    if (!type) {
        throw new Error('A type must be supplied');
    }

    if (!['sender', 'receiver', 'agent'].includes(type)) {
        throw new Error('Invalid type')
    }

    const contact = framework.model.generateModel(webContact, contactSchema.schema)

    // Prepare the SQL query for inserting a new contact
    let sql = `
        INSERT INTO res_partner ( name, complete_name, email, mobile,type,active)
        VALUES ($1, $1, $2, $3, 'contact',TRUE)
        RETURNING *;
    `;

    const values = [
        // contact.id,
        contact.name || null, // Allow null for optional fields
        contact.email || null,
        contact.mobile || null,
    ];

    let result = await postgresClient.query(sql, values);

    const contactCreated = result.rows[0];

    const tagRecords = await getCategories(postgresClient);
    let tagId;
    for (const tagRecord of tagRecords) {
        if (tagRecord.tag === type) {
            tagId = tagRecord.id;
            break;
        }
    }

    if (!tagId) {
        throw new Error(`Tag "${type}" was not found in res_partner_category. The contact has been added, but not tagged`);
    }

    sql = `
    INSERT INTO res_partner_res_partner_category_rel ( category_id, partner_id)
    VALUES (${tagId},${contactCreated.id})
`;

    await postgresClient.query(sql);

    // Return the newly created contact
    return contactCreated;

}

export async function getContactsByType(postgresClient, type) {
    const sql = `SELECT * 
                FROM public.res_partner_with_categories 
                WHERE category_names @> ARRAY[$1];`;

    const res = await postgresClient.query(sql, [type]);

    const contacts = [];

    for (const row of res.rows){
        let contact = {};
        contact.id = row.id;
        contact.name = row.name;
        contact.email = row.email ?? undefined;
        contact.mobile = row.mobile ?? undefined;
        contact.agent_code = row.ref ?? undefined;
    
        contacts.push (framework.model.generateModel(contact, contactSchema.schema));
    }

    return contacts;
}

export async function getAgentByCode(postgresClient, agentCode) {

    const sql = `SELECT * FROM res_partner
    WHERE ref = $1;`;

    const agentRes = await postgresClient.query(sql, [agentCode]);

    if (agentRes.rowCount === 0) {
        return undefined
    }

    let agent = {}
    agent.id = agentRes.rows[0].id
    agent.name = agentRes.rows[0].name
    agent.email = agentRes.rows[0].email ?? undefined
    agent.mobile = agentRes.rows[0].mobile ?? undefined
    agent.agent_code = agentRes.rows[0].ref ?? undefined

    return framework.model.generateModel(agent, contactSchema.schema)
}
