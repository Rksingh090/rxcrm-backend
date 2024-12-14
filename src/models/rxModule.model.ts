import mongoose, { Schema } from 'mongoose';
import { Attribute, RxInputField, RxModule } from '../types/rx-module';

const AttributeSchema = new Schema<Attribute>({
  defaultValue: {
    type: String, default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
});

// Define a Mongoose schema for the RxInputField
const RXInputFieldSchema = new Schema<RxInputField>({
  name: {
    type: String,
    required: true
  },
  dataType: {
    type: String,
    enum: ['text', 'number', 'password', 'textarea', 'email', 'lookup'],
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: ''
  },
  attrs: {
    type: AttributeSchema,
    required: true
  },
  lookup_module: {
    name: {
      type: String
    },
    _id: {
      type: String
    }
  },
  lookup_field: {
    name: {
      type: String
    },
    _id: {
      type: String
    }
  }
});

// Define a Mongoose schema for the RxModule
const RXModuleSchema = new Schema<RxModule>({
  // Name of the form or collection of fields
  name: { type: String, required: true },
  displayName: { type: String, required: true },
  // Array of input fields
  fields: { type: [RXInputFieldSchema], required: true },
}, {
  timestamps: true
});

// Define a Mongoose model for interacting with the "RxModule" collection
const RxModuleModel = mongoose.model<RxModule>('RxModule', RXModuleSchema);

export default RxModuleModel; // Export the model for use in other parts of the application