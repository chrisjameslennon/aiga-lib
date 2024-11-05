import { format } from "date-fns";

import framework from 'framework';

import * as transferSchema from '../models/transfer.js'
import * as contactSchema from '../models/contact.js'
import * as contactCrud from './contact.js'
import * as util from '../util/util.js'

// export async function createTransfer(postgresClient, transferIn) {

//     const transfer = framework.model.generateModel(transferIn, transferSchema.schema)

//     let sql = `
//     INSERT INTO transfers ( code,date_issued,amount,order_number, sender_id, receiver_id, agent_id,fully_redeemed,date_redeemed)
//     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
//     `;

//     const values = [
//         transfer.code || null,
//         transfer.date_issued || null,
//         transfer.amount || 0,
//         transfer.order_number || null,
//         transfer.woo_post_id || null,
//         transfer.sender?.id || null,
//         transfer.receiver?.id || null,
//         transfer.agent?.id || null,
//         transfer.fully_redeemed || 0,
//         transfer.date_redeemed || null
//     ];

//     const result = await postgresClient.query(sql, values);

//     if (result.rowCount !== 1){
//         throw new Error (`result rowCount was ${result.rowCount}, expected 1`)
//     }
// }

// export async function createTransferWeb(postgresCrmClient, postgresAigaClient, webTransfer) {

//     const transfer = framework.model.generateModel(webTransfer, transferSchema.schema)

//     let sqlSelect = `SELECT id FROM res_partner
//     WHERE email = $1`;

//     let sender;
//     if (transfer.sender) {
//         // create the sender if they are not already in the database
//         let result = await postgresCrmClient.query(sqlSelect, [transfer.sender.email]);

//         if (result.rows.length > 0) {
//             // there is already a sender with this email
//             // ideally perhaps we should update the sender with the new transfer details
//             // (but not sure if we would delete a field if it wasn't present in the transfer)
//             // Anyway, line ball, for now we don't do anything, the sender is already in the database, happy days
//             sender = result.rows[0];
//         } else {
//             sender = await contactCrud.createContact(postgresCrmClient, transfer.sender, 'sender')
//         }
//     }

//     let receiver;
//     if (transfer.receiver) {
//         // create the receiver if they are not already in the database
//         let result = await postgresCrmClient.query(sqlSelect, [transfer.receiver.email]);

//         if (result.rows.length > 0) {
//             // there is already a receiver with this email
//             // ideally perhaps we should update the receiver with the new transfer details
//             // (but not sure if we would delete a field if it wasn't present in the transfer)
//             // Anyway, line ball, for now we don't do anything, the receiver is already in the database, happy days
//             receiver = result.rows[0];
//         } else {
//             receiver = await contactCrud.createContact(postgresCrmClient, transfer.receiver, 'receiver');
//         }
//     }

//     let sql = `
//         INSERT INTO transfers ( code, sender_id, receiver_id, agent_id,date_issued,amount,order_number,woo_post_id)
//         VALUES ($1, $2, $3, $4, $5, $6, $7)
//         RETURNING *;
//     `;

//     const values = [
//         transfer.code || null,
//         sender?.id || null,
//         receiver?.id || null,
//         transfer.agent?.id || null,
//         transfer.date_issued || null,
//         transfer.amount || 0,
//         transfer.order_number || null,
//         transfer.woo_post_id || null
//     ];

//     await postgresAigaClient.query(sql, values);
// }

// export async function updateTransfer(postgresClient, transferIn) {
//     // Ensure that transferIn contains an id
//     if (!transferIn.id) {
//         throw new Error("Transfer ID must be provided to update a transfer.");
//     }

//     const transfer = framework.model.generateModel(transferIn, transferSchema.schema);

//     let sql = `
//     UPDATE transfers
//     SET
//         code = $1,
//         date_issued = $2,
//         amount = $3,
//         order_number = $4,
//         sender_id = $5,
//         receiver_id = $6,
//         agent_id = $7,
//         fully_redeemed = $8,
//         date_redeemed = $9,
//         woo_post_id = $10
//     WHERE id = $10;
//     `;

//     const values = [
//         transfer.code || null,
//         transfer.date_issued || null,
//         transfer.amount || 0,
//         transfer.order_number || null,
//         transfer.sender?.id || null,
//         transfer.receiver?.id || null,
//         transfer.agent?.id || null,
//         transfer.fully_redeemed || 0,
//         transfer.date_redeemed || null,
//         transfer.woo_post_id || null,
//         transfer.id  // This is the ID that will be used in the WHERE clause to identify the record to update
//     ];

//     const result = await postgresClient.query(sql, values);

//     if (result.rowCount !== 1) {
//         throw new Error(`result rowCount was ${result.rowCount}, expected 1`);
//     }
// }

// export async function deleteTransfer(postgresClient, transferId) {
//     // Check if transferId is provided
//     if (!transferId) {
//         throw new Error("Transfer ID must be provided for deletion.");
//     }

//     const sql = `
//     DELETE FROM transfers
//     WHERE id = $1;
//     `;

//     const values = [transferId];

//     await postgresClient.query(sql, values);
// }

// export async function listAllTransfers(postgresClient) {

//     // the view joins the transfers table with the odoo linked tables
//     const sql = `SELECT * FROM transfer_details`

//     console.log (sql)

//     const transferRes = await postgresClient.query(sql);
//     console.log (transferRes)

//     const transferList = []
//     for (const transferRow of transferRes.rows) {
//         transferList.push(viewRowToTransfer(transferRow))
//     }

//     console.log ('returning')
//     console.log (transferList)
//     return transferList
// }



// export async function listTransfersForSender(postgresClient, senderId) {
//     // Check if sender id is a valid number
//     if (typeof senderId !== 'number') {
//         throw new Error('Invalid sender ID; must be a number.');
//     }

//     const sql = `SELECT * FROM transfer_details
//         WHERE sender_id = $1`;

//     const transferRes = await postgresClient.query(sql, [senderId]);

//     const transferList = []
//     for (const transferRow of transferRes.rows) {
//         transferList.push(viewRowToTransfer(transferRow))
//     }

//     return transferList
// }

// export async function listTransfersForAgent(postgresClient, agentId) {
//     // Check if agentId is a valid number
//     if (typeof agentId !== 'number') {
//         throw new Error('Invalid agent ID; must be a number.');
//     }

//     const sql = `SELECT * FROM transfer_details
//         WHERE agent_id = $1`

//     const transferRes = await postgresClient.query(sql, [agentId]);

//     const transferList = []
//     for (const transferRow of transferRes.rows) {
//         transferList.push(viewRowToTransfer(transferRow))
//     }

//     return transferList
// }

export async function distributeTransfer(postgresClient, agentId, transferId, receiverName, identificationType, identification) {
    // Check if transferId is a valid number
    if (typeof transferId !== 'number') {
        throw new Error('Invalid transfer ID; must be a number.');
    }

    const sql = `UPDATE transfers
                 SET is_distributed = TRUE, agent_id = $1, date_distributed = $2, receiver_name = $3, 
                    identity_confirmed = TRUE, identification_type = $4,identification = $5
                 WHERE id = $6 RETURNING *;`;

    const params = [agentId, format(Date.now(), 'yyyy-MM-dd').toString(), receiverName, identificationType, identification, transferId]
    const transferRes = await postgresClient.query(sql, params);

    if (transferRes.rowCount === 0) {
        throw new Error('Transfer was not found');
    }

    return viewRowToTransfer(transferRes.rows[0]);
}

export async function getTransfer(postgresClient, transferId, transferCode) {

    if (!transferId && !transferCode) {
        throw new Error('one of transfer id and transfer code must be supplied')
    }
    if (transferId && transferCode) {
        throw new Error('Both transfer id and transfer code cannot be supplied')
    }

    let sql, params
    if (transferId) {
        sql = `SELECT * FROM transfer_details
        WHERE id = $1;`;
        params = [transferId]
    } else {
        sql = `SELECT * FROM transfer_details
        WHERE code = $1;`;
        params = [transferCode]
    }

    const transferRes = await postgresClient.query(sql, params);
    // console.log(transferRes.rows[0])

    if (transferRes.rowCount === 0) {
        return undefined
    }

    return viewRowToTransfer(transferRes.rows[0]);
}

// private functions

function viewRowToTransfer(row) {

    let transfer = {}
    transfer.id = row.id

    transfer.sender = row.sender_id ? { id: row.sender_id, name: row.sender_name ?? undefined, email: row.sender_email ?? undefined, mobile: row.sender_mobile ?? undefined } : undefined
    // transfer.receiver = row.receiver_id ? { id: row.receiver_id, name: row.receiver_name ?? undefined, email: row.receiver_email ?? undefined, mobile: row.receiver_mobile ?? undefined } : undefined
    transfer.agent = row.agent_id ? { id: row.agent_id, name: row.agent_name ?? undefined, email: row.agent_email ?? undefined, mobile: row.agent_mobile ?? undefined, code: row.agent_code ?? undefined } : undefined

    transfer.code = row.code
    transfer.source_currency_code = row.source_currency_code ?? undefined
    transfer.amount_source_currency = row.amount_source_currency
    transfer.fee_source_currency = row.fee_source_currency
    transfer.net_amount_src_currency = row.net_amount_src_currency
    transfer.target_currency_code = row.target_currency_code ?? undefined
    transfer.amount_target_currency = row.amount_target_currency
    transfer.transfer_reason = row.transfer_reason ?? undefined
    transfer.funds_source = row.funds_source ?? undefined
    transfer.is_distributed = framework.helpers.booleanHelper.isTrue(row.is_distributed)
    transfer.date_distributed = row.date_distributed ? format(row.date_distributed, 'yyyy-MM-dd') : undefined
    transfer.receiver_name = row.receiver_name ?? undefined
    transfer.identity_confirmed = framework.helpers.booleanHelper.isTrue(row.identity_confirmed)
    transfer.identification_type = row.identification_type ?? undefined
    transfer.identification = row.identification ?? undefined

    return framework.model.generateModel(transfer, transferSchema.schema)
}
