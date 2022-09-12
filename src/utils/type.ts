export interface DataType {
    _id?:string,
    name?:string,
    todoList? : DataType[]
    userList? : UserDataType[]
    personId?: string
}
export type ItemProps = {
    item: Partial<DataType>
    index?: number
    creator? : string
}

export interface UserDataType {
    _id?:string,
    name?:string,
    personId?:string
}

export type IfuncProps = {
    searchItem:(newObj:Pick<DataType,'name'|'personId'>)=>void
    userList: UserDataType[]
    param: Partial<UserDataType>
}