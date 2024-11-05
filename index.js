import * as crudContact from './src/crud/contact.js';
import * as crudTransfer from './src/crud/transfer.js';
import * as modelsContact from './src/models/contact.js';
import * as modelsTransfer from './src/models/transfer.js';
import * as utilUtil from './src/util/util.js'

export default {
  crud :{
    contact:crudContact,
    transfer:crudTransfer
  },
  models:{
    contact:modelsContact,
    transfer:modelsTransfer
  },
  util:utilUtil
};