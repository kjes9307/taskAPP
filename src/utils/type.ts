export interface DataType {
    _id?:string,
    name?:string,
    todoList? : DataType[]
    userList? : UserDataType[]
    personId?: string
}
export type ItemProps = {
    item: DataType
    index?: number
    creator? : string
}

export interface UserDataType {
    _id?:string,
    name?:string,
}

export type IfuncProps = {
    searchItem:(newObj:{name?:string,personId?:string})=>void
    userList: UserDataType[]
    param: {name?:string,personId?:string}
}