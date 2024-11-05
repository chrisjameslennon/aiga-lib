import framework from "framework";

import { schema as contact } from "./contact.js";

export const schema = {
  id: { type: "number" },
  code: { type: "string" },
  sender: contact,
  // receiver: contact,
  agent: contact,
 
  source_currency_code : { type: "string" },
  amount_source_currency : { type: "number" },
  fee_source_currency : { type: "number" },
  net_amount_src_currency : { type: "number" },
  target_currency_code : { type: "string" },
  amount_target_currency : { type: "number" },
  transfer_reason : { type: "string" },
  funds_source : { type: "string" },
  is_distributed : { type: "boolean" },
  date_distributed : { type: "string" },
  receiver_name : { type: "string" },
  identity_confirmed : { type: "boolean" },
  identification_type : { type: "string" },
  identification : { type: "string" },

  // model defaults.
  enc_id: { type: 'string', defaultFunction: encryptId },// the encrypted value of the id. useful for using in URLs
  distributed_checkbox: { type: 'anySupportedType', defaultFunction: isDistributed },
  distributed_date_text: { type: 'anySupportedType', defaultFunction: distributedDateText },
  amount_target_currency_formatted: { type: 'anySupportedType', defaultFunction: formatTargetAmount },
};

function formatTargetAmount (primitiveValue, schema, baseObject) {
  if (baseObject.amount_target_currency){
    return baseObject.amount_target_currency.toFixed(2) + ' ' + baseObject.target_currency_code
  } else {
    return '0.00' + ' ' + baseObject.target_currency_code
  }
}

function encryptId(primitiveValue, schema, baseObject) {
  if (baseObject.id){
      return framework.helpers.cryptoHelper.encrypt(baseObject.id.toString())
  }
}

function isDistributed(primitiveValue, schema, baseObject) {

  if (baseObject.is_distributed) {
    return 'checked'
  } else {
    return undefined
  }
}

function distributedDateText(primitiveValue, schema, baseObject) {

  if (baseObject.date_distributed) {
    return 'Date paid: ' + baseObject.date_distributed
  } else {
    return undefined
  }
}