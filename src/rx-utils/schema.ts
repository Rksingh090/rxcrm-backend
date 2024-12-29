import mongoose from 'mongoose';
import { RxModule } from '../types/rx-module';
import { connectToMongo } from '../config/db';

const createDynamicSchema = (moduleJson: RxModule) => {
  const schemaFields: any = {};

  moduleJson.fields.forEach((field: any) => {
    let fieldSchema: any = { type: String }; // Default to String

    switch (field.dataType) {
      case 'email':
        fieldSchema = { type: String, match: /.+\@.+\..+/ }; // Email validation
        break;
      case 'number':
        fieldSchema = { type: Number };
        break;
      case 'lookup':
        fieldSchema = {
          type: mongoose.Schema.Types.ObjectId,
          ref: field.lookup.lookup_module_name
        }; // Foreign key (lookup)
        break;
      // Add other data types as needed
      default:
        fieldSchema = { type: String };
    }

    // Attach additional attributes
    if (field.attrs && field.attrs.defaultValue !== undefined) {
      fieldSchema.default = field.attrs.defaultValue;
    }

    if (field.attrs && field.attrs.placeholder) {
      fieldSchema.placeholder = field.attrs.placeholder; // Custom metadata
    }

    schemaFields[field.name] = fieldSchema;
  });

  const dynamicSchema = new mongoose.Schema(schemaFields, {
    timestamps: true, // Add createdAt and updatedAt
  });

  return dynamicSchema;
};

export const createOrGetModel = async (moduleJson: RxModule) => {
  const modelName = moduleJson.name;

  const db = await connectToMongo();
  return db.collection(modelName);
};