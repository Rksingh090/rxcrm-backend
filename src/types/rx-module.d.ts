export type RxFieldType = 'text' | 'number' | 'password' | 'textarea' | 'email' | 'lookup';

export interface MongoBase {
    rxid: string,
    createdAt?: string,
    updatedAt?: string,
}


export interface RxInputField extends MongoBase {
    name: string,
    dataType: RxFieldType,
    displayName: string,
    attrs: Attribute
    value?: string,
    lookup_module?: RxLookupField // for lookup field module
    lookup_field?: RxLookupField // for lookup field module
}


interface RxLookupField {
    name?: string,
    _id?: string
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