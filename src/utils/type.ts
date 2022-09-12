export interface DataType {
    _id?:string,
    name?:string,
    todoList? : DataType[]
}
export type ItemProps = {
    item: DataType
    index?: number
}

export interface UserDataType {
    _id?:string,
    name?:string,
}