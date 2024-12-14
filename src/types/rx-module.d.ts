export type RxFieldType = 'text' | 'number' | 'password' | 'textarea' | 'email' | 'lookup';

export interface MongoBase {
    rxid: string,
    createdAt?: string,
    updatedAt?: string,
}

interface RxLookupField {
    lookup_field_id?: string,
    lookup_field_name?: string,
    lookup_module_id?: string,
    lookup_module_name?: string,
}

export interface RxInputField extends MongoBase {
    _id: string,
    name: string,
    dataType: RxFieldType,
    displayName: string,
    attrs: Attribute
    value?: string,
    lookup?: RxLookupField // for lookup field module    
}


export interface Attribute {
    defaultValue?: string;
    placeholder?: string;
    className?: string;
}

export interface RxModule extends MongoBase {
    name: string,
    displayName: string,
    fields: RxInputField[];
}